"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { vehiculeAPI } from "@/Actions/vehiculeApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleCardSkeleton from "@/components/fleet/VehicleCardSkeleton";

import { Filter, Search } from "lucide-react";

type SupportFleetFilter =
  | "PENDING" // non validé
  | "TO_CERTIFY" // validé admin mais non certifié
  | "CERTIFIED" // certifié
  | "VALIDATED" // validé admin (tous)
  | "ALL";

type AnyVehicule = {
  id: string;
  titre?: string;
  marque_nom?: string;
  modele_label?: string;
  ville?: string;
  zone?: string;
  photo_principale?: string | null;
  prix_jour?: number | null;

  est_disponible?: boolean;
  est_certifie?: boolean;

  // parfois présent selon backend
  valide?: boolean;

  created_at?: string;
};

export default function FleetView() {
  const { data: vehicules = [], isLoading } = useVehiculesQuery();

  // ✅ Par défaut: les non validés (toujours premiers à traiter)
  const [filter, setFilter] = useState<SupportFleetFilter>("PENDING");
  const [search, setSearch] = useState("");

  /**
   * ⚠️ Ton endpoint liste ne renvoie pas toujours "valide" / détails.
   * Donc on récupère depuis le détail via cache React Query.
   */
  const detailQueries = useQueries({
    queries: (vehicules as AnyVehicule[]).map((v) => ({
      queryKey: ["vehicule-one", v.id],
      queryFn: async () => (await vehiculeAPI.get_one_vehicule(v.id)).data,
      enabled: !!v?.id,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const detailsById = useMemo(() => {
    const map = new Map<string, any>();
    for (const q of detailQueries) {
      if (q.data?.id) map.set(q.data.id, q.data);
    }
    return map;
  }, [detailQueries]);

  const getValide = (v: AnyVehicule) => {
    if (typeof v.valide === "boolean") return v.valide;
    const d = detailsById.get(v.id);
    if (typeof d?.valide === "boolean") return d.valide;
    // si pas encore chargé, on suppose "en attente" pour ne pas rater les nouveaux
    return false;
  };

  const getCertifie = (v: AnyVehicule) => {
    if (typeof v.est_certifie === "boolean") return v.est_certifie;
    const d = detailsById.get(v.id);
    if (typeof d?.est_certifie === "boolean") return d.est_certifie;
    return false;
  };

  const matchesSearch = (v: AnyVehicule, q: string) => {
    if (!q) return true;

    const d = detailsById.get(v.id);
    const hay = [
      v.marque_nom,
      v.modele_label,
      v.titre,
      v.ville,
      v.zone,
      d?.marque_data?.nom,
      d?.modele_data?.label,
      d?.categorie_data?.nom,
      d?.statut_data?.nom,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q.toLowerCase());
  };

  const computed = useMemo(() => {
    const q = search.trim();

    // 1) recherche
    let list = (vehicules as AnyVehicule[]).filter((v) => matchesSearch(v, q));

    // 2) filtres support
    if (filter === "PENDING") {
      list = list.filter((v) => getValide(v) === false);
    } else if (filter === "VALIDATED") {
      list = list.filter((v) => getValide(v) === true);
    } else if (filter === "CERTIFIED") {
      list = list.filter((v) => getCertifie(v) === true);
    } else if (filter === "TO_CERTIFY") {
      // ✅ À certifier = validé admin MAIS pas certifié
      list = list.filter((v) => getValide(v) === true && getCertifie(v) === false);
    }

    // 3) tri support (toujours logique)
    // - d'abord non validés
    // - puis "à certifier"
    // - puis le reste
    // - et à l'intérieur, plus récent d'abord
    list = [...list].sort((a, b) => {
      const aVal = getValide(a);
      const bVal = getValide(b);

      if (aVal !== bVal) return (aVal ? 1 : 0) - (bVal ? 1 : 0); // false avant true

      const aToCert = aVal && !getCertifie(a);
      const bToCert = bVal && !getCertifie(b);
      if (aToCert !== bToCert) return (aToCert ? 0 : 1) - (bToCert ? 0 : 1); // à certifier avant certifié

      const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bd - ad; // récent d'abord
    });

    return list;
  }, [vehicules, detailsById, filter, search]);

  const counts = useMemo(() => {
    const all = vehicules as AnyVehicule[];
    const pending = all.filter((v) => getValide(v) === false).length;
    const validated = all.filter((v) => getValide(v) === true).length;
    const certified = all.filter((v) => getCertifie(v) === true).length;
    const toCertify = all.filter((v) => getValide(v) === true && getCertifie(v) === false).length;
    return { all: all.length, pending, validated, certified, toCertify };
  }, [vehicules, detailsById]);

  // ✅ Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-poppins">Flotte de Véhicules</h2>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full md:w-72 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Flotte de Véhicules</h2>
          <p className="text-sm text-gray-500">
            Support : repérer les véhicules à valider / à certifier
          </p>
        </div>

        <Button variant="outline" className="rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* ✅ Filtres + Recherche */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* ✅ premier filtre: À valider */}
          <Button
            variant={filter === "PENDING" ? "default" : "outline"}
            className={`rounded-xl ${filter === "PENDING" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setFilter("PENDING")}
          >
            À valider ({counts.pending})
          </Button>

          {/* ✅ manquant: À certifier */}
          <Button
            variant={filter === "TO_CERTIFY" ? "default" : "outline"}
            className={`rounded-xl ${filter === "TO_CERTIFY" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setFilter("TO_CERTIFY")}
          >
            À certifier ({counts.toCertify})
          </Button>

          <Button
            variant={filter === "CERTIFIED" ? "default" : "outline"}
            className={`rounded-xl ${filter === "CERTIFIED" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setFilter("CERTIFIED")}
          >
            Certifiés ({counts.certified})
          </Button>

          <Button
            variant={filter === "VALIDATED" ? "default" : "outline"}
            className={`rounded-xl ${filter === "VALIDATED" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setFilter("VALIDATED")}
          >
            Validés ({counts.validated})
          </Button>

          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            className={`rounded-xl ${filter === "ALL" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            Tous ({counts.all})
          </Button>
        </div>

        {/* Recherche */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (marque, modèle, ville, statut...)"
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* ✅ Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {computed.length > 0 ? (
          computed.map((v) => {
            const valid = getValide(v);
            const cert = getCertifie(v);

            return (
              <div
                key={v.id}
                className="border-none shadow-md rounded-2xl overflow-hidden bg-white"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-200">
                  <img
                    src={v.photo_principale || "/placeholder.jpg"}
                    alt={v.titre || "Véhicule"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />

                  {/* Badge disponibilité */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow ${
                      v.est_disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.est_disponible ? "Disponible" : "Indisponible"}
                  </div>

                  {/* Badge validation */}
                  <div
                    className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow ${
                      valid ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {valid ? "Validé admin" : "À valider"}
                  </div>

                  {/* Badge certifié / à certifier */}
                  {cert ? (
                    <div className="absolute bottom-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow bg-blue-100 text-blue-700">
                      Certifié
                    </div>
                  ) : valid ? (
                    <div className="absolute bottom-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow bg-gray-100 text-gray-700">
                      À certifier
                    </div>
                  ) : null}
                </div>

                {/* Contenu */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900">
                    {v.marque_nom} {v.modele_label}
                  </h3>

                  <p className="text-sm text-gray-600">{v.titre}</p>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{v.ville || "Ville inconnue"}</span>
                    <span className="font-semibold text-gray-900">
                      {v.prix_jour ? `${v.prix_jour} Ar / jour` : "Prix non défini"}
                    </span>
                  </div>

                  {/* Lien détail (là-bas on valide/certifie) */}
                  <Link
                    to={`/support/fleet/vehicule/${v.id}`}
                    className="block text-center w-full border border-blue-200 rounded-xl text-blue-600 py-2 hover:bg-blue-50 transition"
                  >
                    Voir / Contrôler
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Aucun véhicule trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
