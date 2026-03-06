import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectionBadge } from "./SectionBadge"
import { MainInfoProps } from "./types"

export function VehiculeMainInfo({
  register,
  control,
  errors,
  marques,
  filteredModeles,
  loadingSelect,
  marquesLoading,
  modelesLoading,
  watch,
}: MainInfoProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 1" />
        <CardTitle>Informations principales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titre">Titre *</Label>
          <Input id="titre" placeholder="Toyota RAV4 Adventure" {...register("titre", { required: true })} />
          {errors.titre && <p className="text-sm text-destructive">Le titre est requis.</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marque">Marque *</Label>
          <Controller
            control={control}
            name="marque"
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={(value) => field.onChange(value)} disabled={marquesLoading}>
                <SelectTrigger id="marque">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir une marque"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {marques.map((marque) => (
                    <SelectItem key={marque.id} value={marque.id}>
                      {marque.nom ?? marque.label ?? marque.name ?? marque.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.marque && <p className="text-sm text-destructive">La marque est obligatoire.</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="modele">Modèle *</Label>
          <Controller
            control={control}
            name="modele"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                disabled={!watch("marque") || modelesLoading}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger id="modele">
                  <SelectValue placeholder={loadingSelect ? "Chargement..." : "Choisir un modèle"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {filteredModeles.map((modele) => (
                    <SelectItem key={modele.id} value={modele.id}>
                      {modele.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.modele && <p className="text-sm text-destructive">Le modèle est requis.</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="annee">Année *</Label>
          <Input
            id="annee"
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            {...register("annee", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="numero_immatriculation">N° immatriculation *</Label>
          <Input
            id="numero_immatriculation"
            placeholder="1234 ABC"
            {...register("numero_immatriculation", { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="numero_serie">N° série (VIN)</Label>
          <Input id="numero_serie" placeholder="VF1AB123456789" {...register("numero_serie")} />
        </div>
      </CardContent>
    </Card>
  )
}

