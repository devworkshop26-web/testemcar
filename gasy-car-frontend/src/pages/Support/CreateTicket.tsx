import { useState } from "react";
import { useSupportQuery } from "@/useQuery/supportUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useReservationsQuery } from "@/useQuery/reservationsUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";

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
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Enums backend exacts
const ticketTypes = ["TECHNICAL", "CONFLICT", "PAYMENT", "OTHER"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// Options pour le champ "Concerne"
type TicketScope = "GENERAL" | "RESERVATION" | "VEHICLE";

export default function CreateTicket() {
  const { data: currentUser } = useCurrentUserQuery();
  const { toast } = useToast();

  const { createTicketMutation, refetchTickets } = useSupportQuery();

  // Fetch data conditionally based on role (hooks handle enabled state internally if needed, but we can also just fetch)
  // Note: hooks usually fetch if mounted. We can rely on them returning empty or loading.
  const { data: reservations = [] } = useReservationsQuery();
  const { data: vehicles = [] } = useOwnerVehiculesQuery(currentUser?.id);

  const [isLoading, setIsLoading] = useState(false);

  const [scope, setScope] = useState<TicketScope>("GENERAL");

  const [form, setForm] = useState({
    title: "",
    description: "",
    ticket_type: "",
    priority: "MEDIUM",
    status: "OPEN",
    reservation: null as string | null,
    vehicule: null as string | null,
  });

  // Determine allowed scopes based on role
  const isClient = currentUser?.role === "CLIENT";
  const isPrestataire = currentUser?.role === "PRESTATAIRE";
  const isSupport = currentUser?.role === "SUPPORT"; // Support might create tickets too? Or mostly manage.
  // Assuming Support/Admin behaves like Prestataire for now regarding options if they ever create tickets

  const showReservationOption = isClient || isPrestataire || isSupport;
  const showVehicleOption = isPrestataire || isSupport;

  const handleSubmit = () => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer un ticket.",
        variant: "destructive",
      });
      return;
    }

    if (!form.title || !form.description || !form.ticket_type) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      ...form,
      user: currentUser.id,
      assigned_admin: null,
      // Ensure we only send the ID for the selected scope
      reservation: scope === "RESERVATION" ? form.reservation : null,
      vehicule: scope === "VEHICLE" ? form.vehicule : null,
    };

    createTicketMutation.mutate(payload, {
      onSuccess: () => {
        refetchTickets();

        toast({
          title: "Ticket créé avec succès 🎉",
          description: "Votre demande de support a été enregistrée.",
          className: "bg-green-600 text-white border-none rounded-xl shadow-xl",
        });

        // Reset
        setForm({
          title: "",
          description: "",
          ticket_type: "",
          priority: "MEDIUM",
          status: "OPEN",
          reservation: null,
          vehicule: null,
        });
        setScope("GENERAL");
        setIsLoading(false);
      },

      onError: (error) => {
        console.error("Erreur backend :", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer le ticket. Réessayez plus tard.",
          variant: "destructive",
        });
        setIsLoading(false);
      },
    });
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Nouveau Ticket Support
          </h2>
          <p className="text-sm text-slate-500">
            Une question ou un problème ? Remplissez ce formulaire.
          </p>
        </div>
      </div>

      <div className="space-y-4">

        {/* TITRE */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600 uppercase">Sujet</Label>
          <Input
            placeholder="Ex: Problème de paiement..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="h-11 bg-slate-50 border-slate-200"
          />
        </div>

        {/* CONCERNE (SCOPE) */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600 uppercase">Concerne</Label>
          <Select
            value={scope}
            onValueChange={(v) => {
              setScope(v as TicketScope);
              // Reset linked fields when scope changes
              setForm({ ...form, reservation: null, vehicule: null });
            }}
          >
            <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">Question Générale</SelectItem>
              {showReservationOption && <SelectItem value="RESERVATION">Une Réservation</SelectItem>}
              {showVehicleOption && <SelectItem value="VEHICLE">Un Véhicule</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        {/* CONDITIONAL: RESERVATION SELECTOR */}
        {scope === "RESERVATION" && (
          <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
            <Label className="text-xs font-semibold text-slate-600 uppercase">Réservation concernée</Label>
            <Select
              value={form.reservation || ""}
              onValueChange={(v) => setForm({ ...form, reservation: v })}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Choisir une réservation..." />
              </SelectTrigger>
              <SelectContent>
                {reservations.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">Aucune réservation trouvée</div>
                ) : (
                  reservations.map((res) => (
                    <SelectItem key={res.id} value={res.id}>
                      {res.vehicle_data?.marque_data?.nom} {res.vehicle_data?.modele_data?.label} ({new Date(res.start_datetime).toLocaleDateString()})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* CONDITIONAL: VEHICLE SELECTOR */}
        {scope === "VEHICLE" && (
          <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
            <Label className="text-xs font-semibold text-slate-600 uppercase">Véhicule concerné</Label>
            <Select
              value={form.vehicule || ""}
              onValueChange={(v) => setForm({ ...form, vehicule: v })}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Choisir un véhicule..." />
              </SelectTrigger>
              <SelectContent>
                {vehicles.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">Aucun véhicule trouvé</div>
                ) : (
                  vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.marque_data?.nom} {v.modele_data?.label} - {v.numero_immatriculation}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600 uppercase">Description détaillée</Label>
          <Textarea
            placeholder="Décrivez votre problème en détail..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="min-h-[120px] bg-slate-50 border-slate-200 resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* TYPE DE TICKET */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-600 uppercase">Type</Label>
            <Select
              value={form.ticket_type}
              onValueChange={(v) => setForm({ ...form, ticket_type: v })}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Type..." />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRIORITE */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-600 uppercase">Priorité</Label>
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v })}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Priorité..." />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* BOUTON AVEC LOADER */}
      <Button
        onClick={handleSubmit}
        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Enregistrement...
          </div>
        ) : (
          "Créer le ticket"
        )}
      </Button>
    </div>
  );
}
