// src/pages/admin/vehicles/AdminVehicleDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery"
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Settings, Loader2, User, Image as ImageIcon } from "lucide-react"

export function AdminVehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: vehicle, isLoading } = useVehiculeQuery(id)

  if (isLoading) {
    return (
      <AdminPageShell title="Détails du véhicule" description="Chargement...">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageShell>
    )
  }

  if (!vehicle) {
    return (
      <AdminPageShell title="Véhicule introuvable" description="Ce véhicule n'existe pas.">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Véhicule introuvable</p>
            <Button onClick={() => navigate("/admin/vehicles")} className="mt-4">
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell
      title={vehicle.titre}
      description={`${vehicle.marque_data?.nom || "N/A"} ${vehicle.modele_data?.label || ""} - ${vehicle.annee}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/vehicles")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button onClick={() => navigate(`/admin/vehicles/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Photos Section */}
        {vehicle.photos && Array.isArray(vehicle.photos) && vehicle.photos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos du véhicule ({vehicle.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehicle.photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
                  >
                    <img
                      src={photo.image}
                      alt={`Photo ${index + 1} - ${vehicle.titre}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E"
                      }}
                    />
                    {photo.is_primary && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-600">Principale</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Photos Message */}
        {(!vehicle.photos || !Array.isArray(vehicle.photos) || vehicle.photos.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos du véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune photo disponible pour ce véhicule</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Titre</p>
                <p className="font-medium">{vehicle.titre}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Marque</p>
                  <p className="font-medium">{vehicle.marque_data?.nom || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modèle</p>
                  <p className="font-medium">{vehicle.modele_data?.label || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Année</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {vehicle.annee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Immatriculation</p>
                  <p className="font-medium">{vehicle.numero_immatriculation}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Numéro de série</p>
                <p className="font-medium">{vehicle.numero_serie}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Propriétaire</p>
                <p className="font-medium flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {vehicle.proprietaire_data?.username || vehicle.proprietaire_data?.email || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{vehicle.adresse_localisation}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ville</p>
                  <p className="font-medium">{vehicle.ville}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium">{vehicle.zone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prix / Jour</p>
                  <p className="font-medium text-lg">{vehicle.prix_jour} {vehicle.devise}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prix / Heure</p>
                  <p className="font-medium">{vehicle.prix_heure || "N/A"} {vehicle.devise}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prix / Mois</p>
                  <p className="font-medium">{vehicle.prix_mois || "N/A"} {vehicle.devise}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Caution</p>
                  <p className="font-medium">{vehicle.montant_caution} {vehicle.devise}</p>
                </div>
              </div>
              {vehicle.remise_longue_duree_pourcent && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Remise longue durée</p>
                    <p className="font-medium">{vehicle.remise_longue_duree_pourcent}%</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <p className="font-medium">{vehicle.categorie_data?.nom || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-medium">{vehicle.transmission_data?.nom || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Carburant</p>
                  <p className="font-medium">{vehicle.type_carburant_data?.nom || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Couleur</p>
                  <p className="font-medium">{vehicle.couleur}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Places</p>
                  <p className="font-medium">{vehicle.nombre_places}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Portes</p>
                  <p className="font-medium">{vehicle.nombre_portes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coffre (L)</p>
                  <p className="font-medium">{vehicle.volume_coffre_litres || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Kilométrage</p>
                <p className="font-medium">{vehicle.kilometrage_actuel_km.toLocaleString()} km</p>
              </div>
            </CardContent>
          </Card>

          {/* Statut */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Statut et disponibilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Disponibilité</p>
                  {vehicle.est_disponible ? (
                    <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700">Indisponible</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Certification</p>
                  {vehicle.est_certifie ? (
                    <Badge className="bg-blue-100 text-blue-700">Certifié</Badge>
                  ) : (
                    <Badge variant="outline">Non certifié</Badge>
                  )}
                </div>
              </div>
              {vehicle.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{vehicle.description}</p>
                  </div>
                </>
              )}
              {vehicle.conditions_particulieres && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Conditions particulières</p>
                    <p className="text-sm">{vehicle.conditions_particulieres}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  )
}
