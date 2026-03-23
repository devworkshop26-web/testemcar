"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { useSupportQuery } from "@/useQuery/supportUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useReservationsQuery } from "@/useQuery/reservationsUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import type {
  CreateSupportTicketPayload,
  TicketPriority,
  TicketType,
} from "@/types/supportTypes";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  LifeBuoy,
  Loader2,
  MessageSquare,
  Wrench,
} from "lucide-react";

type TicketScope = "GENERAL" | "RESERVATION" | "VEHICLE";

const scopeCards: {
  value: TicketScope;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    value: "GENERAL",
    title: "Question générale",
    description: "Pour une demande globale sans réservation ni véhicule précis.",
    icon: LifeBuoy,
  },
  {
    value: "RESERVATION",
    title: "Réservation",
    description: "Pour un problème lié à une réservation spécifique.",
    icon: CalendarDays,
  },
  {
    value: "VEHICLE",
    title: "Véhicule",
    description: "Pour un problème lié à un véhicule en particulier.",
    icon: Car,
  },
];

const ticketTypes: TicketType[] = ["TECHNICAL", "CONFLICT", "PAYMENT", "OTHER"];
const priorities: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const typeLabels: Record<TicketType, { label: string; icon: any; helper: string }> = {
  TECHNICAL: {
    label: "Problème technique",
    icon: Wrench,
    helper: "Bug, erreur d'affichage, dysfonctionnement",
  },
  CONFLICT: {
    label: "Conflit / litige",
    icon: AlertCircle,
    helper: "Désaccord, réclamation, incident relationnel",
  },
  PAYMENT: {
    label: "Paiement / facturation",
    icon: CreditCard,
    helper: "Paiement échoué, montant, facture, remboursement",
  },
  OTHER: {
    label: "Autre demande",
    icon: HelpCircle,
    helper: "Toute autre demande de support",
  },
};

const priorityConfig: Record<
  TicketPriority,
  { label: string; hint: string; tone: string; dot: string }
