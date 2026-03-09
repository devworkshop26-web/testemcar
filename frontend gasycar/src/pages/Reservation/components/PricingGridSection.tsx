import React from 'react';
import { Banknote, Clock, CalendarDays, CalendarCheck, Map } from 'lucide-react';

interface PricingGridItem {
    id?: number | string;
    zone_type: 'URBAIN' | 'PROVINCE';
    prix_heure?: string | number | null;
    prix_jour?: string | number | null;
    prix_par_semaine?: string | number | null;
    prix_mois?: string | number | null;
}

interface PricingGridSectionProps {
    pricingGrid: PricingGridItem[];
    weeklyDiscount?: number;
    monthlyDiscount?: number;
}

const PricingGridSection: React.FC<PricingGridSectionProps> = ({ pricingGrid, weeklyDiscount, monthlyDiscount }) => {
    if (!pricingGrid || pricingGrid.length === 0) return null;

    const formatPrice = (price?: string | number | null) => {
        if (!price) return '-';
        return Number(price).toLocaleString('fr-FR') + ' Ar';
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 mt-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                    <Banknote className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-gray-900">Grille Tarifaire</h3>
                    <p className="text-gray-500 text-sm">Détails des tarifs par zone et durée</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pricingGrid.map((item, index) => (
                    <div key={index} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-2 mb-4">
                            {item.zone_type === 'URBAIN' ? <Map className="w-5 h-5 text-blue-500" /> : <Map className="w-5 h-5 text-orange-500" />}
                            <h4 className="font-bold text-lg text-gray-800 capitalize">{item.zone_type.toLowerCase()}</h4>
                        </div>

                        <div className="space-y-3">
                            {item.zone_type === 'URBAIN' && item.prix_heure && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Par Heure</span>
                                    <span className="font-bold text-gray-900">{formatPrice(item.prix_heure)}</span>
                                </div>
                            )}
                            {item.prix_jour && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Par Jour</span>
                                    <span className="font-bold text-gray-900">{formatPrice(item.prix_jour)}</span>
                                </div>
                            )}
                            {item.prix_par_semaine && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Par Semaine</span>
                                    <span className="font-bold text-gray-900">{formatPrice(item.prix_par_semaine)}</span>
                                </div>
                            )}
                            {item.prix_mois && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-500 text-sm flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Par Mois</span>
                                    <span className="font-bold text-gray-900">{formatPrice(item.prix_mois)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(weeklyDiscount || monthlyDiscount) && (
                <div className="mt-6 flex flex-wrap gap-4">
                    {weeklyDiscount && weeklyDiscount > 0 && (
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4" /> Remise Hebdomadaire: -{weeklyDiscount}%
                        </div>
                    )}
                    {monthlyDiscount && monthlyDiscount > 0 && (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4" /> Remise Mensuelle: -{monthlyDiscount}%
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PricingGridSection;
