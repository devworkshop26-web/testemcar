import { useState } from "react";
import { useSupportQuery } from "@/useQuery/supportUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

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

const ticketTypes = ["TECHNICAL", "CONFLICT", "PAYMENT", "OTHER"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function CreateTicketSupport() {
    const { data: currentUser } = useCurrentUserQuery();
    const { toast } = useToast();
    const navigate = useNavigate();

    const { createTicketMutation, refetchTickets } = useSupportQuery();

    // Support staff might not need to link to their own reservations/vehicles usually, 
    // but if they do, we can add it. For now, kept simple as internal ticketing.
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        ticket_type: "",
        priority: "MEDIUM",
        status: "OPEN",
    });

    const handleSubmit = () => {
        if (!currentUser) return;

        if (!form.title || !form.description || !form.ticket_type) {
            toast({ title: "Champs manquants", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        const payload = {
            ...form,
            user: currentUser.id,
            assigned_admin: currentUser.id, // Assign to self optionally? Or null.
        };

        createTicketMutation.mutate(payload, {
            onSuccess: () => {
                refetchTickets();
                toast({ title: "Ticket interne créé", className: "bg-green-600 text-white" });
                navigate("/support/tickets");
            },
            onError: () => {
                toast({ title: "Erreur", variant: "destructive" });
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
                    <h2 className="text-2xl font-bold text-slate-900">Nouveau Ticket (Interne)</h2>
                    <p className="text-sm text-slate-500">Création ticket staff support</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Sujet</Label>
                    <Input
                        placeholder="Titre..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="h-11"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">Description</Label>
                    <Textarea
                        placeholder="Détails..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="min-h-[120px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600 uppercase">Type</Label>
                        <Select value={form.ticket_type} onValueChange={(v) => setForm({ ...form, ticket_type: v })}>
                            <SelectTrigger className="h-11"><SelectValue placeholder="Type..." /></SelectTrigger>
                            <SelectContent>
                                {ticketTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600 uppercase">Priorité</Label>
                        <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                            <SelectTrigger className="h-11"><SelectValue placeholder="Priorité..." /></SelectTrigger>
                            <SelectContent>
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