> = {
  LOW: {
    label: "Basse",
    hint: "Peut attendre",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  MEDIUM: {
    label: "Moyenne",
    hint: "Traitement standard",
    tone: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  HIGH: {
    label: "Haute",
    hint: "Impact important",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  URGENT: {
    label: "Urgente",
    hint: "Action rapide nécessaire",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

export default function CreateTicketPrestataire() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: currentUser } = useCurrentUserQuery();
  const { createTicketMutation, refetchTickets } = useSupportQuery();

  const { data: reservations = [] } = useReservationsQuery();
  const { data: vehicles = [] } = useOwnerVehiculesQuery(currentUser?.id);

  const [scope, setScope] = useState<TicketScope>("GENERAL");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    description: string;
    ticket_type: TicketType | "";
    priority: TicketPriority;
    reservation: string | null;
    vehicule: string | null;
  }>({
    title: "",
    description: "",
    ticket_type: "",
    priority: "MEDIUM",
    reservation: null,
    vehicule: null,
  });

  const ownerReservations = useMemo(() => {
    if (!currentUser?.id) return [];
    return reservations.filter((reservation) => {
      const ownerId =
        reservation.vehicle_data?.proprietaire ||
        reservation.vehicle_data?.proprietaire_data?.id ||
        null;

      return String(ownerId) === String(currentUser.id);
    });
  }, [currentUser?.id, reservations]);

  const contextIsValid =
    scope === "GENERAL" ||
    (scope === "RESERVATION" && !!form.reservation) ||
    (scope === "VEHICLE" && !!form.vehicule);

  const canSubmit =
    !!form.title.trim() &&
    !!form.description.trim() &&
    !!form.ticket_type &&
    contextIsValid &&
    !isLoading;

  const handleScopeChange = (value: TicketScope) => {
    setScope(value);
    setForm((prev) => ({
      ...prev,
      reservation: null,
      vehicule: null,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim() || !form.ticket_type) {
      toast({
        title: "Informations manquantes",
        description: "Merci de compléter le sujet, le type et la description.",
        variant: "destructive",
      });
      return;
    }

    if (scope === "RESERVATION" && !form.reservation) {
      toast({
        title: "Réservation requise",
        description: "Sélectionnez la réservation concernée.",
        variant: "destructive",
      });
      return;
    }

    if (scope === "VEHICLE" && !form.vehicule) {
      toast({
        title: "Véhicule requis",
        description: "Sélectionnez le véhicule concerné.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateSupportTicketPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      ticket_type: form.ticket_type,
      priority: form.priority,
      reservation: scope === "RESERVATION" ? form.reservation : null,
      vehicule: scope === "VEHICLE" ? form.vehicule : null,
    };

    setIsLoading(true);

    createTicketMutation.mutate(payload, {
      onSuccess: () => {
        refetchTickets();
        setIsLoading(false);
        toast({
          title: "Ticket envoyé",
          description: "Votre demande a bien été transmise au support.",
          className: "bg-emerald-600 text-white border-none",
        });
        navigate("/prestataire/supports/my-tickets");
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Envoi impossible",
          description: "Le ticket n'a pas pu être créé. Réessayez.",
          variant: "destructive",
        });
      },
    });
  };

  const selectedTypeInfo = form.ticket_type ? typeLabels[form.ticket_type] : null;
  const selectedPriorityInfo = priorityConfig[form.priority];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-1 h-10 w-10 rounded-full border-slate-200 bg-white shadow-sm hover:bg-white hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <LifeBuoy className="h-3.5 w-3.5" />
              Support prestataire
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Créer un ticket
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Décrivez clairement votre problème pour que l’équipe support puisse vous aider rapidement.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

            <div className="space-y-10 p-6 md:p-8">
              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    1
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">Contexte de la demande</h2>
                    <p className="text-sm text-slate-500">
                      Choisissez d’abord ce que votre ticket concerne.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {scopeCards.map((item) => {
                    const Icon = item.icon;
                    const active = scope === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleScopeChange(item.value)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all",
                          active
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                        )}
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-slate-500")} />
                        </div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Sujet
                    </Label>
                    <Input
                      placeholder="Ex: Problème de disponibilité véhicule"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    />
                  </div>

                  {scope === "RESERVATION" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Réservation concernée
                      </Label>
                      <Select
                        value={form.reservation || ""}
                        onValueChange={(v) => setForm((prev) => ({ ...prev, reservation: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50">
                          <SelectValue placeholder="Choisir une réservation" />
                        </SelectTrigger>
                        <SelectContent>
                          {ownerReservations.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Aucune réservation disponible
                            </SelectItem>
                          ) : (
                            ownerReservations.map((res) => (
                              <SelectItem key={res.id} value={res.id}>
                                {res.vehicle_data?.marque_data?.nom} {res.vehicle_data?.modele_data?.label} —{" "}
                                {new Date(res.start_datetime).toLocaleDateString("fr-FR")}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {scope === "VEHICLE" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Véhicule concerné
                      </Label>
                      <Select
                        value={form.vehicule || ""}
                        onValueChange={(v) => setForm((prev) => ({ ...prev, vehicule: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50">
                          <SelectValue placeholder="Choisir un véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Aucun véhicule disponible
                            </SelectItem>
                          ) : (
                            vehicles.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                {v.marque_data?.nom} {v.modele_data?.label} — {v.numero_immatriculation}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    2
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">Classification</h2>
                    <p className="text-sm text-slate-500">
                      Aidez le support à comprendre l’urgence et la nature du problème.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Type de ticket
                    </Label>
                    <Select
                      value={form.ticket_type}
                      onValueChange={(v) =>
                        setForm((prev) => ({ ...prev, ticket_type: v as TicketType }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((type) => {
                          const info = typeLabels[type];
                          const Icon = info.icon;

                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-slate-500" />
                                <span>{info.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    {selectedTypeInfo && (
                      <p className="text-xs text-slate-500">{selectedTypeInfo.helper}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Niveau d’urgence
                    </Label>
                    <Select
                      value={form.priority}
                      onValueChange={(v) =>
                        setForm((prev) => ({ ...prev, priority: v as TicketPriority }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="Choisir une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => {
                          const config = priorityConfig[priority];
                          return (
                            <SelectItem key={priority} value={priority}>
                              <div className="flex items-center gap-2">
                                <span className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", selectedPriorityInfo.tone)}>
                      <span className={cn("h-2 w-2 rounded-full", selectedPriorityInfo.dot)} />
                      Priorité {selectedPriorityInfo.label} — {selectedPriorityInfo.hint}
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    3
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">Description</h2>
                    <p className="text-sm text-slate-500">
                      Décrivez le problème de manière claire et précise.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Description détaillée
                  </Label>
                  <Textarea
                    placeholder="Expliquez ce qu’il se passe, quand le problème apparaît, et ce que vous avez déjà essayé..."
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="min-h-[180px] rounded-2xl border-slate-200 bg-slate-50 p-4 text-base leading-relaxed"
                  />
                  <p className="text-xs text-slate-500">
                    Conseil : ajoutez le contexte, l’impact et les étapes qui mènent au problème.
                  </p>
                </div>
              </section>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-12 flex-1 rounded-xl border-slate-200"
                >
                  Annuler
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="h-12 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le ticket"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
              <h3 className="text-lg font-semibold text-slate-900">Résumé de votre ticket</h3>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contexte</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {scopeCards.find((item) => item.value === scope)?.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedTypeInfo?.label || "Non sélectionné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Priorité</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedPriorityInfo.label}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sujet</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {form.title.trim() || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Bonnes pratiques</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>Utilisez un sujet précis.</li>
                    <li>Décrivez le problème avec des étapes claires.</li>
                    <li>Choisissez le bon contexte : réservation ou véhicule.</li>
                    <li>Indiquez l’urgence réelle du problème.</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}