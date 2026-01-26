"use client"

import { useState } from "react"
import { useSupportQuery } from "@/useQuery/supportUseQuery"
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery"
import { useReservationsQuery } from "@/useQuery/reservationsUseQuery"
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import {
  Loader2,
  ArrowLeft,
  LifeBuoy,
  AlertCircle,
  Wrench,
  CreditCard,
  HelpCircle,
  Car,
  CalendarDays,
  MessageSquare,
  CheckCircle2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// --- CONFIGURATION D'AFFICHAGE (FRANÇAIS) ---
const ticketTypes = ["TECHNICAL", "CONFLICT", "PAYMENT", "OTHER"]
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]

type TicketScope = "GENERAL" | "RESERVATION" | "VEHICLE"

const typeLabels: Record<string, { label: string; icon: any }> = {
  TECHNICAL: { label: "Problème Technique", icon: Wrench },
  CONFLICT: { label: "Conflit / Litige", icon: AlertCircle },
  PAYMENT: { label: "Paiement / Facturation", icon: CreditCard },
  OTHER: { label: "Autre demande", icon: HelpCircle },
}

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  LOW: { label: "Basse", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Moyenne", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  HIGH: { label: "Haute", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  URGENT: { label: "Urgente", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200" },
}

export default function CreateTicketPrestataire() {
  const { data: currentUser } = useCurrentUserQuery()
  const { toast } = useToast()
  const navigate = useNavigate()

  const { createTicketMutation, refetchTickets } = useSupportQuery()
  const { data: reservations = [] } = useReservationsQuery()
  const { data: vehicles = [] } = useOwnerVehiculesQuery(currentUser?.id)

  const [isLoading, setIsLoading] = useState(false)
  const [scope, setScope] = useState<TicketScope>("GENERAL")

  const [form, setForm] = useState({
    title: "",
    description: "",
    ticket_type: "",
    priority: "MEDIUM",
    status: "OPEN",
    reservation: null as string | null,
    vehicule: null as string | null,
  })

  const handleSubmit = () => {
    if (!currentUser) return

    if (!form.title || !form.description || !form.ticket_type) {
      toast({
        title: "Champs manquants",
        description: "Merci de remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const payload = {
      ...form,
      user: currentUser.id,
      assigned_admin: null,
      reservation: scope === "RESERVATION" ? form.reservation : null,
      vehicule: scope === "VEHICLE" ? form.vehicule : null,
    }

    createTicketMutation.mutate(payload, {
      onSuccess: () => {
        refetchTickets()
        toast({
          title: "Ticket créé avec succès",
          description: "Notre équipe traitera votre demande rapidement.",
          className: "bg-emerald-600 text-white border-none",
        })
        navigate("/prestataire/supports/my-tickets")
      },
      onError: () => {
        toast({ title: "Erreur", description: "Impossible de créer le ticket.", variant: "destructive" })
        setIsLoading(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full border-slate-200 hover:bg-white hover:text-blue-600 transition-all shadow-sm bg-white hover:shadow-md mt-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Créer un Ticket Support</h1>
            <p className="text-slate-600 text-base">Décrivez votre problème et notre équipe vous aidera rapidement.</p>
          </div>
        </div>

        {/* Main Card with improved styling */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-200/50 overflow-hidden backdrop-blur-sm">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 w-full" />

          <div className="p-8 md:p-10 space-y-10">
            {/* Section 1: Subject & Scope */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Informations générales</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Sujet de la demande
                  </Label>
                  <Input
                    placeholder="Ex: Problème de synchronisation..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="h-11 bg-slate-50/80 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5 text-blue-600" /> Concerne
                  </Label>
                  <Select
                    value={scope}
                    onValueChange={(v) => {
                      setScope(v as TicketScope)
                      setForm({ ...form, reservation: null, vehicule: null })
                    }}
                  >
                    <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="GENERAL">Question Générale</SelectItem>
                      <SelectItem value="RESERVATION">Une Réservation</SelectItem>
                      <SelectItem value="VEHICLE">Un Véhicule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {scope === "RESERVATION" && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" /> Sélectionner la réservation
                  </Label>
                  <Select value={form.reservation || ""} onValueChange={(v) => setForm({ ...form, reservation: v })}>
                    <SelectTrigger className="bg-white border-blue-200 h-10 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500/30">
                      <SelectValue placeholder="Choisir une réservation..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {reservations.map((res) => (
                        <SelectItem key={res.id} value={res.id}>
                          {res.vehicle_data?.marque_data?.nom} {res.vehicle_data?.modele_data?.label} —{" "}
                          {new Date(res.start_datetime).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {scope === "VEHICLE" && (
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <Car className="w-3.5 h-3.5" /> Sélectionner le véhicule
                  </Label>
                  <Select value={form.vehicule || ""} onValueChange={(v) => setForm({ ...form, vehicule: v })}>
                    <SelectTrigger className="bg-white border-indigo-200 h-10 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500/30">
                      <SelectValue placeholder="Choisir un véhicule..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.marque_data?.nom} {v.modele_data?.label} — {v.numero_immatriculation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Section 2: Type & Priority */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Type et priorité</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Type de ticket</Label>
                  <Select value={form.ticket_type} onValueChange={(v) => setForm({ ...form, ticket_type: v })}>
                    <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30">
                      <SelectValue placeholder="Sélectionnez le type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {ticketTypes.map((t) => {
                        const info = typeLabels[t] || { label: t, icon: HelpCircle }
                        const Icon = info.icon
                        return (
                          <SelectItem key={t} value={t}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-500" />
                              <span>{info.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Niveau d'urgence</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30">
                      <SelectValue placeholder="Définir la priorité..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {priorities.map((p) => {
                        const config = priorityConfig[p]
                        return (
                          <SelectItem key={p} value={p}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${config.color} opacity-75`} />
                              <span className="font-medium">{config.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority indicator badge */}
              {form.priority && (
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${priorityConfig[form.priority].bgColor}`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${priorityConfig[form.priority].color}`} />
                  <span className={`text-sm font-medium ${priorityConfig[form.priority].color}`}>
                    Priorité: {priorityConfig[form.priority].label}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Section 3: Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Détails</h2>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Description détaillée
                </Label>
                <Textarea
                  placeholder="Décrivez votre problème en détail ici pour nous aider à vous répondre plus rapidement..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[160px] bg-slate-50/80 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none p-4 text-base leading-relaxed placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Plus vous détaillez, plus vite nous pouvons résoudre votre problème.
                </p>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 h-12 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" /> Envoi en cours...
                  </div>
                ) : (
                  "Envoyer le ticket"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
