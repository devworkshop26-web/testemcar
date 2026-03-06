import React, { useState } from "react";
import { 
    User, UserPlus, UserMinus, ShieldCheck, Mail, Phone, 
    Calendar, Briefcase, Loader2, AlertCircle, CheckCircle2,
    IdCard, Star, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Vehicule } from "@/types/vehiculeType";
import { useDriversQuery } from "@/useQuery/driverUseQuery";
import { useAssignDriverMutation, useRemoveDriverMutation } from "@/useQuery/vehiculeUseQuery";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface DriverTabProps {
    vehicle: Vehicule;
}

export const DriverTab: React.FC<DriverTabProps> = ({ vehicle }) => {
    const { data: allDrivers = [], isLoading: isLoadingDrivers } = useDriversQuery();
    const assignDriver = useAssignDriverMutation();
    const removeDriver = useRemoveDriverMutation();

    const [selectedDriverId, setSelectedDriverId] = useState<string>("");

    const currentDriver = vehicle.driver_data;
    const hasDriver = !!currentDriver;

    // --- 🔒 LOGIQUE EMAIL SÉCURISÉE ---
    const driverEmail = currentDriver?.user && typeof currentDriver.user !== "string"
        ? currentDriver.user.email ?? "Email non disponible"
        : "Email non disponible";

    const handleAssign = () => {
        if (!selectedDriverId) {
            toast.error("Veuillez sélectionner un chauffeur");
            return;
        }

        assignDriver.mutate(
            { vehiculeId: vehicle.id, driverId: selectedDriverId },
            {
                onSuccess: () => {
                    toast.success("Chauffeur assigné avec succès");
                    setSelectedDriverId("");
                },
                onError: () => {
                    toast.error("Erreur lors de l'assignation du chauffeur");
                },
            }
        );
    };

    const handleRemove = () => {
        removeDriver.mutate(vehicle.id, {
            onSuccess: () => {
                toast.success("Chauffeur retiré du véhicule");
            },
            onError: () => {
                toast.error("Erreur lors du retrait du chauffeur");
            },
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Section Gauche : Carte du Chauffeur Actuel (Design Modernisé) --- */}
                <Card className="lg:col-span-2 border-none shadow-lg bg-card overflow-hidden group">
                    {currentDriver ? (
                        <>
                            {/* --- Header Décoratif (Cover) --- */}
                            <div className="h-32 bg-gradient-to-r from-primary/90 via-primary to-primary/80 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                {/* Bouton de suppression flottant en haut à droite */}
                                <div className="absolute top-4 right-4 z-10">
                                     <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleRemove}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md transition-all shadow-sm"
                                        disabled={removeDriver.isPending}
                                    >
                                        {removeDriver.isPending ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <UserMinus className="w-4 h-4 mr-2" />
                                        )}
                                        Dissocier
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="px-6 relative">
                                {/* --- Avatar & Identification --- */}
                                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-4">
                                    <div className="relative">
                                        <Avatar className="w-28 h-28 border-4 border-card shadow-2xl">
                                            <AvatarImage src={currentDriver.profile_photo || ""} alt={currentDriver.full_name} className="object-cover" />
                                            <AvatarFallback className="bg-muted text-3xl font-bold text-muted-foreground">
                                                {currentDriver.first_name?.[0]}{currentDriver.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-card rounded-full shadow-sm" title="Actif"></div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-1 pb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold text-foreground">{currentDriver.full_name}</h3>
                                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-normal hidden sm:inline-flex">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Vérifié
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground flex items-center text-sm">
                                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary" />
                                            Chauffeur Professionnel
                                        </p>
                                    </div>
                                </div>

                                {/* --- Statistiques Rapides (KPIs) --- */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    <StatCard 
                                        icon={Briefcase} 
                                        label="Expérience" 
                                        value={`${currentDriver.experience_years} Ans`} 
                                    />
                                    <StatCard 
                                        icon={IdCard} 
                                        label="Permis" 
                                        value={currentDriver.license_category || "Standard"} 
                                    />
                                    <StatCard 
                                        icon={Calendar} 
                                        label="Naissance" 
                                        value={currentDriver.date_of_birth?.split('-')[0] || "N/A"} 
                                    />
                                    <StatCard 
                                        icon={Star} 
                                        label="Note" 
                                        value="4.9/5" 
                                        highlight
                                    />
                                </div>

                                <Separator className="mb-8 opacity-50" />

                                {/* --- Informations de Contact (Grid Moderne) --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ContactCard 
                                        icon={Phone} 
                                        label="Téléphone mobile" 
                                        value={currentDriver.phone_number} 
                                        actionLabel="Appeler"
                                    />
                                    <ContactCard 
                                        icon={Mail} 
                                        label="Adresse Email" 
                                        value={driverEmail} 
                                        actionLabel="Écrire"
                                    />
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        /* --- État Vide (No Driver) --- */
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-muted/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 shadow-inner ring-8 ring-background">
                                <User className="w-10 h-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun chauffeur assigné</h3>
                            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                                Ce véhicule est actuellement au garage ou en attente d'affectation. Utilisez le panneau latéral pour sélectionner un chauffeur.
                            </p>
                            <Button variant="outline" className="pointer-events-none opacity-50">
                                En attente d'action...
                            </Button>
                        </div>
                    )}
                </Card>

                {/* --- Section Droite : Carte d'Action (Assignation) --- */}
                {/* Je n'ai touché qu'au minimum ici pour l'alignement visuel, mais la logique reste identique */}
                <Card className="border-none shadow-md bg-card h-fit sticky top-4 overflow-hidden">
                    <CardHeader className="bg-muted/10 pb-6 border-b border-border/50">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <UserPlus className="w-5 h-5 text-primary" />
                            </div>
                            Assignation
                        </CardTitle>
                        <CardDescription>Gérer l'affectation du véhicule</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        
                        {hasDriver && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-amber-900">Véhicule occupé</p>
                                        <p className="text-xs text-amber-700/80 leading-relaxed">
                                            Dissociez le chauffeur actuel via le bouton sur sa carte de profil avant d'en changer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                Sélectionner un chauffeur
                            </label>
                            
                            <Select 
                                onValueChange={setSelectedDriverId} 
                                value={selectedDriverId}
                                disabled={hasDriver || isLoadingDrivers}
                            >
                                <SelectTrigger className="h-12 rounded-lg bg-background border-input/60 focus:ring-primary/20">
                                    <SelectValue placeholder="Choisir dans la liste..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white"   >
                                    {isLoadingDrivers ? (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement...
                                        </div>
                                    ) : allDrivers.length > 0 ? (
                                        allDrivers.map((d: any) => (
                                            <SelectItem key={d.id} value={d.id} className="cursor-pointer py-3">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs font-bold text-primary">
                                                        {d.first_name[0]}
                                                    </div>
                                                    <span>{d.first_name} {d.last_name}</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>Aucun chauffeur disponible</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full h-12 rounded-lg font-medium shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all"
                            onClick={handleAssign}
                            disabled={!selectedDriverId || assignDriver.isPending || hasDriver}
                        >
                            {assignDriver.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Traitement...
                                </>
                            ) : (
                                "Confirmer l'assignation"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- Nouveaux composants UI dédiés pour le design moderne ---

const StatCard = ({ icon: Icon, label, value, highlight = false }: { icon: any, label: string, value: string, highlight?: boolean }) => (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 duration-200 cursor-default
        ${highlight 
            ? 'bg-primary/5 border-primary/20' 
            : 'bg-card border-border/40 hover:bg-muted/30'
        }`}>
        <Icon className={`w-5 h-5 mb-2 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className="text-sm font-bold text-foreground">{value}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</span>
    </div>
);

const ContactCard = ({ icon: Icon, label, value, actionLabel }: { icon: any, label: string, value: string, actionLabel: string }) => (
    <div className="flex items-center p-3.5 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/20 hover:bg-muted/40 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-muted shadow-sm flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-foreground truncate select-all">{value}</p>
        </div>
        <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] h-6 cursor-pointer">
            {actionLabel}
        </Badge>
    </div>
);