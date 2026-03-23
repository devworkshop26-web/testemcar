import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
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
  Clock,
  Car,
  CircleDollarSign,
  ArrowUpRight,
  IdCard,
  ReceiptText,
  Home,
  Building2,
} from "lucide-react";
import { useClientDetail } from "@/useQuery/support/useClientDetail";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";

type ClientSummary = {
  id?: string;
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  cin_number?: string;
  date_of_birth?: string;
  image?: string;
  image_url?: string;
  cin_photo_recto?: string;
  cin_photo_recto_url?: string;
  cin_photo_verso?: string;
  cin_photo_verso_url?: string;
  permis_conduire?: string;
  permis_conduire_recto?: string;
  permis_conduire_verso?: string;
  residence_certificate?: string;
  role?: string;
  total_rentals?: number;
  nif?: string;
  stat?: string;
  company_name?: string;
  rcs?: string;
  cif?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  is_active?: boolean;
  is_superuser?: boolean;
  date_joined?: string;
  updated_at?: string;
};

export default function ClientDetailView() {
  const { id } = useParams();
  const location = useLocation();
  const summary = (location.state as { clientSummary?: ClientSummary } | undefined)?.clientSummary;
  const profileId = summary?.user_id || id || "";

  const { data: fetchedClient, isLoading } = useClientDetail(profileId);
  const client = (fetchedClient ?? summary) as (ClientSummary & Record<string, any>) | undefined;
  const reservationClientId = String(client?.user_id || client?.id || profileId || "");
  const {
    data: reservationHistory = [],
    isLoading: isReservationHistoryLoading,
  } = useReservationClientQuery(reservationClientId || undefined);

  const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
  const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");

  const buildMediaUrl = (value?: string | null) => {
    if (!value || typeof value !== "string") return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${BASE_URL}${value}`;
  };

  const profilePhoto =
    buildMediaUrl(client?.image_url) ?? buildMediaUrl(client?.image);
  const cinRecto =
    buildMediaUrl(client?.cin_photo_recto_url) ??
    buildMediaUrl(client?.cin_photo_recto);
  const cinVerso =
    buildMediaUrl(client?.cin_photo_verso_url) ??
    buildMediaUrl(client?.cin_photo_verso);
  const licenseRecto =
    buildMediaUrl(client?.permis_conduire_recto) ??
    buildMediaUrl(client?.permis_conduire);
  const licenseVerso = buildMediaUrl(client?.permis_conduire_verso);
  const residenceCertificate = buildMediaUrl(client?.residence_certificate);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? "—"
      : new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(d);
  };

  const formatDateOnly = (value?: string | null) => {
    if (!value) return "Non renseigné";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? value
      : d.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  const reservationStatusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: "En attente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    CONFIRMED: { label: "Confirmée", className: "bg-blue-100 text-blue-800 border-blue-200" },
    IN_PROGRESS: { label: "En cours", className: "bg-purple-100 text-purple-800 border-purple-200" },
    COMPLETED: { label: "Terminée", className: "bg-green-100 text-green-800 border-green-200" },
    CANCELLED: { label: "Annulée", className: "bg-red-100 text-red-800 border-red-200" },
  };

  const paymentStatusLabel = (status?: string | null) => {
    if (!status) return "Non payé";
    if (status === "VALIDATED") return "Payé";
    if (status === "REJECTED") return "Refusé";
    return "En attente";
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | React.ReactNode }) => (
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
    if (!url)
      return (
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

  if (isLoading && !summary) {
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/support/clients" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-1">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la liste
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vue d'ensemble Client</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <div className="flex flex-col items-center -mt-16 text-center">
                <div className="relative">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profil" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                  ) : (
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
                <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap justify-center">
                  <Badge variant="secondary" className="font-normal px-2 py-0.5 text-xs">
                    {client.role || "Utilisateur"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> ID: {client.user_id || client.id}
                  </span>
                </div>

                <div className="w-full space-y-2 mt-4">
                  {client.email && (
                    <Button variant="outline" className="w-full justify-start h-10 gap-3 border-slate-200 hover:bg-slate-50 hover:text-blue-600" asChild>
                      <a href={`mailto:${client.email}`}>
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{client.email}</span>
                        {client.email_verified && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                      </a>
                    </Button>
                  )}
                  {client.phone && (
                    <Button variant="outline" className="w-full justify-start h-10 gap-3 border-slate-200 hover:bg-slate-50 hover:text-blue-600" asChild>
                      <a href={`tel:${client.phone}`}>
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{client.phone}</span>
                        {client.phone_verified && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>Détails civils, contacts et informations du compte client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Prénom" value={client.first_name || "Non renseigné"} />
                <InfoRow icon={User} label="Nom" value={client.last_name || "Non renseigné"} />
                <InfoRow icon={Mail} label="Email" value={client.email || "Non renseigné"} />
                <InfoRow icon={Phone} label="Téléphone" value={client.phone || "Non renseigné"} />
                <InfoRow icon={Calendar} label="Date de naissance" value={formatDateOnly(client.date_of_birth)} />
                <InfoRow icon={MapPin} label="Adresse complète" value={client.address || "Non renseignée"} />
                <InfoRow icon={ShieldCheck} label="Numéro CIN" value={client.cin_number || "Non renseigné"} />
                <InfoRow icon={Car} label="Locations" value={String(client.total_rentals ?? reservationHistory.length ?? 0)} />
                <InfoRow
                  icon={Clock}
                  label="Membre depuis"
                  value={
                    <div className="flex flex-col">
                      <span>{formatDate(client.date_joined)}</span>
                      <span className="text-xs text-muted-foreground font-normal">Mis à jour: {formatDate(client.updated_at)}</span>
                    </div>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Historique des réservations
              </CardTitle>
              <CardDescription>Toutes les réservations effectuées par ce client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {isReservationHistoryLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton key={idx} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : reservationHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-medium text-slate-600">Aucune réservation trouvée pour ce client.</p>
                </div>
              ) : (
                reservationHistory
                  .slice()
                  .sort((a, b) => {
                    const firstDate = new Date(b.created_at || b.start_datetime || 0).getTime();
                    const secondDate = new Date(a.created_at || a.start_datetime || 0).getTime();
                    return firstDate - secondDate;
                  })
                  .map((reservation: any) => {
                    const status = reservationStatusConfig[reservation.status] || {
                      label: reservation.status || "Inconnu",
                      className: "bg-slate-100 text-slate-700 border-slate-200",
                    };

                    return (
                      <Link
                        key={reservation.id}
                        to={`/support/reservations/${reservation.id}`}
                        className="group block rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              {reservation.reference || `Réservation ${reservation.id}`}
                              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </p>
                            <p className="text-xs text-slate-500">Créée le {formatDate(reservation.created_at || reservation.start_datetime)}</p>
                            <p className="text-xs text-slate-500">Du {formatDate(reservation.start_datetime)} au {formatDate(reservation.end_datetime)}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1">
                              <CircleDollarSign className="w-3 h-3" />
                              {paymentStatusLabel(reservation.payment?.status)}
                            </Badge>
                            <Badge variant="secondary" className="font-medium">
                              {(Number(reservation.total_amount) || 0).toLocaleString("fr-MG")} Ar
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    );
                  })
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-blue-600" />
                Informations fiscales
              </CardTitle>
              <CardDescription>Informations fiscales et administratives disponibles sur le profil client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={ReceiptText} label="NIF" value={client.nif || "Non renseigné"} />
                <InfoRow icon={Building2} label="STAT" value={client.stat || "Non renseigné"} />
                <InfoRow icon={Building2} label="Entreprise" value={client.company_name || "Non renseignée"} />
                <InfoRow icon={ReceiptText} label="RCS" value={client.rcs || "Non renseigné"} />
                <InfoRow icon={ReceiptText} label="CIF" value={client.cif || "Non renseigné"} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Certificat de résidence
              </CardTitle>
              <CardDescription>Certificat de résidence de moins de 3 mois transmis par le client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Certificat de résidence (moins de 3 mois)</p>
                  <DocumentPreview title={`Certificat de résidence - ${client.last_name || client.first_name || "client"}`} url={residenceCertificate} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <IdCard className="w-5 h-5 text-blue-600" />
                Permis de conduire
              </CardTitle>
              <CardDescription>Recto et verso du permis de conduire transmis par le client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Recto</p>
                  <DocumentPreview title={`Permis Recto - ${client.last_name || client.first_name || "client"}`} url={licenseRecto} />
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Verso</p>
                  <DocumentPreview title={`Permis Verso - ${client.last_name || client.first_name || "client"}`} url={licenseVerso} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Documents d'identité
              </CardTitle>
              <CardDescription>Copies numériques de la Carte Nationale d'Identité.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Recto</p>
                  <DocumentPreview title={`CIN Recto - ${client.last_name || client.first_name || "client"}`} url={cinRecto} />
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 ml-1">Verso</p>
                  <DocumentPreview title={`CIN Verso - ${client.last_name || client.first_name || "client"}`} url={cinVerso} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
