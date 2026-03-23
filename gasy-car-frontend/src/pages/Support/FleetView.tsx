"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  useVehicleReviewQueueQuery,
} from "@/useQuery/vehiculeUseQuery";
import type { Vehicule } from "@/types/vehiculeType";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleCardSkeleton from "@/components/fleet/VehicleCardSkeleton";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  FileWarning,
  BadgeCheck,
  CarFront,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";

type SupportFleetFilter =
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "DOCS_PENDING"
  | "CERTIFIED"
  | "ALL";

const FILTER_LABELS: Record<SupportFleetFilter, string> = {
  PENDING_REVIEW: "À valider",
  PUBLISHED: "Publiés",
  REJECTED: "Rejetés",
  DOCS_PENDING: "Docs à vérifier",
  CERTIFIED: "Certifiés",
  ALL: "Tous",
};

const SummaryCard = ({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "blue" | "amber" | "emerald" | "red";
}) => {
  const toneClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <Card className={`border shadow-sm ${toneClasses[tone]}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function FleetView() {
  const { data: vehicules = [], isLoading } = useVehicleReviewQueueQuery();

  const [filter, setFilter] = useState<SupportFleetFilter>("PENDING_REVIEW");
  const [search, setSearch] = useState("");

  const matchesSearch = (vehicle: Vehicule, query: string) => {
    if (!query) return true;

    const haystack = [
      vehicle.titre,
      vehicle.marque_nom,
      vehicle.modele_label,
      vehicle.ville,
      vehicle.zone,
      vehicle.workflow_status,
      vehicle.review_comment,
      vehicle.numero_immatriculation,
      vehicle.transmission_nom,
      vehicle.type_carburant_nom,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  };

  const counts = useMemo(() => {
    return {
      all: vehicules.length,
      pending: vehicules.filter((v) => v.workflow_status === "PENDING_REVIEW").length,
      published: vehicules.filter((v) => v.workflow_status === "PUBLISHED").length,
      rejected: vehicules.filter((v) => v.workflow_status === "REJECTED").length,
      docsPending: vehicules.filter(
        (v) => !v.documents_complete || !v.documents_validated
      ).length,
      certified: vehicules.filter((v) => v.est_certifie).length,
    };
  }, [vehicules]);

  const filteredVehicles = useMemo(() => {
    const q = search.trim();

    let list = vehicules.filter((vehicle) => matchesSearch(vehicle, q));

    if (filter === "PENDING_REVIEW") {
      list = list.filter((vehicle) => vehicle.workflow_status === "PENDING_REVIEW");
    } else if (filter === "PUBLISHED") {
      list = list.filter((vehicle) => vehicle.workflow_status === "PUBLISHED");
    } else if (filter === "REJECTED") {
      list = list.filter((vehicle) => vehicle.workflow_status === "REJECTED");
    } else if (filter === "DOCS_PENDING") {
      list = list.filter(
        (vehicle) => !vehicle.documents_complete || !vehicle.documents_validated
      );
    } else if (filter === "CERTIFIED") {
      list = list.filter((vehicle) => vehicle.est_certifie);
    }

    return [...list].sort((a, b) => {
      const rank = (status?: string) => {
        if (status === "PENDING_REVIEW") return 0;
        if (status === "REJECTED") return 1;
        if (status === "PUBLISHED") return 2;
        return 3;
      };

      const statusDiff = rank(a.workflow_status) - rank(b.workflow_status);
      if (statusDiff !== 0) return statusDiff;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [vehicules, filter, search]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full md:w-80 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const filterCountValue = (value: SupportFleetFilter) => {
    if (value === "PENDING_REVIEW") return counts.pending;
    if (value === "PUBLISHED") return counts.published;
    if (value === "REJECTED") return counts.rejected;
    if (value === "DOCS_PENDING") return counts.docsPending;
    if (value === "CERTIFIED") return counts.certified;
    return counts.all;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Flotte de véhicules</h2>
          <p className="text-sm text-gray-500">
            Espace support : contrôle des documents, publication et suivi des statuts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Clock3 className="w-5 h-5" />}
          label="À valider"
          value={counts.pending}
          tone="amber"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Publiés"
          value={counts.published}
          tone="emerald"
        />
        <SummaryCard
          icon={<XCircle className="w-5 h-5" />}
          label="Rejetés"
          value={counts.rejected}
          tone="red"
        />
        <SummaryCard
          icon={<FileWarning className="w-5 h-5" />}
          label="Docs incomplets / non validés"
          value={counts.docsPending}
          tone="blue"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 flex-wrap">
            {(
              [
                "PENDING_REVIEW",
                "DOCS_PENDING",
                "PUBLISHED",
                "REJECTED",
                "CERTIFIED",
                "ALL",
              ] as SupportFleetFilter[]
            ).map((item) => (
              <Button
                key={item}
                variant={filter === item ? "default" : "outline"}
                className={`rounded-xl ${
                  filter === item ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {FILTER_LABELS[item]} ({filterCountValue(item)})
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher véhicule, ville, immatriculation..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {filteredVehicles.length} véhicule(s) affiché(s) pour le filtre{" "}
          <span className="font-semibold text-slate-700">{FILTER_LABELS[filter]}</span>.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => {
            const isPending = vehicle.workflow_status === "PENDING_REVIEW";
            const isPublished = vehicle.workflow_status === "PUBLISHED";
            const isRejected = vehicle.workflow_status === "REJECTED";
            const docsComplete = !!vehicle.documents_complete;
            const docsValidated = !!vehicle.documents_validated;

            return (
              <Card
                key={vehicle.id}
                className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-slate-200">
                  <img
                    src={vehicle.photo_principale || "/placeholder.jpg"}
                    alt={vehicle.titre || "Véhicule"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge
                      className={
                        vehicle.est_disponible
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {vehicle.est_disponible ? "Disponible" : "Indisponible"}
                    </Badge>

                    {isPending ? (
                      <Badge className="bg-amber-100 text-amber-700">En attente</Badge>
                    ) : null}

                    {isPublished ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Publié</Badge>
                    ) : null}

                    {isRejected ? (
                      <Badge className="bg-red-100 text-red-700">Rejeté</Badge>
                    ) : null}
                  </div>

                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {!docsComplete ? (
                      <Badge className="bg-orange-100 text-orange-700">
                        Docs incomplets
                      </Badge>
                    ) : docsValidated ? (
                      <Badge className="bg-indigo-100 text-indigo-700">
                        Docs validés
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700">
                        Docs à vérifier
                      </Badge>
                    )}

                    {vehicle.est_certifie ? (
                      <Badge className="bg-blue-100 text-blue-700 gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Certifié
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">
                        {vehicle.marque_nom || "Marque"} {vehicle.modele_label || "Modèle"}
                      </h3>

                      <div className="text-right">
                        <p className="text-base font-bold text-slate-900">
                          {vehicle.prix_jour ? `${vehicle.prix_jour} ${vehicle.devise}` : "—"}
                        </p>
                        <p className="text-xs text-slate-500">/ jour</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">{vehicle.titre}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                      <p className="text-xs text-slate-400 uppercase mb-1">Ville</p>
                      <p className="font-semibold text-slate-800">
                        {vehicle.ville || "Non définie"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                      <p className="text-xs text-slate-400 uppercase mb-1">Locations</p>
                      <p className="font-semibold text-slate-800">
                        {vehicle.nombre_locations ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock3 className="w-3.5 h-3.5" />
                        Validation en attente
                      </span>
                    ) : null}

                    {isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Visible publiquement
                      </span>
                    ) : null}

                    {isRejected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                        <XCircle className="w-3.5 h-3.5" />
                        Correction demandée
                      </span>
                    ) : null}

                    {!docsComplete ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        <FileWarning className="w-3.5 h-3.5" />
                        Dossier incomplet
                      </span>
                    ) : null}

                    {vehicle.est_certifie ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Certifié
                      </span>
                    ) : null}
                  </div>

                  <Link
                    to={`/support/fleet/vehicule/${vehicle.id}`}
                    className="block"
                  >
                    <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700">
                      {isPending ? (
                        <>
                          <CircleHelp className="w-4 h-4 mr-2" />
                          Contrôler le dossier
                        </>
                      ) : (
                        <>
                          <CarFront className="w-4 h-4 mr-2" />
                          Ouvrir le dossier
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card className="rounded-3xl border border-dashed border-slate-200 shadow-none">
              <CardContent className="py-14 text-center">
                <p className="text-slate-600 font-medium">
                  Aucun véhicule trouvé pour ce filtre.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Essaie un autre filtre ou modifie ta recherche.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}