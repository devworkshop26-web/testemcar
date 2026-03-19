import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Home, ReceiptText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import {
  ChevronRight,
  Clock3,
  Crown,
  FilePlus2,
  Gift,
  ImageOff,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const loyaltyProgress = 96;
const loyaltyPoints = 1250;
const loyaltyPointsToNextTier = 50;

type ExtendedUser = {
  permis_conduire?: string | null;
  permis_conduire_recto?: string | null;
  permis_conduire_verso?: string | null;
  cin_photo_recto?: string | null;
  cin_photo_verso?: string | null;
  residence_certificate?: string | null;
  nif?: string | null;
  stat?: string | null;
};

type DocumentPreview = {
  label: string;
  src: string | null;
};

type DocumentDetail = {
  label: string;
  value: string;
};

type DocumentItem = {
  id: "permis" | "cin" | "residence" | "fiscal";
  label: string;
  status: string;
  icon: JSX.Element;
  description: string;
  previews?: DocumentPreview[];
  details?: DocumentDetail[];
};

const rawBaseUrl = String(InstanceAxis.defaults.baseURL || "");
const mediaBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const toAbsoluteMediaUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!mediaBaseUrl) return path;
  return path.startsWith("/") ? `${mediaBaseUrl}${path}` : `${mediaBaseUrl}/${path}`;
};

const formatReservationDateRange = (start?: string, end?: string) => {
  if (!start || !end) return "Dates à confirmer";

  const startDate = new Date(start);
  const endDate = new Date(end);

  return `Du ${startDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })} au ${endDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })}`;
};

const DocumentImageCard = ({ label, src }: DocumentPreview) => {
  if (!src) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="mb-3 rounded-full bg-white p-3 text-slate-400 shadow-sm">
          <ImageOff className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-xs text-slate-500">Aucun document disponible.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <div className="bg-slate-50 p-3">
        <img src={src} alt={label} className="h-[240px] w-full rounded-xl object-cover" />
      </div>
    </div>
  );
};

