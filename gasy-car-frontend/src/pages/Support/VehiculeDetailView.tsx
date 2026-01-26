"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import { vehiculeAPI } from "@/Actions/vehiculeApi";

import {
  Eye,
  Calendar,
  MapPin,
  Gauge,
  ShieldCheck,
  User,
  FileText,
  ChevronLeft,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 p-6">
    <div className="h-96 bg-gray-200 rounded-3xl"></div>
    <div className="grid grid-cols-3 gap-6">
      <div className="h-64 bg-gray-200 rounded-2xl col-span-2"></div>
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);

const DataRow = ({
  label,
  value,
  isMonospace = false,
  highlight = false,
}: any) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50 px-2 rounded transition-colors">
    <span className="text-gray-500 font-medium">{label}</span>
    <span
      className={`font-semibold text-gray-900 ${isMonospace ? "font-mono tracking-tight" : ""
        } ${highlight ? "text-blue-600" : ""}`}
    >
      {value || "—"}
    </span>
  </div>
);

function toNumberLikeString(input: string) {
  // accepte "15000", "15000.00", "15 000", "15,000"
  const cleaned = input.replace(/\s/g, "").replace(/,/g, ".");
  return cleaned;
}

export default function VehiculeDetailView() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: vehicule, isLoading, isError } = useVehiculeQuery(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ✅ champ caution éditable (support)
  const [cautionDraft, setCautionDraft] = useState<string>("");
  const [cautionTouched, setCautionTouched] = useState(false);

  useEffect(() => {
    if (!vehicule) return;
    // initialise le draft à partir du serveur
    setCautionDraft(
      vehicule.montant_caution !== undefined && vehicule.montant_caution !== null
        ? String(vehicule.montant_caution)
        : ""
    );
    setCautionTouched(false);
  }, [vehicule]);

  // ✅ Mutation Validation Admin
  const validateMutation = useMutation({
    mutationFn: async ({
      vehiculeId,
      valide,
    }: {
      vehiculeId: string;
      valide: boolean;
    }) => {
      const res = await vehiculeAPI.patch_vehicule(vehiculeId, { valide } as any);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.vehiculeId] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });

  // ✅ Mutation Certification
  const certifyMutation = useMutation({
    mutationFn: async ({
      vehiculeId,
      est_certifie,
    }: {
      vehiculeId: string;
      est_certifie: boolean;
    }) => {
      const res = await vehiculeAPI.patch_vehicule(vehiculeId, { est_certifie } as any);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.vehiculeId] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });

  // ✅ Mutation Caution
  const cautionMutation = useMutation({
    mutationFn: async ({
      vehiculeId,
      montant_caution,
    }: {
      vehiculeId: string;
      montant_caution: string;
    }) => {
      const payload = { montant_caution } as any;
      const res = await vehiculeAPI.patch_vehicule(vehiculeId, payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.vehiculeId] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      setCautionTouched(false);
    },
  });

  const busy =
    validateMutation.isPending || certifyMutation.isPending || cautionMutation.isPending;

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !vehicule) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ❌ Erreur de chargement du dossier véhicule.
      </div>
    );
  }

  // --- LOGIQUE DONNÉES ---
  const photos =
    vehicule.photos?.length > 0
      ? vehicule.photos
      : [{ image_url: "/placeholder.jpg", id: "default" }];

  const mainPhoto = photos[selectedImageIndex]?.image_url;

  const urbain = vehicule.pricing_grid?.find((p: any) => p.zone_type === "URBAIN");
  const province = vehicule.pricing_grid?.find((p: any) => p.zone_type === "PROVINCE");

  const driver = vehicule.driver_data;
  const owner = vehicule.proprietaire_data;

  const isValidated = !!vehicule.valide;
  const isCertified = !!vehicule.est_certifie;

  const devise = vehicule.devise || "MGA";

  const serverCautionString =
    vehicule.montant_caution !== undefined && vehicule.montant_caution !== null
      ? String(vehicule.montant_caution)
      : "";

  const cautionChanged = useMemo(() => {
    if (!cautionTouched) return false;
    return toNumberLikeString(cautionDraft) !== toNumberLikeString(serverCautionString);
  }, [cautionDraft, serverCautionString, cautionTouched]);

  const canSaveCaution = !!id && cautionChanged && !busy;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 font-sans text-slate-800 animate-in fade-in duration-500">
      {/* HEADER DE NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/support/fleet"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Retour à la flotte
        </Link>
        <div className="text-xs text-gray-400 font-mono">
          Dernière synchro: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* =========================================================================
            COLONNE GAUCHE
           ========================================================================= */}
        <div className="xl:col-span-8 space-y-6">
          {/* CARTE PRINCIPALE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative group">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${vehicule.est_disponible
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                  }`}
              >
                {vehicule.est_disponible ? "DISPONIBLE" : "INDISPONIBLE"}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-800 shadow-sm backdrop-blur-md border">
                {vehicule.categorie_data?.nom || "Non classé"}
              </span>

              {isValidated ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> VALIDÉ ADMIN
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> EN ATTENTE
                </span>
              )}

              {isCertified ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" /> CERTIFIÉ
                </span>
              ) : null}
            </div>

            {/* Image */}
            <div className="relative h-[500px] bg-gray-900 w-full flex items-center justify-center overflow-hidden">
              <img
                src={mainPhoto}
                alt="Vue véhicule"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
              />

              {/* hotspot demo */}
              <div className="absolute top-[60%] left-[30%] group/eye">
                <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition animate-pulse">
                  <Eye className="w-4 h-4" />
                </button>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 bg-gray-900/90 text-white text-xs p-2 rounded opacity-0 group-hover/eye:opacity-100 transition pointer-events-none text-center backdrop-blur">
                  Zoom sur l&apos;aile avant
                  <br />
                  <span className="text-gray-400">Aucun défaut détecté</span>
                </div>
              </div>
            </div>

            {/* Bandeau Titre */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-end bg-white">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {vehicule.marque_data?.nom}{" "}
                  <span className="text-blue-600">{vehicule.modele_data?.label}</span>
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {vehicule.ville}{" "}
                  <span className="text-gray-300">|</span> {vehicule.zone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">
                  Prix Standard
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {urbain?.prix_jour ?? "—"}{" "}
                  <span className="text-base font-normal text-gray-500">Ar / jour</span>
                </p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="px-6 pb-6 flex gap-3 overflow-x-auto scrollbar-hide">
              {photos.map((p: any, idx: number) => (
                <button
                  key={p.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={p.image_url} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* GRILLE TECHNIQUE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fiche Technique */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
                <FileText className="w-5 h-5 text-blue-500" /> Fiche Technique
              </h3>
              <div className="space-y-1">
                <DataRow
                  label="Plaque Immat."
                  value={vehicule.numero_immatriculation}
                  isMonospace
                  highlight
                />
                <DataRow label="Numéro Série (VIN)" value={vehicule.numero_serie} isMonospace />
                <DataRow label="Année" value={vehicule.annee} />
                <DataRow label="Couleur" value={vehicule.couleur} />
                <DataRow
                  label="Portes / Places"
                  value={`${vehicule.nombre_portes} portes / ${vehicule.nombre_places} places`}
                />
                <DataRow label="Kilométrage" value={`${vehicule.kilometrage_actuel_km} km`} />
                <DataRow label="Carburant" value={vehicule.type_carburant_data?.nom} />
                <DataRow label="Transmission" value={vehicule.transmission_data?.nom} />
              </div>
            </div>

            {/* État & Options */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
                <ShieldCheck className="w-5 h-5 text-green-500" /> État & Options
              </h3>

              <div className="space-y-1 mb-6">
                <DataRow label="Statut Technique" value={vehicule.statut_data?.nom} highlight />
                <DataRow label="Certifié" value={vehicule.est_certifie ? "✅ Oui" : "Non"} />
                <DataRow label="Validé Admin" value={vehicule.valide ? "✅ Oui" : "Non"} />
                <DataRow
                  label="Caution"
                  value={`${vehicule.montant_caution ?? "0.00"} ${devise}`}
                  highlight
                />
              </div>

              <div className="mt-auto">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Équipements inclus</p>
                <div className="flex flex-wrap gap-2">
                  {vehicule.equipements_details?.length > 0 ? (
                    vehicule.equipements_details.map((eq: any) => (
                      <span
                        key={eq.id}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200"
                      >
                        {eq.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">Aucun équipement listé</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION CHAUFFEUR */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <User className="w-5 h-5 text-purple-500" /> Chauffeur Assigné
              </h3>
              {driver && (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${driver.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {driver.is_available ? "DISPONIBLE" : "OCCUPÉ"}
                </span>
              )}
            </div>

            {driver ? (
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center text-center space-y-2 md:w-1/4 border-r border-gray-100 pr-4">
                    <div className="relative">
                      <img
                        src={driver.profile_photo || "/placeholder.jpg"}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        alt="Driver"
                      />
                      <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] px-1 rounded font-bold">
                        {driver.experience_years} ANS
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {driver.first_name} {driver.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">{driver.phone_number}</p>
                    <p className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {driver.license_category || "Permis B"}
                    </p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Nationalité</span>
                      <p className="font-medium">{driver.nationality}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Ville / Adresse</span>
                      <p className="font-medium">
                        {driver.city}, {driver.address}
                      </p>
                    </div>

                    <div className="col-span-2 h-px bg-gray-100 my-2"></div>

                    <div>
                      <span className="text-gray-400 text-xs uppercase">Permis N°</span>
                      <p className="font-mono">{driver.license_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Expiration</span>
                      <p className="font-medium text-red-600">{driver.license_expiry_date}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">CIN N°</span>
                      <p className="font-mono">{driver.cin_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Date Naissance</span>
                      <p className="font-medium">{driver.date_of_birth}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 italic">
                Aucun chauffeur assigné à ce véhicule.
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            COLONNE DROITE
           ========================================================================= */}
        <div className="xl:col-span-4 space-y-6">
          {/* TARIFS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold flex items-center gap-2">
                <Gauge className="w-5 h-5" /> Grille Tarifaire
              </h3>
            </div>

            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Période</th>
                    <th className="px-4 py-3 text-blue-600">Urbain</th>
                    <th className="px-4 py-3 text-orange-600">Province</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { l: "Heure", u: urbain?.prix_heure, p: province?.prix_heure },
                    { l: "Jour", u: urbain?.prix_jour, p: province?.prix_jour, strong: true },
                    { l: "Semaine", u: urbain?.prix_par_semaine, p: province?.prix_par_semaine },
                    { l: "Mois", u: urbain?.prix_mois, p: province?.prix_mois },
                  ].map((row, i) => (
                    <tr key={i} className={row.strong ? "bg-blue-50/50 font-semibold" : ""}>
                      <td className="px-4 py-3 text-gray-600 font-medium">{row.l}</td>
                      <td className="px-4 py-3">{row.u ? `${row.u} Ar` : "—"}</td>
                      <td className="px-4 py-3">{row.p ? `${row.p} Ar` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t border-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span>Remise Longue Durée (Urbain):</span>
                  <span className="font-bold text-green-600">
                    {urbain?.remise_longue_duree_pourcent || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remise Longue Durée (Prov):</span>
                  <span className="font-bold text-green-600">
                    {province?.remise_longue_duree_pourcent || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DISPONIBILITÉS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" /> Calendrier
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {vehicule.availabilities?.length > 0 ? (
                vehicule.availabilities.map((a: any) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">
                        {new Date(a.start_date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        au {new Date(a.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase bg-white border px-2 py-1 rounded text-gray-600">
                      {a.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Aucune indisponibilité prévue.</p>
              )}
            </div>
          </div>

          {/* PROPRIÉTAIRE */}
          {owner && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">
                Prestataire / Proprio
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {owner.first_name?.[0]}
                  {owner.last_name?.[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">
                    {owner.first_name} {owner.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{owner.email}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${owner.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                ></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Tel:</span>
                <a href={`tel:${owner.phone}`} className="font-mono text-blue-600 hover:underline">
                  {owner.phone}
                </a>
              </div>
            </div>
          )}

          {/* DESCRIPTION TEXTE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-2">Conditions & Notes</h3>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {vehicule.conditions_particulieres ||
                vehicule.description ||
                "Aucune note particulière pour ce véhicule."}
            </p>
          </div>

          {/* ✅ ACTIONS SUPPORT (sous Conditions & Notes) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Actions Support
            </h3>

            {/* Validation Admin */}
            <div className="rounded-2xl border border-gray-200 p-4 mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Validation Admin</p>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700">
                  Statut :{" "}
                  <span className={`font-bold ${isValidated ? "text-purple-700" : "text-yellow-700"}`}>
                    {isValidated ? "Validé" : "En attente"}
                  </span>
                </span>

                <div className="flex gap-2">
                  {isValidated ? (
                    <button
                      disabled={busy || !id}
                      onClick={() => validateMutation.mutate({ vehiculeId: id!, valide: false })}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold border ${busy ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                        }`}
                    >
                      Annuler
                    </button>
                  ) : (
                    <>
                      <button
                        disabled={busy || !id}
                        onClick={() => validateMutation.mutate({ vehiculeId: id!, valide: true })}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 ${busy ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                      >
                        Valider
                      </button>
                      <button
                        disabled={busy || !id}
                        onClick={() => validateMutation.mutate({ vehiculeId: id!, valide: false })}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold border ${busy ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                          }`}
                      >
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>

              {validateMutation.isError ? (
                <p className="text-xs text-red-500 mt-2">Erreur pendant la validation.</p>
              ) : null}
            </div>

            {/* Certification */}
            <div className="rounded-2xl border border-gray-200 p-4 mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Certification</p>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700">
                  Statut :{" "}
                  <span className={`font-bold ${isCertified ? "text-blue-700" : "text-gray-600"}`}>
                    {isCertified ? "Certifié" : "Non certifié"}
                  </span>
                </span>

                <div className="flex gap-2">
                  {isCertified ? (
                    <button
                      disabled={busy || !id}
                      onClick={() => certifyMutation.mutate({ vehiculeId: id!, est_certifie: false })}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold border ${busy ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                        }`}
                    >
                      Retirer
                    </button>
                  ) : (
                    <button
                      disabled={busy || !id}
                      onClick={() => certifyMutation.mutate({ vehiculeId: id!, est_certifie: true })}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 ${busy ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    >
                      Certifier
                    </button>
                  )}
                </div>
              </div>

              {certifyMutation.isError ? (
                <p className="text-xs text-red-500 mt-2">Erreur pendant la certification.</p>
              ) : null}
            </div>

            {/* ✅ Modification Caution */}
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Caution ({devise})
              </p>

              <div className="space-y-2">
                <input
                  value={cautionDraft}
                  onChange={(e) => {
                    setCautionDraft(e.target.value);
                    setCautionTouched(true);
                  }}
                  placeholder="Ex: 150000.00"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  disabled={!canSaveCaution}
                  onClick={() =>
                    cautionMutation.mutate({
                      vehiculeId: id!,
                      montant_caution: toNumberLikeString(cautionDraft),
                    })
                  }
                  className={`w-full px-3 py-2 rounded-xl text-sm font-semibold text-white ${canSaveCaution
                      ? "bg-slate-900 hover:bg-slate-800"
                      : "bg-slate-900/40 cursor-not-allowed"
                    }`}
                >
                  Enregistrer
                </button>
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>
                  Actuel: {serverCautionString || "0.00"} {devise}
                </span>
                {cautionChanged ? <span className="text-blue-600 font-semibold">Modifié</span> : null}
              </div>

              {cautionMutation.isError ? (
                <p className="text-xs text-red-500 mt-2">
                  Erreur pendant la mise à jour de la caution.
                </p>
              ) : null}

              {cautionMutation.isSuccess ? (
                <p className="text-xs text-green-600 mt-2">✅ Caution mise à jour.</p>
              ) : null}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
