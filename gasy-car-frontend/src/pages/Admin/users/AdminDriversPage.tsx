import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Eye, UserPlus } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useDriversQuery, useDeleteDriverMutation } from "@/useQuery/driverUseQuery";
import { Driver } from "@/Actions/driverApi";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function AdminDriversPage() {
    const { data: drivers, isLoading } = useDriversQuery();
    const deleteMutation = useDeleteDriverMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

    const filteredDrivers = drivers?.filter((driver) =>
        `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone_number.includes(searchTerm)
    );

    const handleDelete = (driver: Driver) => {
        setDeletingDriver(driver);
    };

    const confirmDelete = () => {
        if (deletingDriver) {
            deleteMutation.mutate(deletingDriver.id, {
                onSuccess: () => {
                    toast.success("Chauffeur supprimé avec succès");
                    setDeletingDriver(null);
                },
                onError: () => {
                    toast.error("Erreur lors de la suppression du chauffeur");
                }
            });
        }
    };

    return (
        <AdminPageShell
            title="Gestion des Chauffeurs"
            description="Gérez les chauffeurs de la plateforme."
        >
            <div className="flex justify-between items-center mb-6">
                <Input
                    placeholder="Rechercher par nom ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                {/* <Button asChild>
          <Link to="/admin/users/drivers/create">
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un chauffeur
          </Link>
        </Button> */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Chauffeurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Expérience</TableHead>
                                <TableHead>Téléphone</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date d'ajout</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        Chargement des chauffeurs...
                                    </TableCell>
                                </TableRow>
                            ) : filteredDrivers && filteredDrivers.length > 0 ? (
                                filteredDrivers.map((driver) => (
                                    <TableRow key={driver.id}>
                                        <TableCell className="font-medium">
                                            {driver.first_name} {driver.last_name}
                                        </TableCell>
                                        <TableCell>{driver.experience_years} ans</TableCell>
                                        <TableCell>{driver.phone_number}</TableCell>
                                        <TableCell>
                                            {driver.is_available ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                    Disponible
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Occupé</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(driver.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild title="Voir détails">
                                                    <Link to={`/admin/users/drivers/${driver.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild title="Modifier">
                                                    <Link to={`/admin/users/drivers/${driver.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(driver)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Aucun chauffeur trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!deletingDriver} onOpenChange={() => setDeletingDriver(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le chauffeur{" "}
                            <span className="font-semibold text-foreground">
                                {deletingDriver?.first_name} {deletingDriver?.last_name}
                            </span> ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageShell>
    );
}
