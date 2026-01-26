import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Fuel,
  Gauge,
  Users,
  MapPin,
  User,
  Car,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, Outlet } from "react-router-dom";

import { useOwnerVehiculesQuery } from "../../useQuery/vehiculeUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";

const FleetView = () => {
  const navigate = useNavigate();
  const { user } = useCurentuser();

  const {
    data: allOwnerVehicles = [],
    isLoading,
    isError,
  } = useOwnerVehiculesQuery(user?.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filters = ["Tous", "Disponibles", "Loués"];

  const stats = useMemo(() => {
    const total = allOwnerVehicles.length;
    const available = allOwnerVehicles.filter((v: any) => v.est_disponible).length;
    const rented = total - available;
    return { total, available, rented };
  }, [allOwnerVehicles]);

  // LOGIQUE DE RECHERCHE ÉTENDUE
  const filteredVehicles = useMemo(() => {
    let filtered = allOwnerVehicles;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (car: any) =>
          car.marque_nom?.toLowerCase().includes(query) ||
          car.modele_label?.toLowerCase().includes(query) ||
          car.numero_immatriculation?.toLowerCase().includes(query) ||
          car.driver_name?.toLowerCase().includes(query) || // Recherche par Chauffeur
          car.type_carburant_nom?.toLowerCase().includes(query) || // Recherche par Carburant
          car.transmission_nom?.toLowerCase().includes(query) // Recherche par Transmission
      );
    }
    if (activeFilter === "Disponibles") filtered = filtered.filter((car: any) => car.est_disponible);
    else if (activeFilter === "Loués") filtered = filtered.filter((car: any) => !car.est_disponible);
    return filtered;
  }, [allOwnerVehicles, searchQuery, activeFilter]);

  return (
    <>
      <Outlet />
      <div className="space-y-10 pb-12 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ma Flotte</h2>
            <p className="text-gray-500 font-medium">Gérez vos {stats.total} véhicules.</p>
          </div>
          {!isLoading && (
            <div className="flex gap-3">
              <StatItem label="Total" value={stats.total} />
              <StatItem label="Disponibles" value={stats.available} variant="success" />
              <StatItem label="Loués" value={stats.rented} variant="info" />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Marque, Plaque, Chauffeur, Carburant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto items-center">
            <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button onClick={() => navigate("addvehicle")} className="h-11 px-6 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Ajouter
            </Button>
          </div>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((car: any) => (
              <VehicleCard key={car.id} car={car} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

/* ==========================================================================
   VEHICLE CARD
   ========================================================================== */
const VehicleCard = ({ car, navigate }: { car: any; navigate: any }) => {
  const imageUrl = car.photo_principale || "";
  const brandName = car.marque_nom || "Marque";
  const modelName = car.modele_label || "Modèle";
  const driverName = car.driver_name || null;
  const driverPhoto = car.driver_photo || car.driver_image || null; // Supporte plusieurs clés API possibles
  const price = car.prix_jour ? Number(car.prix_jour).toLocaleString() : "0";

  return (
    <Card
      onClick={() => navigate(`/prestataire/vehicle/${car.id}/manage`)}
      className="group relative p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-[24px] bg-white cursor-pointer"
    >
      <div className="relative h-48 w-full rounded-[18px] bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={brandName} className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><Car size={48} /></div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`px-3 py-1 text-[10px] font-bold border-0 ${car.est_disponible ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"}`}>
            {car.est_disponible ? "Disponible" : "Loué"}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="bg-white px-3 py-1.5 rounded-full text-sm font-black shadow-lg">
            {price} <span className="text-[10px] text-slate-500 font-medium">Ar/j</span>
          </div>
        </div>
      </div>

      <CardContent className="px-3 pt-5 pb-2">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight uppercase tracking-tight">
              {brandName} <span className="text-primary">{modelName}</span>
            </h3>
            <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                <p className="text-[11px] font-black text-slate-600 font-mono tracking-wider">
                    {car.numero_immatriculation || "NON ATTRIBUÉE"}
                </p>
            </div>
          </div>
          <div className="bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
            <span className="text-xs font-bold text-amber-600">★ {car.note_moyenne || "5.0"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-500 mb-5">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">{car.ville || "Madagascar"}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <SpecItem icon={Settings} label={car.transmission_nom || "Auto"} />
          <SpecItem icon={Fuel} label={car.type_carburant_nom || "Essence"} />
          <SpecItem icon={Users} label={`${car.nombre_places || "5"}`} />
          <SpecItem icon={Gauge} label={car.kilometrage_actuel_km ? `${(car.kilometrage_actuel_km / 1000).toFixed(0)}k` : "Auto"} />
        </div>

        {/* SECTION CHAUFFEUR AVEC IMAGE */}
        <div className="h-[52px] flex items-center">
          {driverName ? (
            <div className="w-full flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <div className="h-9 w-9 rounded-full bg-white overflow-hidden flex items-center justify-center border border-slate-200 flex-shrink-0 shadow-sm">
                {driverPhoto ? (
                    <img src={driverPhoto} alt={driverName} className="h-full w-full object-cover" />
                ) : (
                    <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate pr-2">
                    {driverName}
                </p>
                <span className="text-[9px] text-primary font-medium uppercase tracking-widest">Chauffeur Assigné</span>
              </div>
            </div>
          ) : (
            <div className="w-full py-3 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
               <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Chauffeur non assigné</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-3 pb-3 pt-2">
        <Button className="w-full bg-slate-900 hover:bg-primary text-white font-medium rounded-xl h-11 transition-all">
          Gérer
        </Button>
      </CardFooter>
    </Card>
  );
};

const StatItem = ({ label, value, variant = "default" }: any) => {
  const styles = {
    default: "bg-white text-slate-900",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <div className={`px-6 py-3 rounded-2xl border shadow-sm text-center min-w-[110px] ${styles[variant as keyof typeof styles]}`}>
      <p className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
};

const SpecItem = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100">
    <Icon className="w-3.5 h-3.5 mb-1 text-slate-400" />
    <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center uppercase tracking-tighter">{label}</span>
  </div>
);

export default FleetView;