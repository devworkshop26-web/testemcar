import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  User,
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  FileText,
  Maximize2,
  Building2,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { useClientDetail } from "@/useQuery/support/useClientDetail";
import { InstanceAxis } from "@/helper/InstanceAxios";

export default function ClientDetailView() {
  const { id } = useParams();
  const { data: client, isLoading } = useClientDetail(id!);

  // --- Helpers ---
  const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
  const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");

  const buildMediaUrl = (value?: string | null) => {
    if (!value || typeof value !== "string") return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${BASE_URL}${value}`;
  };

  const profilePhoto =
    buildMediaUrl((client as any)?.image_url) ?? buildMediaUrl(client?.image);
  const cinRecto =
    buildMediaUrl((client as any)?.cin_photo_recto_url) ??
    buildMediaUrl(client?.cin_photo_recto);
  const cinVerso =
    buildMediaUrl((client as any)?.cin_photo_verso_url) ??
    buildMediaUrl(client?.cin_photo_verso);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  };

  // --- Composants UI Internes ---

  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="mt-0.5 p-2 bg-white border shadow-sm rounded-md text-slate-500">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className="text-sm font-semibold text-slate-900 mt-0.5">{value}</div>
      </div>
    </div>
  );

  const DocumentPreview = ({ title, url }: { title: string; url: string | null }) => {
    if (!url) return (
      <div className="h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50">
        <FileText className="w-8 h-8 opacity-50" />
        <span className="text-xs font-medium">Non disponible</span>
      </div>
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative h-40 rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
            <img src={url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
                <Button size="sm" variant="secondary" className="h-8 text-xs gap-1 backdrop-blur-md bg-white/90">
                  <Maximize2 className="w-3 h-3" /> Voir
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white text-xs font-medium truncate">{title}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-2xl">
          <img src={url} alt={title} className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-black/50 backdrop-blur-sm" />
        </DialogContent>
      </Dialog>
    );
  };

  // --- Loading View (Skeleton Pro) ---
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
                <Card>
                  <CardContent className="pt-0">
                    <Skeleton className="h-24 w-full rounded-t-xl" />
                    <div className="flex flex-col items-center -mt-16">
                      <Skeleton className="w-32 h-32 rounded-full mb-4 border-4 border-white" />
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-24 mb-6" />
                      <div className="w-full space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-8 space-y-6">
                <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent className="grid grid-cols-2 gap-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent className="grid grid-cols-2 gap-6"><Skeleton className="h-40 w-full rounded-xl" /><Skeleton className="h-40 w-full rounded-xl" /></CardContent></Card>
            </div>
        </div>
      </div>
    );
  }

  if (!client) return <div className="p-8 text-center text-muted-foreground">Client introuvable.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 max-w-7xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/support/clients" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-1">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la liste
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vue d'ensemble Client</h1>
        </div>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLONNE GAUCHE : IDENTITÉ (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
               <div className="absolute top-2 right-2">
                  <Badge variant={client.is_active ? "default" : "destructive"} className="shadow-none">
                    {client.is_active ? "Actif" : "Inactif"}
                  </Badge>
               </div>
            </div>
            <CardContent className="pt-0 relative">
              {/* Modification ici : -mt-16 pour compenser la plus grande taille */}
              <div className="flex flex-col items-center -mt-16 text-center">
                <div className="relative">
                    {profilePhoto ? (
                    // Modification ici : w-32 h-32 (plus grand)
                    <img src={profilePhoto} alt="Profil" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                    ) : (
                    // Modification ici : w-32 h-32 et icône plus grande
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="w-12 h-12" />
                    </div>
                    )}
                    {client.is_superuser && (
                        <div className="absolute bottom-0 right-0 bg-amber-400 text-white p-1 rounded-full border-2 border-white" title="Super Admin">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    )}
                </div>
                
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  {client.first_name} {client.last_name}
                </h2>
                <div className="flex items-center gap-2 mt-1 mb-4">
                    <Badge variant="secondary" className="font-normal px-2 py-0.5 text-xs">
                        {client.role || "Utilisateur"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" /> ID: {client.id}
                    </span>
                </div>

                <div className="w-full space-y-2 mt-4">
                   {client.email && (
                    <Button variant="outline" className="w-full justify-start h-10 gap-3 border-slate-200 hover:bg-slate-50 hover:text-blue-600" asChild>
                        <a href={`mailto:${client.email}`}>
                            <Mail className="w-4 h-4 text-slate-400" /> 
                            <span className="truncate">{client.email}</span>
                            {(client as any).email_verified && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                        </a>
                    </Button>
                   )}
                   {client.phone && (
                    <Button variant="outline" className="w-full justify-start h-10 gap-3 border-slate-200 hover:bg-slate-50 hover:text-blue-600" asChild>
                        <a href={`tel:${client.phone}`}>
                            <Phone className="w-4 h-4 text-slate-400" /> 
                            <span>{client.phone}</span>
                            {(client as any).phone_verified && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                        </a>
                    </Button>
                   )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* La carte "Statut rapide" a été supprimée ici */}

        </div>

        {/* COLONNE DROITE : DÉTAILS (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Informations Personnelles */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>Détails civils et localisation du client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow 
                    icon={Calendar} 
                    label="Date de naissance" 
                    value={client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Non renseigné"} 
                />
                <InfoRow icon={MapPin} label="Adresse" value={client.address || "Non renseignée"} />
                <InfoRow icon={ShieldCheck} label="Numéro CIN" value={client.cin_number || "Non renseigné"} />
                <InfoRow 
                    icon={Clock} 
                    label="Membre depuis" 
                    value={
                        <div className="flex flex-col">
                            <span>{formatDate(client.date_joined)}</span>
                            <span className="text-xs text-muted-foreground font-normal">Mis à jour: {formatDate((client as any).updated_at)}</span>
                        </div>
                    } 
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documents d'identité
                    </CardTitle>
                    <CardDescription>Copies numériques de la Carte Nationale d'Identité.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Recto</p>
                    <DocumentPreview title={`CIN Recto - ${client.last_name}`} url={cinRecto} />
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Verso</p>
                    <DocumentPreview title={`CIN Verso - ${client.last_name}`} url={cinVerso} />
                  </div>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}