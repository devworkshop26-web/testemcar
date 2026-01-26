"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Coins, Save, RotateCcw, MapPin, Lightbulb, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FieldRow from "../FieldRow"
import type { Vehicule } from "@/types/vehiculeType"
import { useUpdateVehiculeMutation } from "@/useQuery/vehiculeUseQuery"
import { useToast } from "@/components/ui/use-toast"

interface PricingState {
  devise: string
  prix_heure: string
  prix_jour: string
  prix_par_semaine: string
  prix_mois: string
  montant_caution: string
  province_prix_jour: string
  province_prix_par_semaine: string
}

interface PricingTabProps {
  pricing: PricingState
  setPricing: React.Dispatch<React.SetStateAction<PricingState>>
  vehicle: Vehicule
  onSave?: () => void // Rendu optionnel car géré en interne maintenant
}

const PricingTab: React.FC<PricingTabProps> = ({ pricing, setPricing, vehicle, onSave }) => {
  const { toast } = useToast()
  const updateMutation = useUpdateVehiculeMutation()
  const [isSaving, setIsSaving] = useState(false)

  // État initial basé sur le véhicule (pour détecter les changements et le reset)
  const initialState: PricingState = useMemo(
    () => ({
      devise: "MGA",
      prix_heure: vehicle.prix_heure ? String(vehicle.prix_heure) : "",
      prix_jour: vehicle.prix_jour ? String(vehicle.prix_jour) : "",
      prix_par_semaine: vehicle.prix_par_semaine ? String(vehicle.prix_par_semaine) : "",
      prix_mois: vehicle.prix_mois ? String(vehicle.prix_mois) : "",
      montant_caution: vehicle.montant_caution ? String(vehicle.montant_caution) : "",
      province_prix_jour: vehicle.province_prix_jour ? String(vehicle.province_prix_jour) : "",
      province_prix_par_semaine: vehicle.province_prix_par_semaine
        ? String(vehicle.province_prix_par_semaine)
        : "",
    }),
    [vehicle],
  )

  const hasChanges = useMemo(() => {
    return JSON.stringify(pricing) !== JSON.stringify(initialState)
  }, [pricing, initialState])

  const handleReset = () => {
    setPricing(initialState)
  }

  const handleSaveInternal = async () => {
    if (!vehicle.id) {
      toast({
        title: "Erreur",
        description: "Identifiant du véhicule introuvable.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const formData = new FormData()

      if (pricing.prix_jour) formData.append("prix_jour", pricing.prix_jour)
      if (pricing.prix_heure) formData.append("prix_heure", pricing.prix_heure)
      if (pricing.prix_par_semaine) formData.append("prix_par_semaine", pricing.prix_par_semaine)
      if (pricing.prix_mois) formData.append("prix_mois", pricing.prix_mois)
      if (pricing.montant_caution) formData.append("montant_caution", pricing.montant_caution)

      // Ajout des champs Province
      if (pricing.province_prix_jour) formData.append("province_prix_jour", pricing.province_prix_jour)
      if (pricing.province_prix_par_semaine)
        formData.append("province_prix_par_semaine", pricing.province_prix_par_semaine)

      // Toujours envoyer la devise
      formData.append("devise", pricing.devise || "MGA")

      // Appel API via la mutation existante
      await updateMutation.mutateAsync({
        id: String(vehicle.id),
        payload: formData,
      })

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-slate-900">
              Succès
            </span>
          </div>
        ),
        description: (
          <span className="text-slate-600">
            Les tarifs ont été mis à jour avec succès.
          </span>
        ),
        className:
          "bg-white border border-slate-200 shadow-md rounded-xl",
      })

      // Si une fonction onSave a été passée par le parent (ex: pour rafraîchir les données), on l'appelle
      if (onSave) onSave()

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des tarifs.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            Configuration des tarifs
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Définissez vos tarifs pour maximiser vos revenus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Pricing */}
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-transparent to-transparent border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-semibold">Tarifs principaux</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Tarifs appliqués pour les locations dans la ville
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <FieldRow label="Devise" hint="La devise est fixée en MGA">
              <Input
                value="MGA"
                disabled
                className="bg-muted/60 font-semibold cursor-not-allowed opacity-100 text-foreground border-0 rounded-lg"
              />
            </FieldRow>

            {[
              { label: "Prix par heure", key: "prix_heure", placeholder: "10 000" },
              { label: "Prix par jour", key: "prix_jour", placeholder: "120 000" },
              { label: "Prix par semaine", key: "prix_par_semaine", placeholder: "700 000" },
              { label: "Prix par mois", key: "prix_mois", placeholder: "2 500 000" },
              { label: "Montant de caution", key: "montant_caution", placeholder: "200 000" },
            ].map((field) => (
              <FieldRow key={field.key} label={field.label}>
                <div className="relative">
                  <Input
                    type="number"
                    value={pricing[field.key as keyof PricingState]}
                    onChange={(e) => setPricing((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="pr-12 rounded-lg bg-background border border-input hover:border-primary/30 focus:border-primary transition-colors duration-200"
                    placeholder={field.placeholder}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary pointer-events-none">
                    MGA
                  </span>
                </div>
              </FieldRow>
            ))}
          </CardContent>
        </Card>

        {/* Province Pricing */}
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-accent/20 via-transparent to-transparent border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Tarifs Province
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Tarifs pour les locations hors de la ville principale
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <FieldRow label="Prix par jour (Province)">
              <div className="relative">
                <Input
                  type="number"
                  value={pricing.province_prix_jour}
                  onChange={(e) => setPricing((p) => ({ ...p, province_prix_jour: e.target.value }))}
                  className="pr-12 rounded-lg bg-background border border-input hover:border-primary/30 focus:border-primary transition-colors duration-200"
                  placeholder="150 000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary pointer-events-none">
                  MGA
                </span>
              </div>
            </FieldRow>

            <FieldRow label="Prix par semaine (Province)">
              <div className="relative">
                <Input
                  type="number"
                  value={pricing.province_prix_par_semaine}
                  onChange={(e) => setPricing((p) => ({ ...p, province_prix_par_semaine: e.target.value }))}
                  className="pr-12 rounded-lg bg-background border border-input hover:border-primary/30 focus:border-primary transition-colors duration-200"
                  placeholder="900 000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary pointer-events-none">
                  MGA
                </span>
              </div>
            </FieldRow>

            {/* Info Box */}
            <div className="rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 p-4 mt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Astuce</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Si vous laissez ces champs vides, les tarifs Province ne seront pas affichés. Les locations hors
                    ville utiliseront les tarifs principaux.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions - Bouton Annuler masqué si aucune modification */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
            className="gap-2 border-border/60 hover:border-destructive/50 hover:text-destructive transition-all duration-200 text-muted-foreground bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            Annuler les modifications
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSaveInternal}
          disabled={!hasChanges || isSaving}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les tarifs
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default PricingTab