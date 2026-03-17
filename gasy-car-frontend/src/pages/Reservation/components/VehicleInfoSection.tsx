import React from 'react';
import {
  Check,
  CircleUser,
  DollarSign,
  Gauge,
  Infinity as InfinityIcon,
  Info,
  Milestone,
  Star,
} from 'lucide-react';

import type { ReservationVehicle } from '../reservationTypes';

export type VehicleInfoSectionProps = {
  vehicle: ReservationVehicle;
  vehicleTitle: string;
  vehicleLocation: string;
};

const VehicleInfoSection: React.FC<VehicleInfoSectionProps> = ({
  vehicle,
  vehicleTitle,
  vehicleLocation,
}) => {
  const features = vehicle.features || [];
  const unlimitedMileage = vehicle.unlimitedMileage ?? false;
  const mileageLimit = vehicle.mileageLimit;
  const extraKmPrice = vehicle.extraKmPrice;
  const vehicleType = vehicle.type || vehicle.type_vehicule || 'Véhicule';

  // ✅ PROPRIÉTAIRE (déjà fourni par l’API véhicule)
  const owner = vehicle.proprietaire_data;

  const ownerName = owner
    ? `${owner.first_name} ${owner.last_name}`
    : 'Propriétaire';

  const ownerPhone = owner?.phone;

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
      {/* ───────────── TITRE ───────────── */}
      <h3 className="font-bold text-xl text-secondary-900 mb-6 flex items-center gap-3">
        <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
          <Info size={20} />
        </span>
        Informations Véhicule
      </h3>

      {/* ───────────── PROPRIÉTAIRE ───────────── */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
          <CircleUser className="w-10 h-10 text-gray-300" />
        </div>

        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Propriétaire
          </p>

          <p className="font-bold text-gray-900 text-lg">
            {ownerName}
          </p>

          {ownerPhone && (
            <p className="text-sm text-gray-500">
              📞 {ownerPhone}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star size={12} fill="currentColor" /> 4.8
            </span>
            <span>•</span>
            {owner?.date_joined && (
              <span>
                Membre depuis {new Date(owner.date_joined).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ───────────── DESCRIPTION ───────────── */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          À propos de ce véhicule
        </h4>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Découvrez ce superbe <strong>{vehicleTitle}</strong>, idéal pour vos
          déplacements à {vehicleLocation}.
          {vehicleType === 'Voiture' &&
            ' Ce véhicule offre un confort optimal pour la ville comme pour la route.'}
          {vehicleType === 'Camion' &&
            ' Un utilitaire robuste, parfait pour le transport de marchandises ou les déménagements.'}
          {vehicleType === 'Scooter' &&
            ' Faufilez-vous partout avec ce deux-roues économique et pratique.'}
          {features.includes('4x4') &&
            ' Grâce à ses capacités 4x4, affrontez les pistes de Madagascar en toute sérénité.'}
          <br />
          <br />
          Le véhicule est régulièrement entretenu et inspecté par nos équipes
          pour garantir votre sécurité.
          {unlimitedMileage &&
            " Profitez du kilométrage illimité pour explorer l'île sans compter !"}
        </p>
      </div>

      {/* ───────────── FICHE TECHNIQUE ───────────── */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 mb-4">Fiche Technique</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TechItem label="Boîte" value={vehicle.transmissionLabel || 'Manuelle'} />
          <TechItem label="Carburant" value={vehicle.fuelLabel || 'Essence'} />
          <TechItem label="Places" value={vehicle.seatCount || 5} />
          <TechItem label="Portes" value={vehicle.doorCount || 4} />
          <TechItem label="Année" value={vehicle.year || '-'} />
          <TechItem label="Couleur" value={vehicle.color || '-'} />
          <TechItem
            label="Climatisation"
            value={
              (vehicle.features || []).some(f =>
                f.toLowerCase().includes('clim')
              )
                ? 'Oui'
                : 'Non'
            }
          />
        </div>
      </div>

      {/* ───────────── ÉQUIPEMENTS ───────────── */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4">Équipements Inclus</h4>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Check size={14} className="text-green-500" />
              {feature}
            </span>
          ))}

          {unlimitedMileage && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700 shadow-sm">
              <Check size={14} className="text-blue-500" />
              Km Illimité
            </span>
          )}
        </div>
      </div>

      {/* ───────────── CONDITIONS ───────────── */}
      <div className="mt-10">
        <h3 className="font-bold text-xl text-secondary-900 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Milestone size={20} />
          </span>
          Conditions de Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="p-3 bg-white rounded-lg shadow-sm text-gray-600">
              {unlimitedMileage ? (
                <InfinityIcon size={24} className="text-blue-500" />
              ) : (
                <Gauge size={24} />
              )}
            </div>
            <div>
              <span className="block text-sm font-bold text-gray-900">
                Forfait Kilométrique
              </span>
              <span className="text-xs text-gray-500">
                {unlimitedMileage
                  ? 'Kilométrage illimité'
                  : `${mileageLimit || 200} km inclus / jour`}
              </span>
            </div>
          </div>

          {!unlimitedMileage && mileageLimit && (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="p-3 bg-white rounded-lg shadow-sm text-gray-600">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="block text-sm font-bold text-gray-900">
                  Km Supplémentaire
                </span>
                <span className="text-xs text-gray-500">
                  Facturé {extraKmPrice?.toLocaleString() ?? '—'} Ar / km
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoSection;

/* ───────────── COMPONENT TECH ITEM ───────────── */
const TechItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">
      {label}
    </span>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);
