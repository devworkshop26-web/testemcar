import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PricingProps } from "./types"
import { SectionBadge } from "./SectionBadge"

export function VehiculePricingSection({ register }: PricingProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <SectionBadge text="Étape 4" />
        <CardTitle>Tarification</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="URBAIN" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="URBAIN">Zone Urbaine (Standard)</TabsTrigger>
            <TabsTrigger value="PROVINCE">Province (Hors-ville)</TabsTrigger>
          </TabsList>

          <TabsContent value="URBAIN" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prix_jour">Prix par jour *</Label>
                <Input id="prix_jour" type="number" min={0} step={1000} {...register("prix_jour", { required: true, valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prix_heure">Prix par heure</Label>
                <Input id="prix_heure" type="number" min={0} step={500} {...register("prix_heure", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prix_mois">Prix par mois</Label>
                <Input id="prix_mois" type="number" min={0} step={10000} {...register("prix_mois", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prix_par_semaine">Prix par semaine</Label>
                <Input id="prix_par_semaine" type="number" min={0} step={5000} {...register("prix_par_semaine", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remise_par_heure">Remise par heure (%)</Label>
                <Input id="remise_par_heure" type="number" min={0} max={100} step={1} {...register("remise_par_heure", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remise_par_jour">Remise par jour (%)</Label>
                <Input id="remise_par_jour" type="number" min={0} max={100} step={1} {...register("remise_par_jour", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remise_par_mois">Remise par mois (%)</Label>
                <Input id="remise_par_mois" type="number" min={0} max={100} step={1} {...register("remise_par_mois", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remise_longue_duree_pourcent">Remise longue durée (%)</Label>
                <Input
                  id="remise_longue_duree_pourcent"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  {...register("remise_longue_duree_pourcent", { valueAsNumber: true })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="PROVINCE" className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                Optionnel : Remplissez ces champs uniquement si le véhicule est disponible en province avec des tarifs différents.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province_prix_jour">Prix par jour (Province)</Label>
                <Input id="province_prix_jour" type="number" min={0} step={1000} {...register("province_prix_jour", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_prix_heure">Prix par heure (Province)</Label>
                <Input id="province_prix_heure" type="number" min={0} step={500} {...register("province_prix_heure", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_prix_mois">Prix par mois (Province)</Label>
                <Input id="province_prix_mois" type="number" min={0} step={10000} {...register("province_prix_mois", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_prix_par_semaine">Prix par semaine (Province)</Label>
                <Input id="province_prix_par_semaine" type="number" min={0} step={5000} {...register("province_prix_par_semaine", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_remise_par_heure">Remise par heure (%)</Label>
                <Input id="province_remise_par_heure" type="number" min={0} max={100} step={1} {...register("province_remise_par_heure", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_remise_par_jour">Remise par jour (%)</Label>
                <Input id="province_remise_par_jour" type="number" min={0} max={100} step={1} {...register("province_remise_par_jour", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_remise_par_mois">Remise par mois (%)</Label>
                <Input id="province_remise_par_mois" type="number" min={0} max={100} step={1} {...register("province_remise_par_mois", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province_remise_longue_duree_pourcent">Remise longue durée (%)</Label>
                <Input
                  id="province_remise_longue_duree_pourcent"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  {...register("province_remise_longue_duree_pourcent", { valueAsNumber: true })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 mt-6 pt-6 border-t">
          <div className="space-y-2">
            <Label htmlFor="devise">Devise</Label>
            <Input id="devise" placeholder="MGA" {...register("devise", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="montant_caution">Montant caution *</Label>
            <Input
              id="montant_caution"
              type="number"
              min={0}
              step={1000}
              {...register("montant_caution", { required: true, valueAsNumber: true })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

