import React from 'react';
import { ArrowLeft, Briefcase, MapPin, ShieldCheck, Star } from 'lucide-react';
import type { PricingRates } from '../reservationTypes';

export type VehicleHeaderProps = {
    vehicleTitle: string;
    vehicleLocation: string;
    vehicleRating: number;
    vehicleTrips: number;
    vehicleType: string;
    isCertified: boolean;
    pricingRates: PricingRates;
    onBack: () => void;
};

const VehicleHeader: React.FC<VehicleHeaderProps> = ({
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
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 px-2">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="md:hidden flex items-center justify-center p-2 rounded-full bg-white shadow-sm border border-gray-100 text-gray-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {vehicleType}
                        </span>
                        {isCertified && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1">
                                <ShieldCheck size={14} /> Véhicule Certifié
                            </span>
                        )}
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{vehicleTitle}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <MapPin size={16} className="text-primary-600" /> {vehicleLocation}
                    </span>
                    <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <Star size={16} className="text-yellow-400" fill="currentColor" /> {vehicleRating}
                        <span className="text-gray-400 font-normal">({vehicleTrips > 0 ? (vehicleTrips * 2.5).toFixed(0) : 0} avis)</span>
                    </span>
                    <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <Briefcase size={16} className="text-blue-500" /> {vehicleTrips} voyages
                    </span>
                </div>
            </div>

            <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Prix par jour</p>
                <p className="text-4xl font-black text-gray-900">
                    {(pricingRates.day ?? 0).toLocaleString('fr-FR')} <span className="text-lg text-gray-500 font-bold">Ar</span>
                </p>
            </div>
        </div>
    );
};

export default VehicleHeader;
