import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";

import { Button } from "@/components/ui/button";

import {
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type DateRange = { from: Date | null; to: Date | null };
import DateSelector from "@/components/reservation/DateSelectorsAll";
import ReservationSummary from "@/components/reservation/ReservationSummary";

const ReservationPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const { data: vehicle, isLoading } = useVehiculeQuery(carId);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ------------------ LOADING ------------------
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="h-20 w-1/2 bg-slate-200 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="h-32 w-full bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-64 w-full bg-slate-200 rounded-3xl animate-pulse" />
            </div>
            <div className="h-96 w-full bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-10 text-center text-xl text-red-500">
        Véhicule introuvable
      </div>
    );
  }

  // ------------------ CALCUL DURATION + PRICE ------------------
  const duration =
    dateRange.from && dateRange.to
      ? Math.max(
        1,
        Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1
      )
      : 0;

  const dailyPrice = Number(vehicle.prix_jour || 0);
  const totalPrice = duration * dailyPrice;

  // ------------------ BUILD FINAL DATETIME ------------------
  const buildDateTime = (date: Date | null, time: string): Date | null => {
    if (!date) return null;
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // ------------------ CONTINUE ------------------
  const handleContinue = () => {
    if (!dateRange.from || !dateRange.to) {
      setErrorMsg("Veuillez sélectionner vos dates de début et de fin.");
      return;
    }

    const startDateTime = buildDateTime(dateRange.from, startTime);
    const endDateTime = buildDateTime(dateRange.to, endTime);

    if (!startDateTime || !endDateTime) {
      setErrorMsg("Les dates sélectionnées sont invalides.");
      return;
    }

    setErrorMsg(null);

    navigate(`/reservation-form/${vehicle.id}`, {
      state: {
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      },
    });
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/10 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* HEADER */}
        <div
          className={`transition-all duration-1000 transform mb-12 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
            }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  Réservation instantanée
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Finalisez votre location
              </h1>

              <p className="text-slate-600 text-lg">
                Choisissez vos dates et vos heures.
              </p>
            </div>

            {/* Secure Block */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-slate-900">100% Sécurisé</p>
                  <p className="text-sm text-slate-600">Paiement protégé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* 🚗 MARQUE + MODÈLE */}
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {vehicle.marque_data?.nom} {vehicle.modele_data?.label}
              </h2>
              <p className="text-slate-500 text-sm">
                Vérifiez vos informations de réservation ci-dessous.
              </p>
            </div>

            {/* DATE SELECTOR */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <DateSelector value={dateRange} onChange={setDateRange} />

              {/* Hours */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 shadow-sm focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 shadow-sm focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="text-xs text-red-500 mt-4">{errorMsg}</p>
              )}

              <Button
                onClick={handleContinue}
                className="w-full h-12 mt-6 rounded-2xl font-semibold"
              >
                Continuer vers la confirmation
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN — SUMMARY */}
          <div
            className={`transition-all duration-1000 delay-300 transform ${isAnimated
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-6"
              }`}
          >
            <div className="sticky top-10">
              <ReservationSummary
                car={vehicle}
                duration={duration}
                totalPrice={totalPrice}
                dateRange={dateRange}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
