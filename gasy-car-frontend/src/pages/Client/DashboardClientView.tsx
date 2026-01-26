import {
  Car,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOverClientView = () => {
  const { user } = useCurentuser();
  const { data: reservations = [] } = useReservationClientQuery(user?.id);
  const navigate = useNavigate();



  const activeReservations = reservations.filter(r =>
    ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(r.status)
  );

  const recentReservations = reservations
    .filter(r => ["COMPLETED", "CANCELLED"].includes(r.status))
    .slice(0, 2);


  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* 🟦 WELCOME HERO SECTION */}
      <div className="relative p-10 rounded-3xl shadow-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
          {/* LEFT TEXT */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins leading-tight">
              Prêt pour votre prochaine aventure, {user?.first_name} ?
            </h2>
            <p className="text-blue-100 mt-3">
              Explorez et réservez facilement votre prochain véhicule.
            </p>


          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="hidden md:flex items-center justify-center">
            <Car className="w-40 h-40 text-white/30" />
          </div>
        </div>
      </div>

      {/* 🟦 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">

          {/* ACTIVE RENTAL */}
          <div>
            <h3 className="text-xl font-bold font-poppins mb-4">Location en cours</h3>

            {activeReservations.length > 0 ? (
              activeReservations.map(res => {
                const vehicle = res.vehicle_data;
                const photo = vehicle?.photo_principale || (vehicle?.photos?.[0] as any)?.image_url;

                return (
                  <Card
                    key={res.id}
                    className="rounded-2xl border-none shadow-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* PHOTO */}
                      <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                        {photo ? (
                          <img
                            src={photo}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <Skeleton className="w-full h-full rounded-none bg-gray-200" />
                        )}
                        <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl">
                          {res.status === "PENDING" ? "En attente" : "En cours"}
                        </span>
                      </div>

                      {/* CARD CONTENT */}
                      <CardContent className="flex-1 p-6 space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {vehicle?.marque_data?.nom ?? (vehicle as any)?.marque_nom ?? "Marque inconnue"}{" "}
                              {vehicle?.modele_data?.label ?? (vehicle as any)?.modele_label ?? vehicle?.titre ?? "Modèle non spécifié"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {vehicle?.transmission_data?.nom ?? (vehicle as any)?.transmission_nom ?? "Transmission"} • {vehicle?.type_carburant_data?.nom ?? (vehicle as any)?.carburant_nom ?? "Carburant"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">Montant total</p>
                            <p className="font-bold text-blue-600 text-lg">
                              {parseInt(res.total_amount).toLocaleString()} Ar
                            </p>
                          </div>
                        </div>

                        {/* PROGRESS */}
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-blue-600 h-2 rounded-full w-[60%] transition-all"></div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl text-xs"
                            onClick={() => navigate(`/client/booking/${res.id}`)}
                          >
                            Détails
                          </Button>
                          <Button
                            className="flex-1 bg-blue-600 text-white rounded-xl text-xs hover:bg-blue-700"
                            onClick={() => navigate("/client/supports/my-tickets")}
                          >
                            Contacter support
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="rounded-2xl border-dashed p-10 text-center shadow-sm">
                <p className="text-gray-500">Aucune location en cours.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/client/rentals")}>
                  Explorer les véhicules
                </Button>
              </Card>
            )}
          </div>

          {/* RECENT */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Historique récent</h3>

            <div className="grid grid-cols-1 gap-4">
              {recentReservations.length > 0 ? (
                recentReservations.map(res => {
                  const vehicle = res.vehicle_data;
                  const photo = vehicle?.photo_principale || (vehicle?.photos?.[0] as any)?.image_url;

                  return (
                    <Card
                      key={res.id}
                      className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-none"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {photo ? (
                            <img src={photo} className="w-full h-full object-cover" />
                          ) : (
                            <Skeleton className="w-full h-full bg-gray-200" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">
                            {vehicle?.marque_data?.nom ?? (vehicle as any)?.marque_nom ?? "Marque"}{" "}
                            {vehicle?.modele_data?.label ?? (vehicle as any)?.modele_label ?? vehicle?.titre}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(res.start_datetime).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 text-green-600 mt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-xs font-medium">Terminé</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm col-span-2">Aucun historique récent.</p>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default DashboardOverClientView;
