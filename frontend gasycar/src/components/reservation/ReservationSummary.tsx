// src/pages/Reservation/ReservationSummary.tsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Calendar, Clock } from "lucide-react";

interface ReservationSummaryProps {
  car?: any;
  duration: number;
  totalPrice: number;
  dateRange?: { from: Date | null; to: Date | null };
  isLoading?: boolean;
}

const ReservationSummary = ({
  car,
  duration,
  totalPrice,
  dateRange,
  isLoading,
}: ReservationSummaryProps) => {
  const formatDate = (date?: Date | null) => {
    if (!date) return "À définir";
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    return `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const fromLabel = formatDate(dateRange?.from ?? null);
  const toLabel = formatDate(dateRange?.to ?? null);
  const dailyPrice = Number(car?.prix_jour ?? 0);
  const currency = car?.devise ?? "Ar";

  const safeTotal = Number.isFinite(totalPrice) ? totalPrice : 0;

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-400 to-cyan-400 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition duration-500" />
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          {/* Header avec image */}
          <div className="relative h-48 overflow-hidden">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <>
                <img
                  src={
                    car?.photos?.[0]?.image ||
                    car?.photo_principale ||
                    "/placeholder-car.jpg"
                  }
                  alt={car?.titre || "Véhicule"}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badges flottants */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className="bg-white/95 backdrop-blur-sm text-slate-900 hover:bg-white border-0 shadow-lg">
                    {car?.marque?.nom ?? "Marque"}
                  </Badge>
                  {car?.categorie_data?.nom || car?.categorie?.nom ? (
                    <Badge className="bg-primary/95 backdrop-blur-sm text-white hover:bg-primary border-0 shadow-lg">
                      {car?.categorie_data?.nom ?? car?.categorie?.nom}
                    </Badge>
                  ) : null}
                </div>

                {/* Nom du véhicule */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {car
                      ? `${car.marque?.nom ?? ""} ${
                          car.modele_data?.label ??
                          car.modele?.label ??
                          car.titre ??
                          "Véhicule"
                        }`
                      : "Chargement..."}
                  </h3>
                </div>
              </>
            )}
          </div>

          {/* Détails de réservation */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-bold text-slate-900">
                Détails de location
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-slate-600">Début</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {fromLabel}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-slate-600">Retour</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {toLabel}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/10 to-cyan-400/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Durée
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {duration || 0} jour{duration > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
        <div className="relative bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Résumé des prix
          </h4>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Tarif journalier</span>
              <span className="font-semibold text-slate-900">
                {dailyPrice.toLocaleString()} {currency}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Durée estimée</span>
              <span className="font-semibold text-slate-900">
                {duration || 0} jour{duration > 1 ? "s" : ""}
              </span>
            </div>

            <Separator className="bg-slate-200" />

            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-slate-900">
                Total estimé
              </span>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {safeTotal.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">{currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReservationSummary;