const DashboardOverClientView = () => {
  const { user } = useCurentuser();
  const { data: reservations = [] } = useReservationClientQuery(user?.id);
  const navigate = useNavigate();
  const [selectedDocumentId, setSelectedDocumentId] = useState<DocumentItem["id"] | null>(null);

  const profile = (user ?? {}) as ExtendedUser;

  const recentReservations = [...reservations]
    .filter((reservation) => ["COMPLETED", "CANCELLED"].includes(reservation.status))
    .sort((a, b) => {
      const left = new Date(b.updated_at ?? b.end_datetime).getTime();
      const right = new Date(a.updated_at ?? a.end_datetime).getTime();
      return left - right;
    })
    .slice(0, 3);

  const documentItems = useMemo<DocumentItem[]>(
    () => [
      {
        id: "permis",
        label: "Permis de conduire",
        status:
          profile.permis_conduire_recto ||
          profile.permis_conduire_verso ||
          profile.permis_conduire
            ? "Validé"
            : "À compléter",
        icon: <ShieldCheck className="h-4 w-4" />,
        description:
          "Consultez ici les images recto et verso de votre permis de conduire.",
        previews: [
          {
            label: "Permis - Recto",
            src: toAbsoluteMediaUrl(
              profile.permis_conduire_recto || profile.permis_conduire || null
            ),
          },
          {
            label: "Permis - Verso",
            src: toAbsoluteMediaUrl(profile.permis_conduire_verso || null),
          },
        ],
      },
      {
        id: "cin",
        label: "CIN / Passeport",
        status:
          profile.cin_photo_recto || profile.cin_photo_verso
            ? "Validé"
            : "À compléter",
        icon: <Gift className="h-4 w-4" />,
        description:
          "Consultez ici les images recto et verso de votre CIN ou passeport.",
        previews: [
          {
            label: "CIN / Passeport - Recto",
            src: toAbsoluteMediaUrl(profile.cin_photo_recto || null),
          },
          {
            label: "CIN / Passeport - Verso",
            src: toAbsoluteMediaUrl(profile.cin_photo_verso || null),
          },
        ],
      },
      {
        id: "residence",
        label: "Certificat de résidence",
        status: profile.residence_certificate ? "Validé" : "À compléter",
        icon: <Home className="h-4 w-4" />,
        description:
          "Consultez ici le certificat de résidence de moins de 3 mois enregistré sur votre compte.",
        previews: [
          {
            label: "Certificat de résidence",
            src: toAbsoluteMediaUrl(profile.residence_certificate || null),
          },
        ],
      },
      {
        id: "fiscal",
        label: "Infos fiscales",
        status: profile.nif || profile.stat ? "Renseignées" : "À compléter",
        icon: <ReceiptText className="h-4 w-4" />,
        description:
          "Consultez ici les informations fiscales enregistrées sur votre profil.",
        details: [
          {
            label: "NIF",
            value: profile.nif || "Non renseigné",
          },
          {
            label: "STAT",
            value: profile.stat || "Non renseigné",
          },
        ],
      },
    ],
    [profile]
  );

  const selectedDocument =
    documentItems.find((document) => document.id === selectedDocumentId) ?? null;

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card className="overflow-hidden rounded-[28px] border border-slate-800/20 bg-[#1A2436] text-white shadow-[0_22px_65px_-40px_rgba(15,23,42,0.88)]">
          <CardContent className="relative p-0">
            <div className="absolute inset-y-0 right-0 w-[30%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_62%)]" />
           <div className="absolute right-5 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-white/8" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 p-7 sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Espace Client
              </div>

              <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl font-poppins">
                Prêt pour votre prochaine aventure, {user?.first_name} ?
              </h2>

              <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                Explorez, comparez et réservez votre véhicule en quelques clics.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  className="rounded-xl bg-white text-slate-900 hover:bg-white/90 shadow-sm active:scale-[0.99]"
                  onClick={() => navigate("/allCars")}
                >
                  Réserver une voiture
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate("/client/rentals")}
                >
                  Voir mes réservations
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate("/client/loyalty")}
                >
                  Mes points
                </Button>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
                <Car className="relative h-28 w-28 text-white/35" />
              </div>
            </div>
          </div>
        </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 xl:grid-cols-[1.45fr_0.7fr] xl:items-start">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock3 className="h-4 w-4" />
              </div>
              <h3 className="font-poppins text-[20px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
                Locations Récentes
              </h3>
            </div>

            <div className="space-y-5">
              {recentReservations.length > 0 ? (
                recentReservations.map((reservation) => {
                  const vehicle = reservation.vehicle_data;
                  const image = vehicle?.photo_principale || vehicle?.photos?.[0]?.image;
                  const locationLabel =
                    vehicle?.ville ||
                    vehicle?.adresse_localisation ||
                    reservation.pickup_location ||
                    "Madagascar";

                  const vehicleId = vehicle?.id ? String(vehicle.id) : null;

                  return (
                    <Card
                      key={reservation.id}
                      className="rounded-[22px] border border-slate-200/80 bg-white shadow-[0_12px_35px_-28px_rgba(15,23,42,0.38)]"
                    >
                      <CardContent className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                            {image ? (
                              <img src={image} alt={vehicle?.titre || "Véhicule"} className="h-full w-full object-cover" />
                            ) : (
                              <Skeleton className="h-full w-full rounded-none bg-slate-200" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-1.5">
                            <h4 className="font-poppins text-[18px] font-bold text-slate-900 sm:text-[19px]">
                              {vehicle?.titre || `${vehicle?.marque_data?.nom || "Véhicule"} ${vehicle?.modele_data?.label || ""}`.trim()}
                            </h4>
                            <p className="text-base text-slate-500">{locationLabel}</p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                              <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-600">
                                {reservation.status === "CANCELLED" ? "Annulé" : "Terminé"}
                              </span>
                              <span>{formatReservationDateRange(reservation.start_datetime, reservation.end_datetime)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 lg:items-end">
                          <Button
                            className="rounded-2xl bg-[#EEF4FF] px-6 text-sm font-semibold text-[#316BFF] hover:bg-[#E2ECFF]"
                            onClick={() => navigate(vehicleId ? `/vehicule/${vehicleId}` : "/allCars")}
                          >
                            Louer à nouveau
                          </Button>
                          <button
                            type="button"
                            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
                            onClick={() => navigate(`/client/rentals/${reservation.id}`)}
                          >
                            Voir facture
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="rounded-[22px] border border-dashed border-slate-300 bg-white shadow-sm">
                  <CardContent className="p-10 text-center text-slate-500">
                    Aucune location récente pour le moment.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section>
            <Card className="rounded-[24px] border border-slate-200/80 bg-white shadow-[0_12px_35px_-28px_rgba(15,23,42,0.38)] xl:sticky xl:top-24">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-poppins text-[20px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
                    Mes Documents
                  </h3>
                </div>

                <div className="space-y-4">
                  {documentItems.map((document) => (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => setSelectedDocumentId(document.id)}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left transition-colors hover:bg-slate-100/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                          {document.icon}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">{document.label}</p>
                          <p className="text-sm text-emerald-600">{document.status}</p>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>
                  ))}

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-base font-medium text-slate-500 transition-colors hover:border-primary/30 hover:text-primary"
                    onClick={() => navigate("/client/settings")}
                  >
                    <FilePlus2 className="h-4 w-4" />
                    Ajouter un document
                  </button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocumentId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] border-slate-200 bg-white p-0 sm:max-w-4xl">
          {selectedDocument && (
            <>
              <DialogHeader className="border-b border-slate-100 px-6 py-5 text-left">
                <DialogTitle className="font-poppins text-2xl font-bold text-slate-900">
                  {selectedDocument.label}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-500">
                  {selectedDocument.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 px-6 py-6">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm text-slate-500">Statut du document</p>
                    <p className="text-base font-semibold text-slate-900">{selectedDocument.status}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate("/client/settings")}
                  >
                    Modifier mes documents
                  </Button>
                </div>

                {selectedDocument.previews?.length ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {selectedDocument.previews.map((preview) => (
                      <DocumentImageCard key={preview.label} {...preview} />
                    ))}
                  </div>
                ) : null}

                {selectedDocument.details?.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {selectedDocument.details.map((detail) => (
                      <div
                        key={detail.label}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <p className="text-sm text-slate-500">{detail.label}</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardOverClientView;
