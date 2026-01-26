import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { OptionsProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculeOptionsSection({ register, watch, setValue }: OptionsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 6" />
        <CardTitle>Options &amp; publication</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-base font-medium">Certification</p>
              <p className="text-sm text-muted-foreground">Marquez le véhicule comme certifié.</p>
            </div>
            <Switch checked={watch("est_certifie")} onCheckedChange={(checked) => setValue("est_certifie", checked)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-base font-medium">Disponibilité</p>
              <p className="text-sm text-muted-foreground">Afficher le véhicule comme disponible.</p>
            </div>
            <Switch checked={watch("est_disponible")} onCheckedChange={(checked) => setValue("est_disponible", checked)} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" rows={4} placeholder="Décrivez le véhicule" {...register("description", { required: true })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="conditions_particulieres">Conditions particulières</Label>
          <Textarea
            id="conditions_particulieres"
            rows={3}
            placeholder="Ex: pas de conduite hors route"
            {...register("conditions_particulieres")}
          />
        </div>
      </CardContent>
    </Card>
  )
}

