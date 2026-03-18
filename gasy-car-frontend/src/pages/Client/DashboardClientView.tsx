import { ArrowRight, Car, CheckCircle2, Crown, Gift, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useReservationPricingConfigQuery } from "@/useQuery/reservationsUseQuery";
import { Reservation } from "@/types/reservationsType";

const DashboardOverClientView = () => {
  const { user } = useCurentuser();
  const { data: reservations = [] } = useReservationClientQuery(user?.id);
  const { data: pricingConfig } = useReservationPricingConfigQuery();
  const navigate = useNavigate();

  const getNumberValue = (value?: string | number | null) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
    const normalized = value.replace(/,/g, ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const getReservationDisplayTotal = (reservation: Reservation) => {
    const baseAmount = getNumberValue(reservation.base_amount);
    const rawOptionsAmount = getNumberValue(reservation.options_amount);
    const rawTotalAmount = getNumberValue(reservation.total_amount);
    const totalDays = Math.max(1, getNumberValue(reservation.total_days) || 1);

    const equipmentsAmount = (reservation.equipments_data ?? []).reduce(
      (sum, equipment) => sum + getNumberValue(equipment?.price) * totalDays,
      0
    );
    const servicesAmount = (reservation.services_data ?? []).reduce(
      (sum, service) =>
        sum + getNumberValue(service?.price) * Math.max(1, getNumberValue(service?.quantity) || 1),
      0
    );

    const optionsAmount = Math.max(rawOptionsAmount, equipmentsAmount + servicesAmount);
    const configuredServiceFee = Math.max(0, getNumberValue(pricingConfig?.service_fee) || 0);

    return Math.max(
      rawTotalAmount,
      baseAmount + optionsAmount + configuredServiceFee,
      baseAmount + optionsAmount
    );
  };

  const activeReservations = reservations.filter((r) =>
    ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(r.status)
  );

  const recentReservations = reservations
    .filter((r) => ["COMPLETED", "CANCELLED"].includes(r.status))
    .slice(0, 2);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 🟦 WELCOME HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-primary to-sky-600 text-white shadow-[0_20px_60px_-35px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-300/20 blur-2xl" />

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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                  Voir ma fidélité
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
      </div>

      <Card className="overflow-hidden rounded-3xl border-0 bg-slate-950 text-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.85)]">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.28),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.18),_transparent_32%)]" />
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                  Fidélité Mcar
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <Crown className="h-3.5 w-3.5" />
                  Gold
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-poppins text-white sm:text-3xl">
                  Vous avez cumulé 1 250 points fidélité.
                </h3>
                <p className="max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                  Plus que 50 points pour atteindre le niveau Platinum et profiter de nouveaux avantages sur vos prochaines locations.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-white/80">Progression vers Platinum</span>
                  <span className="font-semibold text-amber-300">96%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Avantage actuel</p>
                <p className="mt-3 flex items-center gap-2 text-xl font-bold text-white">
                  <Gift className="h-5 w-5 text-sky-300" />
                  -10% sur certaines locations
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Une carte frontend prête à être reliée au backend plus tard.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="h-14 rounded-2xl bg-white text-slate-950 hover:bg-white/90"
                  onClick={() => navigate("/client/loyalty")}
                >
                  Mes points
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate("/client/loyalty")}
                >
                  Parrainer un ami
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🟦 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          {/* ACTIVE RENTAL */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-bold font-poppins text-slate-900">
                Location en cours
              </h3>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-slate-600 hover:bg-slate-100"
                onClick={() => navigate("/client/rentals")}
              >
                Tout voir
              </Button>
            </div>

            {activeReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeReservations.map((res) => {
                  const vehicle = res.vehicle_data;
                  const photo =
                    vehicle?.photo_principale || (vehicle?.photos?.[0] as any)?.image_url;

                  const statusLabel = res.status === "PENDING" ? "En attente" : "En cours";

                  return (
                    <Card
                      key={res.id}
                      className="
                        group h-full overflow-hidden rounded-2xl
                        border border-slate-200/60 bg-white
                        shadow-[0_18px_55px_-40px_rgba(2,6,23,0.45)]
                        hover:shadow-[0_22px_70px_-45px_rgba(2,6,23,0.55)]
                        transition-all
                      "
                    >
                      {/* PHOTO TOP */}
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                        {photo ? (
                          <img
                            src={photo}
                            alt="vehicle"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <Skeleton className="h-full w-full rounded-none bg-gray-200" />
                        )}

                        {/* Gradient overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />

                        {/* Status pill */}
                        <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {statusLabel}
                        </span>

                        {/* Total amount chip */}
                        <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-3 py-2 shadow-sm">
                          <p className="text-[10px] font-medium text-slate-500 leading-none">
                            Montant total
                          </p>
                          <p className="mt-1 text-sm font-extrabold text-primary leading-none">
                            {Math.round(getReservationDisplayTotal(res)).toLocaleString()} Ar
                          </p>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <CardContent className="p-5 sm:p-6">
                        <div className="h-full flex flex-col">
                          <div className="min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                              {vehicle?.marque_data?.nom ??
                                (vehicle as any)?.marque_nom ??
                                "Marque inconnue"}{" "}
                              {vehicle?.modele_data?.label ??
                                (vehicle as any)?.modele_label ??
                                vehicle?.titre ??
                                "Modèle non spécifié"}
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                              {vehicle?.transmission_data?.nom ??
                                (vehicle as any)?.transmission_nom ??
                                "Transmission"}{" "}
                              •{" "}
                              {vehicle?.type_carburant_data?.nom ??
                                (vehicle as any)?.carburant_nom ??
                                "Carburant"}
                            </p>
                          </div>

                          <div className="my-4 h-px w-full bg-slate-100" />

                          <div className="mt-auto flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl text-xs border-slate-200"
                              onClick={() => navigate(`/client/rentals/${res.id}`)}
                            >
                              Détails
                            </Button>

                            <Button
                              className="flex-1 rounded-xl text-xs bg-primary text-white hover:opacity-95"
                              onClick={() => navigate("/client/supports/my-tickets")}
                            >
                              Contacter support
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="rounded-2xl border border-dashed border-slate-300/70 bg-white p-10 text-center shadow-sm">
                <p className="text-slate-500">Aucune location en cours.</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => navigate("/allCars")}
                >
                  Explorer les véhicules
                </Button>
              </Card>
            )}
          </div>

          {/* RECENT */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-bold font-poppins text-slate-900">
                Historique récent
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recentReservations.length > 0 ? (
                recentReservations.map((res) => {
                  const vehicle = res.vehicle_data;
                  const photo =
                    vehicle?.photo_principale || (vehicle?.photos?.[0] as any)?.image_url;

                  return (
                    <Card
                      key={res.id}
                      className="
                        rounded-2xl border border-slate-200/60 bg-white
                        shadow-[0_14px_40px_-30px_rgba(2,6,23,0.35)]
                        hover:shadow-[0_18px_50px_-30px_rgba(2,6,23,0.45)]
                        transition-shadow
                      "
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                          {photo ? (
                            <img src={photo} alt="vehicle" className="w-full h-full object-cover" />
                          ) : (
                            <Skeleton className="w-full h-full bg-gray-200" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {vehicle?.marque_data?.nom ??
                              (vehicle as any)?.marque_nom ??
                              "Marque"}{" "}
                            {vehicle?.modele_data?.label ??
                              (vehicle as any)?.modele_label ??
                              vehicle?.titre}
                          </h4>

                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(res.start_datetime).toLocaleDateString()}
                          </p>

                          <div className="flex items-center gap-1 text-emerald-600 mt-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-xs font-semibold">Terminé</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-slate-600 hover:bg-slate-100"
                          onClick={() => navigate(`/client/rentals/${res.id}`)}
                        >
                          Voir
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-slate-400 text-sm">Aucun historique récent.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-900">Astuce</p>
              <p className="mt-1 text-sm text-slate-500">
                Comparez plusieurs véhicules pour trouver la meilleure option selon votre budget et vos
                besoins.
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full rounded-xl"
                onClick={() => navigate("/allCars")}
              >
                Rechercher une voiture
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-900">Support</p>
              <p className="mt-1 text-sm text-slate-500">
                Besoin d’aide ? Contactez notre équipe rapidement.
              </p>
              <Button
                className="mt-4 w-full rounded-xl bg-primary text-white hover:opacity-95"
                onClick={() => navigate("/client/supports/my-tickets")}
              >
                Ouvrir un ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverClientView;