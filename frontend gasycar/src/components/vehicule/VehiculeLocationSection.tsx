import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculeLocationSection({ register }: LocationProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 3" />
        <CardTitle>Localisation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="adresse_localisation">Adresse *</Label>
          <Input id="adresse_localisation" {...register("adresse_localisation", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ville">Ville *</Label>
          <Input id="ville" {...register("ville", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zone">Zone</Label>
          <Input id="zone" {...register("zone")} />
        </div>
      </CardContent>
    </Card>
  )
}

