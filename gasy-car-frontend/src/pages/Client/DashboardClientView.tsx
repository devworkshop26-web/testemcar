import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import { ChevronRight, Clock3, Crown, FilePlus2, Gift, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loyaltyProgress = 96;
const loyaltyPoints = 1250;
const loyaltyPointsToNextTier = 50;

type ExtendedUser = {
  permis_conduire?: string | null;
  cin_photo_recto?: string | null;
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

const DashboardOverClientView = () => {
  const { user } = useCurentuser();
  const { data: reservations = [] } = useReservationClientQuery(user?.id);
  const navigate = useNavigate();

  const profile = (user ?? {}) as ExtendedUser;

  const recentReservations = [...reservations]
    .filter((reservation) => ["COMPLETED", "CANCELLED"].includes(reservation.status))
    .sort((a, b) => {
      const left = new Date(b.updated_at ?? b.end_datetime).getTime();
      const right = new Date(a.updated_at ?? a.end_datetime).getTime();
      return left - right;
    })
    .slice(0, 3);

  const documentItems = [
    {
      id: "permis",
      label: "Permis de conduire",
      status: profile.permis_conduire ? "Validé" : "À compléter",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: "cin",
      label: "CIN / Passeport",
      status: profile.cin_photo_recto ? "Validé" : "À compléter",
      icon: <Gift className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-[#182235] text-white shadow-[0_20px_55px_-35px_rgba(15,23,42,0.82)]">
        <CardContent className="relative p-0">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_45%)]" />
          <div className="absolute -right-10 top-0 h-52 w-52 rounded-full border border-white/6" />
          <div className="absolute -right-4 top-8 h-40 w-40 rounded-full border border-white/5" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold font-poppins leading-tight text-white sm:text-[30px]">
                  Bonjour, {user?.first_name || "Client"} {user?.last_name || ""} !
                </h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                  <Crown className="h-3.5 w-3.5" />
                  Gold
                </span>
              </div>

              <p className="max-w-2xl text-base leading-8 text-white/90 sm:text-[18px]">
                Vous avez cumulé <span className="font-bold text-white">{loyaltyPoints} points</span>. Plus que {loyaltyPointsToNextTier} points pour atteindre
                le niveau Platinum et bénéficier de <span className="font-bold text-white">-10% sur toutes les locations</span>.
              </p>

              <div className="h-4 max-w-2xl overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD21E] via-[#FFD21E] to-[#E6B800]"
                  style={{ width: `${loyaltyProgress}%` }}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:flex-col">
              <Button
                className="h-12 min-w-[136px] rounded-2xl bg-white px-6 text-base font-bold text-slate-950 hover:bg-white/95"
                onClick={() => navigate("/client/loyalty")}
              >
                Mes Points
              </Button>
              <Button
                className="h-12 min-w-[176px] rounded-2xl bg-[#316BFF] px-6 text-base font-bold text-white hover:bg-[#2558db]"
                onClick={() => navigate("/client/loyalty")}
              >
                Parrainer un ami
              </Button>
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
            <h3 className="text-[20px] font-bold tracking-tight text-slate-900 font-poppins sm:text-[22px]">
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
                          <h4 className="truncate text-[18px] font-bold text-slate-900 font-poppins sm:text-[19px]">
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
                          onClick={() => navigate("/allCars")}
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
                <h3 className="text-[20px] font-bold tracking-tight text-slate-900 font-poppins sm:text-[22px]">
                  Mes Documents
                </h3>
              </div>

              <div className="space-y-4">
                {documentItems.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 transition-colors hover:bg-slate-100/80"
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
                  </div>
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
  );
};

export default DashboardOverClientView;
