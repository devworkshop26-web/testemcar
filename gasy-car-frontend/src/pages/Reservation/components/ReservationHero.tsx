import React from 'react';
import { ArrowLeft, Briefcase, MapPin, ShieldCheck, Star } from 'lucide-react';

import type { PricingRates } from '../reservationTypes';

export type ReservationHeroProps = {
  coverImage: string;
  vehicleTitle: string;
  vehicleLocation: string;
  vehicleRating: number;
  vehicleTrips: number;
  vehicleType: string;
  isCertified: boolean;
  pricingRates: PricingRates;
  onBack: () => void;
};

const ReservationHero: React.FC<ReservationHeroProps> = ({
  coverImage,
  vehicleTitle,
  vehicleLocation,
  vehicleRating,
  vehicleTrips,
  vehicleType,
  isCertified,
  pricingRates,
  onBack
}) => {
  return (
    <div className="relative h-[65vh] w-full bg-secondary-900 overflow-hidden">
      <img src={coverImage} alt={vehicleTitle} className="w-full h-full object-cover opacity-90 scale-105 animate-in fade-in duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-50"></div>

      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-3 rounded-full transition-all group flex items-center gap-2 border border-white/10"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> <span className="font-bold text-sm">Retour</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pt-32 pb-12 px-4 sm:px-8 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-900/20">
                {vehicleType}
              </span>
              {isCertified && (
                <span className="bg-blue-500/20 text-secondary-900 border border-blue-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1">
                  <ShieldCheck size={14} /> Véhicule Certifié
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-secondary-900 mb-4 tracking-tight drop-shadow-sm">{vehicleTitle}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm font-bold bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl inline-flex border border-white/40 shadow-sm">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-600" /> {vehicleLocation}
              </span>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400" fill="currentColor" /> {vehicleRating}
                <span className="text-gray-400 font-normal">(24 avis)</span>
              </span>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="flex items-center gap-2">
                <Briefcase size={18} className="text-blue-500" /> {vehicleTrips} voyages
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Prix par jour</p>
              <p className="text-5xl font-black text-secondary-900">
                {(pricingRates.day ?? 0).toLocaleString('fr-FR')} <span className="text-lg text-gray-500 font-bold">Ar</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationHero;
