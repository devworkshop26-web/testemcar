import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FeaturesProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculeFeaturesSection({ register, watch, setValue }: FeaturesProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 5" />
        <CardTitle>Caractéristiques</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre_places">Nombre de places</Label>
          <Input id="nombre_places" type="number" min={1} max={10} {...register("nombre_places", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre_portes">Nombre de portes</Label>
          <Input id="nombre_portes" type="number" min={2} max={6} {...register("nombre_portes", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="couleur">Couleur</Label>
          <Input id="couleur" {...register("couleur")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kilometrage_actuel_km">Kilométrage actuel (km)</Label>
          <Input
            id="kilometrage_actuel_km"
            type="number"
            min={0}
            {...register("kilometrage_actuel_km", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="volume_coffre_litres">Volume coffre (L)</Label>
          <Input id="volume_coffre_litres" type="number" min={0} {...register("volume_coffre_litres", { valueAsNumber: true })} />
        </div>
      </CardContent>
    </Card>
  )
}

