import { useState } from "react";
import { useSupportQuery } from "@/useQuery/supportUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";

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

// Options pour le champ "Concerne" (Client = General or Reservation only)
type TicketScope = "GENERAL" | "RESERVATION";

export default function CreateTicketClient() {
    const { data: currentUser } = useCurrentUserQuery();
    const { toast } = useToast();
    const navigate = useNavigate();

    const { createTicketMutation, refetchTickets } = useSupportQuery();

    // Client only needs their own reservations
    const { data: reservations = [] } = useReservationClientQuery(currentUser?.id);

    const [isLoading, setIsLoading] = useState(false);
    const [scope, setScope] = useState<TicketScope>("GENERAL");

    const [form, setForm] = useState({
        title: "",
        description: "",
        ticket_type: "",
        priority: "MEDIUM",
        status: "OPEN",
        reservation: null as string | null,
        // vehicule hidden for client
    });

    const handleSubmit = () => {
        if (!currentUser) return;

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
            reservation: scope === "RESERVATION" ? form.reservation : null,
            vehicule: null, // Client never links vehicle
        };

        createTicketMutation.mutate(payload, {
            onSuccess: () => {
                refetchTickets();
                toast({
                    title: "Ticket créé avec succès 🎉",
                    description: "Votre demande de support a été enregistrée.",
                    className: "bg-green-600 text-white border-none rounded-xl shadow-xl",
                });

                // Redirect client to their list
                navigate("/client/supports/my-tickets");
            },
            onError: () => {
                toast({
                    title: "Erreur",
                    description: "Impossible de créer le ticket.",
                    variant: "destructive",
                });
                setIsLoading(false);
            },
        });
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Nouveau Ticket (Client)</h2>
                    <p className="text-sm text-slate-500">Besoin d'aide ?</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Sujet</Label>
                    <Input
                        placeholder="Ex: Problème de paiement..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="h-11 bg-slate-50 border-slate-200"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Concerne</Label>
                    <Select 
                        value={scope}
                        onValueChange={(v) => {
                            setScope(v as TicketScope);
                            setForm({ ...form, reservation: null });
                        }}
                    >
                        <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent className="w-full bg-slate-50 border-slate-200">
                            <SelectItem value="GENERAL">Question Générale</SelectItem>
                            <SelectItem value="RESERVATION">Une Réservation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                            <SelectContent className="w-full bg-slate-50 border-slate-200">
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

                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Description</Label>
                    <Textarea
                        placeholder="Décrivez votre problème..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="min-h-[120px] bg-slate-50 border-slate-200 resize-y"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600 uppercase">Type</Label>
                        <Select value={form.ticket_type} onValueChange={(v) => setForm({ ...form, ticket_type: v })}>
                            <SelectTrigger className="h-11 bg-slate-50 border-slate-200"><SelectValue placeholder="Type..." /></SelectTrigger>
                            <SelectContent className="w-full bg-slate-50 border-slate-200">
                                {ticketTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600 uppercase">Priorité</Label>
                        <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                            <SelectTrigger className="h-11 bg-slate-50 border-slate-200"><SelectValue placeholder="Priorité..." /></SelectTrigger>
                            <SelectContent className="w-full bg-slate-50 border-slate-200">
                                {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Button onClick={handleSubmit} className="w-full h-12" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Créer le ticket"}
            </Button>
        </div>
    );
}
