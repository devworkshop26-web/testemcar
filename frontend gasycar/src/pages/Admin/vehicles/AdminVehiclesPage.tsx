// src/pages/admin/vehicles/AdminVehiclesPage.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { useVehiculesQuery, useDeleteVehiculeMutation } from "@/useQuery/vehiculeUseQuery"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { Vehicule } from "@/types/vehiculeType"

export function AdminVehiclesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: vehicles = [], isLoading, isFetching } = useVehiculesQuery()
  const deleteMutation = useDeleteVehiculeMutation()

  
  
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicule | null>(null)

  const handleDelete = async () => {
    if (!vehicleToDelete) return

    try {
      await deleteMutation.mutateAsync(vehicleToDelete.id)
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès.",
      })
      setVehicleToDelete(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (vehicle: Vehicule) => {
    if (vehicle.est_disponible) {
      return <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-700">Indisponible</Badge>
  }

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
                      <TableHead>Année</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Prix/Jour</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.titre}</TableCell>
                        <TableCell>
                          {vehicle.marque?.nom || "N/A"} {vehicle.modele?.label || ""}
                        </TableCell>
                        <TableCell>{vehicle.annee}</TableCell>
                        <TableCell>{vehicle.ville}</TableCell>
                        <TableCell>{vehicle.prix_jour} {vehicle.devise}</TableCell>
                        <TableCell>{getStatusBadge(vehicle)}</TableCell>
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

      {/* Delete Confirmation Dialog */}
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
  )
}

