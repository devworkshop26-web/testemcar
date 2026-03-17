import React from 'react';
import { Banknote, Clock, CalendarDays, CalendarCheck, Map } from 'lucide-react';

interface PricingGridItem {
    id?: number | string;
    zone_type: 'URBAIN' | 'PROVINCE';
    prix_heure?: string | number | null;
    prix_jour?: string | number | null;
    prix_par_semaine?: string | number | null;
    prix_mois?: string | number | null;
    remise_par_heure?: string | number | null;
    remise_par_jour?: string | number | null;
    remise_par_mois?: string | number | null;
    remise_longue_duree_pourcent?: string | number | null;
}

interface PricingGridSectionProps {
    pricingGrid: PricingGridItem[];
}

const PricingGridSection: React.FC<PricingGridSectionProps> = ({ pricingGrid }) => {
    if (!pricingGrid || pricingGrid.length === 0) return null;

    const formatPrice = (price?: string | number | null) => {
        if (!price) return '-';
        return Number(price).toLocaleString('fr-FR') + ' Ar';
    };

    const toDiscountNumber = (discount?: string | number | null) => {
        if (!discount) return 0;
        const parsed = Number(discount);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const getOriginalPrice = (price?: string | number | null, discount?: string | number | null) => {
        if (!price) return null;

        const priceNumber = Number(price);
        const discountNumber = toDiscountNumber(discount);

        if (!Number.isFinite(priceNumber) || discountNumber <= 0 || discountNumber >= 100) {
            return null;
        }

        return priceNumber / (1 - discountNumber / 100);
    };

    const renderPriceLine = (
        label: string,
        icon: React.ReactNode,
        price?: string | number | null,
        discount?: string | number | null,
    ) => {
        if (!price) return null;

        const discountNumber = toDiscountNumber(discount);
        const originalPrice = getOriginalPrice(price, discount);

        return (
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 text-sm flex items-center gap-2">{icon} {label}</span>
                <div className="flex items-end flex-col gap-1">
                    <span className="font-bold text-gray-900">{formatPrice(price)}</span>
                    {discountNumber > 0 && (
                        <span className="text-xs font-medium text-emerald-700">
                            Remise: -{discountNumber}%
                            {originalPrice && (
                                <span className="text-gray-500"> · Prix normal: {formatPrice(originalPrice)}</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        );
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
                            {item.zone_type === 'URBAIN' && renderPriceLine('Par Heure', <Clock className="w-4 h-4" />, item.prix_heure, item.remise_par_heure)}
                            {renderPriceLine('Par Jour', <CalendarDays className="w-4 h-4" />, item.prix_jour, item.remise_par_jour)}
                            {renderPriceLine('Par Semaine', <CalendarCheck className="w-4 h-4" />, item.prix_par_semaine, item.remise_longue_duree_pourcent)}
                            {renderPriceLine('Par Mois', <CalendarCheck className="w-4 h-4" />, item.prix_mois, item.remise_par_mois)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingGridSection;
