import React, { useState } from "react";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useVehicleAvailabilityQuery, useCreateVehicleAvailabilityMutation, useDeleteVehicleAvailabilityMutation, useUpdateVehicleAvailabilityMutation } from "@/useQuery/vehicleAvailabilityUseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VehicleAvailabilityCalendar from "@/components/vehicule/VehicleAvailabilityCalendar";
import { Loader2, Plus, Trash2, Calendar as CalendarIcon, AlertCircle, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const VehicleAvailabilityPage = () => {
  const { user } = useCurentuser();
  const { data: vehicles, isLoading: isLoadingVehicles } = useOwnerVehiculesQuery(user?.id || "");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<"BLOCKED" | "MAINTENANCE">("BLOCKED");
  const [description, setDescription] = useState("");

  const { data: availabilities, isLoading: isLoadingAvailabilities } = useVehicleAvailabilityQuery(selectedVehicleId);
  const createMutation = useCreateVehicleAvailabilityMutation();
  const updateMutation = useUpdateVehicleAvailabilityMutation();
  const deleteMutation = useDeleteVehicleAvailabilityMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) return;

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: {
            start_date: startDate,
            end_date: endDate,
            type: type,
            description: description,
          }
        });
        toast.success("Disponibilité mise à jour avec succès");
      } else {
        await createMutation.mutateAsync({
          vehicle: selectedVehicleId,
          start_date: startDate,
          end_date: endDate,
          type: type,
          description: description,
        });
        toast.success("Disponibilité ajoutée avec succès");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    }
  };

  const handleEdit = (availability: any) => {
    setEditingId(availability.id);
    setStartDate(availability.start_date);
    setEndDate(availability.end_date);
    setType(availability.type);
    setDescription(availability.description || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette période ?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Disponibilité supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setStartDate("");
    setEndDate("");
    setType("BLOCKED");
    setDescription("");
  };

  if (isLoadingVehicles) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Disponibilités</h1>
          <p className="text-gray-500 mt-1">Gérez les périodes d'indisponibilité et de maintenance de vos véhicules.</p>
        </div>
      </div>

      {/* SÉLECTION DU VÉHICULE */}
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <Label htmlFor="vehicle-select" className="mb-2 block font-medium">Sélectionner un véhicule</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger id="vehicle-select" className="w-full">
                  <SelectValue placeholder="Choisir un véhicule..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.titre} - {vehicle.numero_immatriculation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedVehicleId && (
               <div className="flex-1 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  Sélectionnez les dates où votre véhicule n'est pas disponible pour éviter les réservations imprévues.
               </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedVehicleId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CALENDRIER */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-primary" /> Calendrier
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="gap-2">
                      <Plus className="w-4 h-4" /> Ajouter une indisponibilité
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingId ? "Modifier la période" : "Ajouter une période d'indisponibilité"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Date de début</Label>
                          <Input
                            id="start-date"
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">Date de fin</Label>
                          <Input
                            id="end-date"
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Type d'indisponibilité</Label>
                        <Select value={type} onValueChange={(val: "BLOCKED" | "MAINTENANCE") => setType(val)}>
                          <SelectTrigger id="type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BLOCKED">Indisponible (Bloqué)</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optionnel)</Label>
                        <Textarea
                          id="description"
                          placeholder="Raison de l'indisponibilité..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                          {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {editingId ? "Mettre à jour" : "Enregistrer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="flex justify-center p-6">
                <VehicleAvailabilityCalendar vehicleId={selectedVehicleId} className="w-full max-w-md" />
              </CardContent>
            </Card>
          </div>

          {/* LISTE DES INDISPONIBILITÉS */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-md flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Liste des périodes</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[600px] pr-2">
                {isLoadingAvailabilities ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : availabilities && availabilities.length > 0 ? (
                  <div className="space-y-3">
                    {availabilities
                      .filter(a => a.type !== 'RESERVED') // On ne gère pas les réservations ici, juste bloqué/maintenance
                      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                      .map((availability) => (
                      <div key={availability.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            availability.type === 'MAINTENANCE' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {availability.type === 'MAINTENANCE' ? 'Maintenance' : 'Bloqué'}
                          </span>
                          <div className="flex gap-1 -mt-1 -mr-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-blue-500"
                              onClick={() => handleEdit(availability)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                              onClick={() => handleDelete(availability.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {format(parseISO(availability.start_date), "dd MMM yyyy", { locale: fr })} - {format(parseISO(availability.end_date), "dd MMM yyyy", { locale: fr })}
                        </div>
                        {availability.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{availability.description}</p>
                        )}
                      </div>
                    ))}
                    {availabilities.filter(a => a.type !== 'RESERVED').length === 0 && (
                        <p className="text-center text-gray-500 py-4 italic">Aucune indisponibilité manuelle enregistrée.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>Aucune donnée disponible.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <CarIconPlaceholder className="w-20 h-20 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">Aucun véhicule sélectionné</h3>
          <p className="text-gray-500 mt-2 max-w-md text-center">
            Veuillez sélectionner un véhicule dans la liste ci-dessus pour gérer ses disponibilités et voir son calendrier.
          </p>
        </div>
      )}
    </div>
  );
};

// Petit composant icône pour le placeholder
const CarIconPlaceholder = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export default VehicleAvailabilityPage;
