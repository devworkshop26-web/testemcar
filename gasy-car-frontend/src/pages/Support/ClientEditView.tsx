import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClientDetail } from "@/useQuery/support/useClientDetail";
import { useUpdateClient } from "@/useQuery/support/useUpdateClient";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Mail,
  Phone,
  ShieldCheck,
  User,
  IdCard,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type ClientDetail = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address?: string | null;
  cin_number?: string | null;
  date_of_birth?: string | null;
  role?: "CLIENT" | "PRESTATAIRE" | "ADMIN" | "SUPPORT" | string;

  // flags
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;

  // dates
  date_joined?: string | null;
  last_login?: string | null;
  updated_at?: string | null;

  // media (paths or urls)
  image?: string | null;
  image_url?: string | null;
  cin_photo_recto?: string | null;
  cin_photo_recto_url?: string | null;
  cin_photo_verso?: string | null;
  cin_photo_verso_url?: string | null;
};

function formatDateOnly(value?: string | null) {
  if (!value) return "";
  // si déjà en yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function ClientEditView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: rawClient, isLoading } = useClientDetail(id!);
  const client = rawClient as ClientDetail | undefined;

  const updateClient = useUpdateClient(id!);

  // BASE_URL pour afficher les médias (sans /api)
  const BASE_URL = useMemo(() => {
    const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
    return RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");
  }, []);

  const buildMediaUrl = (value?: string | null) => {
    if (!value || typeof value !== "string") return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${BASE_URL}${value}`;
  };

  const existingProfilePhoto =
    buildMediaUrl(client?.image_url) ?? buildMediaUrl(client?.image);

  const existingCinRecto =
    buildMediaUrl(client?.cin_photo_recto_url) ?? buildMediaUrl(client?.cin_photo_recto);

  const existingCinVerso =
    buildMediaUrl(client?.cin_photo_verso_url) ?? buildMediaUrl(client?.cin_photo_verso);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    cin_number: "",
    date_of_birth: "",

    // options (si tu veux permettre la modif depuis support)
    is_active: true,
  });

  // fichiers upload
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [cinRecto, setCinRecto] = useState<File | null>(null);
  const [cinVerso, setCinVerso] = useState<File | null>(null);

  // preview local
  const profilePhotoPreview = useMemo(
    () => (profilePhoto ? URL.createObjectURL(profilePhoto) : null),
    [profilePhoto]
  );
  const cinRectoPreview = useMemo(
    () => (cinRecto ? URL.createObjectURL(cinRecto) : null),
    [cinRecto]
  );
  const cinVersoPreview = useMemo(
    () => (cinVerso ? URL.createObjectURL(cinVerso) : null),
    [cinVerso]
  );

  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
      if (cinRectoPreview) URL.revokeObjectURL(cinRectoPreview);
      if (cinVersoPreview) URL.revokeObjectURL(cinVersoPreview);
    };
  }, [profilePhotoPreview, cinRectoPreview, cinVersoPreview]);

  // Charger valeurs initiales proprement
  useEffect(() => {
    if (!isLoading && client) {
      setForm({
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        phone: client.phone || "",
        address: client.address || "",
        cin_number: client.cin_number || "",
        date_of_birth: formatDateOnly(client.date_of_birth),
        is_active: client.is_active ?? true,
      });
    }
  }, [isLoading, client?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const BadgeBool = ({ value }: { value?: boolean }) => (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${
        value ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {value ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {value ? "Oui" : "Non"}
    </span>
  );

  const MediaCard = ({
    title,
    url,
    previewUrl,
    onPick,
    accept = "image/*",
  }: {
    title: string;
    url: string | null;
    previewUrl: string | null;
    onPick: (file: File | null) => void;
    accept?: string;
  }) => {
    const finalUrl = previewUrl || url;

    return (
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500 truncate">
              {previewUrl ? "Nouveau fichier sélectionné" : url ? "Document existant" : "Non fourni"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {finalUrl ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full gap-2">
                    <Eye className="w-4 h-4" /> Voir
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 rounded-2xl overflow-hidden border bg-gray-50">
                    <img
                      src={finalUrl}
                      alt={title}
                      className="w-full max-h-[75vh] object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <span className="text-xs text-gray-500">—</span>
            )}
          </div>
        </div>

        <div className="relative">
          {finalUrl ? (
            <>
              <img
                src={finalUrl}
                alt={title}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 right-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" className="rounded-full shadow-md" aria-label={`Voir ${title}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 rounded-2xl overflow-hidden border bg-gray-50">
                        <img
                          src={finalUrl}
                          alt={title}
                          className="w-full max-h-[75vh] object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Aucun document</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <Input
            type="file"
            accept={accept}
            onChange={(e) => onPick(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // champs texte
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("cin_number", form.cin_number);
    formData.append("date_of_birth", form.date_of_birth || "");
    formData.append("is_active", String(form.is_active));

    // fichiers (noms backend: image, cin_photo_recto, cin_photo_verso)
    if (profilePhoto) formData.append("image", profilePhoto);
    if (cinRecto) formData.append("cin_photo_recto", cinRecto);
    if (cinVerso) formData.append("cin_photo_verso", cinVerso);

    updateClient.mutate(formData, {
      onSuccess: () => navigate(`/support/client/${id}`),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(`/support/client/${id}`)}
        className="flex items-center gap-2 text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Modifier le client</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          )}

          {!isLoading && client && (
            <>
              {/* Bandeau infos non éditables */}
              <div className="rounded-2xl border p-4 bg-white">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-gray-500">ID : {client.id}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-700">
                      <ShieldCheck className="w-4 h-4" />
                      {client.role || "—"}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-700">
                      <Mail className="w-4 h-4" />
                      {client.email}
                    </span>
                    <BadgeBool value={client.email_verified} />
                    <BadgeBool value={client.phone_verified} />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Inscription
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(client.date_joined)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Dernière connexion
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(client.last_login)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Mise à jour
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(client.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STATUT */}
                <div className="rounded-2xl border p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">Compte actif</p>
                      <p className="text-xs text-gray-500">
                        Désactivez si vous voulez bloquer temporairement l’accès.
                      </p>
                    </div>
                    <Switch
                      checked={form.is_active}
                      onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                    />
                  </div>
                </div>

                {/* INFOS EDITABLES */}
                <div className="rounded-2xl border p-4 bg-white space-y-4">
                  <p className="text-sm font-semibold text-gray-900">Informations</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" /> Prénom
                      </Label>
                      <Input
                        value={form.first_name}
                        onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                        placeholder="Prénom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" /> Nom
                      </Label>
                      <Input
                        value={form.last_name}
                        onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                        placeholder="Nom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" /> Téléphone
                      </Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="034..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" /> Date de naissance
                      </Label>
                      <Input
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-600" /> Adresse
                      </Label>
                      <Input
                        value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                        placeholder="Adresse"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <IdCard className="w-4 h-4 text-gray-600" /> CIN
                      </Label>
                      <Input
                        value={form.cin_number}
                        onChange={(e) => setForm((p) => ({ ...p, cin_number: e.target.value }))}
                        placeholder="Numéro CIN"
                      />
                    </div>
                  </div>
                </div>

                {/* MEDIAS */}
                <div className="rounded-2xl border p-4 bg-white space-y-4">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" /> Documents & Photos
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MediaCard
                      title="Photo de profil"
                      url={existingProfilePhoto}
                      previewUrl={profilePhotoPreview}
                      onPick={setProfilePhoto}
                    />
                    <MediaCard
                      title="CIN Recto"
                      url={existingCinRecto}
                      previewUrl={cinRectoPreview}
                      onPick={setCinRecto}
                    />
                    <MediaCard
                      title="CIN Verso"
                      url={existingCinVerso}
                      previewUrl={cinVersoPreview}
                      onPick={setCinVerso}
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate(`/support/client/${id}`)}
                    disabled={updateClient.isPending}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    className="rounded-xl md:flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={updateClient.isPending}
                  >
                    {updateClient.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {!isLoading && !client && (
            <div className="text-sm text-gray-600">Aucun client trouvé.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
