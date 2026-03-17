import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IdentityProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculeIdentitySection({
  control,
  categories,
  transmissions,
  fuelTypes,
  statusList,
  proprietaire,
  loadingSelect,
}: IdentityProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 2" />
        <CardTitle>Identité & catégorie</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="categorie">Catégorie *</Label>
          <Controller
            control={control}
            name="categorie"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} disabled={categories.length === 0} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="categorie">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nom ?? category.nom ?? category.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type_vehicule">Type de véhicule *</Label>
          <Controller
            control={control}
            name="type_vehicule"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="type_vehicule">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="TOURISME">Véhicule de tourisme</SelectItem>
                  <SelectItem value="UTILITAIRE">Véhicule utilitaire</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="transmission">Transmission *</Label>
          <Controller
            control={control}
            name="transmission"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="transmission">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir une transmission"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {transmissions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label ?? item.nom ?? item.type ?? "Transmission"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type_carburant">Type de carburant *</Label>
          <Controller
            control={control}
            name="type_carburant"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="type_carburant">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir un carburant"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      {fuel.nom ?? fuel.label ?? fuel.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="statut">Statut *</Label>
          <Controller
            control={control}
            name="statut"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="statut">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir un statut"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {statusList.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.nom ?? status.label ?? status.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="proprietaire">Propriétaire *</Label>
          <Controller
            control={control}
            name="proprietaire"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger id="proprietaire">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir un propriétaire"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {proprietaire?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
