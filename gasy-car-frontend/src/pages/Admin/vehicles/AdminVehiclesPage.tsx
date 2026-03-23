import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useVehiculesQuery, useDeleteVehiculeMutation } from "@/useQuery/vehiculeUseQuery";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Edit, Trash2, Plus, Loader2, Clock3, CheckCircle2, XCircle, FileWarning } from "lucide-react";
import { Vehicule } from "@/types/vehiculeType";
import { vehiculeAPI } from "@/Actions/vehiculeApi";

export function AdminVehiclesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: vehicles = [], isLoading, isFetching } = useVehiculesQuery();
  const deleteMutation = useDeleteVehiculeMutation();

  const detailQueries = useQueries({
    queries: (vehicles || []).map((vehicle) => ({
      queryKey: ["vehicule-one", vehicle.id],
      queryFn: async () => (await vehiculeAPI.get_one_vehicule(vehicle.id)).data,
      enabled: !!vehicle.id,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const detailedById = useMemo(() => {
    const map = new Map<string, Vehicule>();
    for (const q of detailQueries) {
      if (q.data?.id) map.set(q.data.id, q.data);
    }
    return map;
  }, [detailQueries]);

  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicule | null>(null);

  const handleDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteMutation.mutateAsync(vehicleToDelete.id);
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès.",
      });
      setVehicleToDelete(null);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule.",
        variant: "destructive",
      });
    }
  };

  const getWorkflowBadge = (vehicle: Vehicule) => {
    const detail = detailedById.get(vehicle.id);
    const workflow = detail?.workflow_status;

    if (workflow === "PENDING_REVIEW") {
      return (
        <Badge className="bg-amber-100 text-amber-700 gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          En attente
        </Badge>
      );
    }

    if (workflow === "PUBLISHED") {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Publié
        </Badge>
      );
    }

    if (workflow === "REJECTED") {
      return (
        <Badge className="bg-red-100 text-red-700 gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Rejeté
        </Badge>
      );
    }

    return <Badge className="bg-slate-100 text-slate-700">Brouillon</Badge>;
  };

  const getDocsBadge = (vehicle: Vehicule) => {
    const detail = detailedById.get(vehicle.id);

    if (!detail) {
      return <Badge variant="outline">Chargement…</Badge>;
    }

    if (!detail.documents_complete) {
      return (
        <Badge className="bg-orange-100 text-orange-700 gap-1">
          <FileWarning className="h-3.5 w-3.5" />
          Incomplets
        </Badge>
      );
    }

    if (!detail.documents_validated) {
      return <Badge className="bg-slate-100 text-slate-700">À vérifier</Badge>;
    }

    return <Badge className="bg-indigo-100 text-indigo-700">Validés</Badge>;
  };

  const getAvailabilityBadge = (vehicle: Vehicule) => {
    if (vehicle.est_disponible) {
      return <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">Indisponible</Badge>;
  };

  return (
    <AdminPageShell
      title="Véhicules"
      description="Gérez tous les véhicules de la plateforme."
      actions={
        <Button onClick={() => navigate("/admin/vehicles/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau véhicule
        </Button>
      }
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Véhicules listés ({vehicles.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun véhicule trouvé. Créez-en un pour commencer.
            </div>
          ) : (
            <div className="relative">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Actualisation des données...</p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Marque/Modèle</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Prix/Jour</TableHead>
                      <TableHead>Disponibilité</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.titre}</TableCell>
                        <TableCell>
                          {vehicle.marque_data?.nom || "N/A"} {vehicle.modele_data?.label || ""}
                        </TableCell>
                        <TableCell>{vehicle.ville || "—"}</TableCell>
                        <TableCell>
                          {vehicle.prix_jour} {vehicle.devise}
                        </TableCell>
                        <TableCell>{getAvailabilityBadge(vehicle)}</TableCell>
                        <TableCell>{getWorkflowBadge(vehicle)}</TableCell>
                        <TableCell>{getDocsBadge(vehicle)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setVehicleToDelete(vehicle)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le véhicule "{vehicleToDelete?.titre}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}