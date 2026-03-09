import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDriversQuery, useCreateDriverMutation, useUpdateDriverMutation, useDeleteDriverMutation } from "@/useQuery/driverUseQuery";
import { Driver } from "@/Actions/driverApi";
import { toast } from "sonner";
import DriverList from "@/components/driver/DriverList";
import DriverForm from "@/components/driver/DriverForm";
import { useCurentuser } from "@/useQuery/authUseQuery";

const DriversView = () => {
    const { data: drivers, isLoading, isError } = useDriversQuery();
    const { user } = useCurentuser();
    const navigate = useNavigate();
    const createMutation = useCreateDriverMutation();
    const updateMutation = useUpdateDriverMutation();
    const deleteMutation = useDeleteDriverMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenDialog = (driver?: Driver) => {
        if (driver) {
            setEditingDriver(driver);
        } else {
            setEditingDriver(null);
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: FormData) => {
        try {
            if (editingDriver) {
                await updateMutation.mutateAsync({ id: editingDriver.id, payload: data });
                toast.success("Chauffeur mis à jour");
            } else {
                await createMutation.mutateAsync(data);
                toast.success("Chauffeur créé");
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {
            await deleteMutation.mutateAsync(id);
            toast.success("Chauffeur supprimé");
        }
    };

    // Filtering
    const ownedDrivers = drivers?.filter((driver) =>
        user?.id ? driver.owner === user.id : true
    );
    const filteredDrivers = ownedDrivers?.filter(driver =>
        driver.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-6 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
    if (isError) return <div className="p-6 text-red-500">Erreur de chargement des chauffeurs</div>;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-gray-900">Mes Chauffeurs</h1>
                    <p className="text-gray-500">Gérez votre équipe de chauffeurs</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un chauffeur
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Rechercher un chauffeur..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List Component */}
            <DriverList
                drivers={filteredDrivers}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onView={(driver) => navigate(`/prestataire/drivers/${driver.id}`)}
            />

            {/* Form Component */}
            <DriverForm
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingDriver}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default DriversView;
