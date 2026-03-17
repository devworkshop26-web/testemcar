import React from 'react';
import { Banknote, Clock, CalendarCheck, CalendarDays, Map } from 'lucide-react';

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

interface ZoneDiscounts {
  remise_par_heure?: string | number | null;
  remise_par_jour?: string | number | null;
  remise_par_mois?: string | number | null;
  remise_longue_duree_pourcent?: string | number | null;
}

interface PricingGridSectionProps {
  pricingGrid: PricingGridItem[];
  urbanDiscounts?: ZoneDiscounts;
  provinceDiscounts?: ZoneDiscounts;
}

const parseNumberish = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return null;
  const normalized = typeof value === 'string' ? value.replace(',', '.') : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatPrice = (price?: string | number | null) => {
  const parsed = parseNumberish(price);
  if (parsed === null) return '-';
  return `${parsed.toLocaleString('fr-FR')} Ar`;
};

const parseDiscountPercent = (discount?: string | number | null) => {
  const parsed = parseNumberish(discount);
  if (parsed === null || parsed < 0) return 0;
  if (parsed >= 100) return 100;
  return parsed;
};

const pickDiscount = (itemDiscount?: string | number | null, fallbackDiscount?: string | number | null) => (
  itemDiscount !== null && itemDiscount !== undefined ? itemDiscount : fallbackDiscount
);

const PricingGridSection: React.FC<PricingGridSectionProps> = ({
  pricingGrid,
  urbanDiscounts,
  provinceDiscounts,
}) => {
  if (!pricingGrid?.length) return null;

  const renderPriceLine = (
    label: string,
    icon: React.ReactNode,
    basePrice?: string | number | null,
    discount?: string | number | null,
  ) => {
    const parsedBasePrice = parseNumberish(basePrice);
    if (parsedBasePrice === null) return null;

    const discountPercent = parseDiscountPercent(discount);
    const discountedPrice = parsedBasePrice * (1 - discountPercent / 100);

    return (
      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm flex items-center gap-2">{icon} {label}</span>
        <div className="flex items-end flex-col gap-1">
          <span className="font-bold text-gray-900">{formatPrice(discountedPrice)}</span>
          <span className="text-xs font-medium text-gray-500">Prix sans remise: {formatPrice(parsedBasePrice)}</span>
          <span className={`text-xs font-medium ${discountPercent > 0 ? 'text-emerald-700' : 'text-gray-500'}`}>
            Remise: -{discountPercent}%
          </span>
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
        {pricingGrid.map((item, index) => {
          const zoneDiscounts = item.zone_type === 'PROVINCE' ? provinceDiscounts : urbanDiscounts;

          return (
            <div
              key={item.id ?? index}
              className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 mb-4">
                {item.zone_type === 'URBAIN'
                  ? <Map className="w-5 h-5 text-blue-500" />
                  : <Map className="w-5 h-5 text-orange-500" />}
                <h4 className="font-bold text-lg text-gray-800 capitalize">{item.zone_type.toLowerCase()}</h4>
              </div>

              <div className="space-y-3">
                {item.zone_type === 'URBAIN' && renderPriceLine(
                  'Par Heure',
                  <Clock className="w-4 h-4" />,
                  item.prix_heure,
                  pickDiscount(item.remise_par_heure, zoneDiscounts?.remise_par_heure),
                )}
                {renderPriceLine(
                  'Par Jour',
                  <CalendarDays className="w-4 h-4" />,
                  item.prix_jour,
                  pickDiscount(item.remise_par_jour, zoneDiscounts?.remise_par_jour),
                )}
                {renderPriceLine(
                  'Par Semaine',
                  <CalendarCheck className="w-4 h-4" />,
                  item.prix_par_semaine,
                  pickDiscount(item.remise_longue_duree_pourcent, zoneDiscounts?.remise_longue_duree_pourcent),
                )}
                {renderPriceLine(
                  'Par Mois',
                  <CalendarCheck className="w-4 h-4" />,
                  item.prix_mois,
                  pickDiscount(item.remise_par_mois, zoneDiscounts?.remise_par_mois),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingGridSection;
