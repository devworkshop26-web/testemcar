"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle,
  Award,
  ExternalLink,
  Camera,
  Pencil,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VehicleHeaderProps {
  vehicle: {
    id: string
    titre: string
    numero_immatriculation: string
    ville: string
    zone?: string
    est_disponible: boolean
    est_certifie: boolean
  }
}

const VehicleHeader: React.FC<VehicleHeaderProps> = ({ vehicle }) => {
  const navigate = useNavigate()

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
        <button
          onClick={() => navigate("/prestataire/fleet")}
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Ma flotte</span>
        </button>
        <span className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground/90 truncate max-w-[280px]">
          {vehicle.titre}
        </span>
      </div>

      {/* Main Header */}
      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-border/40
          bg-gradient-to-br from-background via-background to-muted/20
          shadow-lg shadow-black/5
        "
      >
        <div className="relative px-6 py-5 sm:px-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT SECTION */}
          <div className="flex-1 space-y-4">
            {/* Title + Status */}
            <div className="flex items-start gap-4">
              {/* <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/prestataire/fleet")}
                className="
                  rounded-2xl shrink-0 h-11 w-11
                  border-border/60
                  hover:bg-accent/50
                  transition-all
                "
              >
                <ArrowLeft className="w-5 h-5" />
              </Button> */}

              <div className="flex-1 space-y-2">
                {/* TITLE + BADGES INLINE */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                    {vehicle.titre}
                  </h1>

                  {/* Disponibilité */}
                  {vehicle.est_disponible ? (
                    <Badge className="h-6 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full px-3 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Disponible
                    </Badge>
                  ) : (
                    <Badge className="h-6 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded-full px-3 text-xs">
                      Indisponible
                    </Badge>
                  )}

                  {/* Certification */}
                  {vehicle.est_certifie && (
                    <Badge className="h-6 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full px-3 text-xs flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Certifié
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm pl-[60px]">
              <div className="font-mono font-semibold bg-muted/80 px-3 py-1.5 rounded-lg border border-border/60">
                {vehicle.numero_immatriculation}
              </div>

              <span className="text-muted-foreground/30">•</span>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{vehicle.ville}</span>
              </div>

              {vehicle.zone && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground">{vehicle.zone}</span>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SECTION — ACTION BUTTONS */}
          <div className="flex flex-row flex-wrap gap-2.5 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(`/prestataire/vehicle/${vehicle.id}/edit`)}
              className="gap-2 rounded-xl"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/vehicule/${vehicle.id}`)}
              className="gap-2 rounded-xl"
            >
              <ExternalLink className="w-4 h-4" />
              Page publique
            </Button>

            <Button
              onClick={() =>
                navigate(`/prestataire/vehicle/${vehicle.id}/photos`)
              }
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              <Camera className="w-4 h-4" />
              Gérer les photos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VehicleHeader
