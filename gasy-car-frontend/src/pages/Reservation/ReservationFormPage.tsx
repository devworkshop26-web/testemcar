// ==============================================
// PAGE : ReservationFormPage (CONFIRMATION)
// ==============================================

import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useCreateReservationMutation } from "@/useQuery/reservationsUseQuery";

import { Button } from "@/components/ui/button";

import {
  MapPin,
  Users,
  DoorClosed,
  Fuel,
  Gauge,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface LocationState {
  startDate?: string;
  endDate?: string;
  travelZone?: "URBAIN" | "PROVINCE";
  drivingMode?: "SELF_DRIVE" | "WITH_DRIVER";
  selectedAddons?: string[];
}

const ReservationFormPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  const { data: vehicle, isLoading } = useVehiculeQuery(vehicleId);
  const { data: currentUser } = useCurrentUserQuery();
  const createReservation = useCreateReservationMutation();

  // Get passed values
  const startDateTime = location.state?.startDate
    ? new Date(location.state.startDate)
    : null;
  const endDateTime = location.state?.endDate
    ? new Date(location.state.endDate)
    : null;

  // State for new options
  const [pricingZone, setPricingZone] = useState<"URBAIN" | "PROVINCE">(location.state?.travelZone || "URBAIN");
  const [drivingMode, setDrivingMode] = useState<"SELF_DRIVE" | "WITH_DRIVER">(location.state?.drivingMode || "SELF_DRIVE");
  const [selectedAddons] = useState<string[]>(location.state?.selectedAddons || []);

  const duration = useMemo(() => {
    if (!startDateTime || !endDateTime) return 0;
    const diffTime = endDateTime.getTime() - startDateTime.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Ajouter 1 pour inclure le jour de début et le jour de fin
    return Math.max(1, diffDays + 1);
  }, [startDateTime, endDateTime]);

  const dailyPrice = useMemo(() => {
    if (!vehicle) return 0;
    const gridPrice = vehicle.pricing_grid?.find(p => p.zone_type === pricingZone);
    return gridPrice ? Number(gridPrice.prix_jour) : Number(vehicle.prix_jour);
  }, [vehicle, pricingZone]);

  const driverDailyFee = drivingMode === "WITH_DRIVER" ? 40000 : 0; // Estimation: 40k Ar/jour

  const totalPrice = (dailyPrice + driverDailyFee) * duration;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 py-10">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <div className="h-12 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 w-full bg-slate-200 rounded-3xl animate-pulse" />
              <div className="h-48 w-full bg-slate-200 rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-64 w-full bg-slate-200 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Véhicule introuvable</h2>
          <p className="text-slate-600">Le véhicule que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (d?: Date | null) => {
    if (!d) return "Non défini";
    return d.toLocaleString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (d?: Date | null) => {
    if (!d) return "";
    return d.toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmReservation = () => {
    if (!currentUser || !startDateTime || !endDateTime) return;

    createReservation.mutate(
      {
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        total_days: duration,
        base_amount: dailyPrice.toString(),
        options_amount: (driverDailyFee * duration).toString(),
        total_amount: totalPrice.toString(),
        caution_amount: vehicle.montant_caution,
        status: "PENDING",
        with_chauffeur: drivingMode === "WITH_DRIVER",
        driving_mode: drivingMode,
        pricing_zone: pricingZone,
        pickup_location: vehicle.adresse_localisation,
        dropoff_location: vehicle.adresse_localisation,
        client: currentUser.id,
        vehicle: vehicle.id,
        equipments: selectedAddons,
      },
      {
        onSuccess: (data) => {
          navigate(`/reservation-payment/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 py-10 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-8 relative z-10">

        {/* HEADER */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Étape 2 sur 3</span>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            Confirmez votre réservation
          </h1>
          <p className="text-slate-600 text-lg">
            Vérifiez les détails avant de procéder au paiement
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* VEHICLE CARD */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden group">
              <div className="relative">
                <img
                  src={vehicle.photos?.[0]?.image || "/placeholder-car.jpg"}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={`${vehicle.marque_data?.nom} ${vehicle.modele_data?.label}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {vehicle.marque_data?.nom} {vehicle.modele_data?.label}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {vehicle.adresse_localisation}, {vehicle.ville}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Places</p>
                      <p className="font-semibold text-slate-900">{vehicle.nombre_places}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <DoorClosed className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Portes</p>
                      <p className="font-semibold text-slate-900">{vehicle.nombre_portes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Fuel className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Carburant</p>
                      <p className="font-semibold text-slate-900 text-sm">{vehicle.type_carburant_data?.nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Gauge className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Kilométrage</p>
                      <p className="font-semibold text-slate-900 text-sm">{vehicle.kilometrage_actuel_km} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OPTIONS CONFIGURATION */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Période de location</h3>
                  <p className="text-sm text-slate-500">Durée totale : {duration} jour{duration > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white rotate-180" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase">Début</span>
                  </div>
                  <p className="font-bold text-lg text-slate-900">{formatDate(startDateTime)}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(startDateTime)}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-rose-700 uppercase">Fin</span>
                  </div>
                  <p className="font-bold text-lg text-slate-900">{formatDate(endDateTime)}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(endDateTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - 1/3 */}
          <div className="space-y-6">

            {/* PRICE SUMMARY */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Récapitulatif</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Tarif journalier</span>
                  <span className="font-semibold text-slate-900">
                    {dailyPrice.toLocaleString()} {vehicle.devise}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Nombre de jours</span>
                  <span className="font-semibold text-slate-900">× {duration}</span>
                </div>

                {drivingMode === "WITH_DRIVER" && (
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Chauffeur ({duration}j)</span>
                    <span className="font-semibold text-slate-900">
                      {(driverDailyFee * duration).toLocaleString()} {vehicle.devise}
                    </span>
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 text-sm">Total à payer</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-400 rounded-2xl blur opacity-25" />
                    <div className="relative bg-gradient-to-r from-primary to-cyan-500 rounded-2xl p-4 text-center">
                      <p className="text-4xl font-bold text-white">
                        {totalPrice.toLocaleString()}
                      </p>
                      <p className="text-white/90 text-sm mt-1">{vehicle.devise}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Prochaine étape</p>
                    <p className="text-blue-700">
                      Après confirmation, vous serez redirigé vers la page de paiement pour finaliser votre réservation.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={confirmReservation}
                disabled={createReservation.isPending}
                className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20 mt-6 group"
              >
                {createReservation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Confirmer la réservation</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFormPage;
