import React, { useMemo, useState } from 'react';
import { ArrowRight, LayoutList, Map, ShieldCheck, Calendar, Clock, Info, AlertCircle, Check } from 'lucide-react';
import { ICON_MAP } from '../reservationConstants';
import { DriverOption, type ChauffeurChoice, type PricingRates, type ReservationAddon, type TravelZone, type ReservationVehicle } from '../reservationTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type BookingSidebarProps = {
  totalPrice: number;
  pricingRates: PricingRates;
  vehicle: ReservationVehicle;
  deposit: number;
  travelZone: TravelZone;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  durationLabel: string;
  rateApplied: string;
  driverOption: DriverOption;
  selectedDriverOption: ChauffeurChoice;
  selectedAddons: string[];
  basePrice: number;
  driverFee: number;
  totalAddOns: number;
  serviceFee: number;
  onTravelZoneChange: (zone: TravelZone) => void;
  onDriverOptionChange: (value: ChauffeurChoice) => void;
  onToggleAddon: (id: string) => void;
  onSubmit: () => void;
  addons: ReservationAddon[];
  isLoadingAddons?: boolean;
  isLoading?: boolean;
  desableReservation?: boolean;
  availabilities?: Array<{
    id: string;
    start_date: string;
    end_date: string;
    type: 'AVAILABLE' | 'BLOCKED' | 'RESERVED' | 'MAINTENANCE';
  }>;
};

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  totalPrice,
  pricingRates,
  vehicle,
  deposit,
  travelZone,
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
  durationLabel,
  rateApplied,
  driverOption,
  selectedDriverOption,
  selectedAddons,
  basePrice,
  driverFee,
  totalAddOns,
  serviceFee,
  onTravelZoneChange,
  onDriverOptionChange,
  onToggleAddon,
  onSubmit,
  addons,
  isLoadingAddons,
  isLoading = false,
  availabilities = [],
  desableReservation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRates, setShowRates] = useState(false);

  // Check which zones are available based on pricing_grid and fallback prices
  const availableZones = useMemo(() => {
    const pricingGrid = vehicle.pricing_grid || [];
    const normalizeZoneType = (zoneType: unknown) => String(zoneType ?? '').toUpperCase();
    const hasUrbain = pricingGrid.some(p => normalizeZoneType(p.zone_type) === 'URBAIN');
    const hasProvince = pricingGrid.some(p => normalizeZoneType(p.zone_type) === 'PROVINCE');
    const baseDayPrice = Number(vehicle.pricePerDay ?? vehicle.prix_jour ?? 0);
    const provinceDayPrice = Number(vehicle.province_prix_jour ?? 0);

    return {
      urbain: hasUrbain || baseDayPrice > 0,
      province: hasProvince || provinceDayPrice > 0
    };
  }, [vehicle.pricing_grid, vehicle.pricePerDay, vehicle.prix_jour, vehicle.province_prix_jour]);

  // Auto-select available zone if current selection is not available
  React.useEffect(() => {
    if (travelZone === 'TANA' && !availableZones.urbain && availableZones.province) {
      onTravelZoneChange('PROVINCE');
    } else if (travelZone === 'PROVINCE' && !availableZones.province && availableZones.urbain) {
      onTravelZoneChange('TANA');
    }
  }, [availableZones, travelZone, onTravelZoneChange]);

  const [dateWarning, setDateWarning] = useState('');

  // Filtrage des addons
  const filteredAddons = useMemo(() => {
    if (!addons) return [];

    // Si recherche active, on filtre par nom
    if (searchTerm.trim()) {
      return addons.filter(addon =>
        addon.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sinon on retourne les 3 premiers
    return addons.slice(0, 3);
  }, [addons, searchTerm]);

  const hasMoreAddons = addons && addons.length > 3 && !searchTerm;

  const renderAddon = (addon: ReservationAddon) => {
    const Icon = ICON_MAP[addon.iconKey] || LayoutList;
    const isSelected = selectedAddons.includes(addon.id);
    const price = addon.price || 0;

    return (
      <div
        key={addon.id}
        onClick={() => onToggleAddon(addon.id)}
        className={`group flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${isSelected
          ? 'border-primary-500 bg-primary-50/50 shadow-sm'
          : 'border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 bg-white/50'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-primary-500 group-hover:shadow-sm'
            }`}>
            <Icon size={18} strokeWidth={2.5} />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
              {addon.label}
            </span>
            {addon.description && (
              <span className="text-[10px] text-gray-500 line-clamp-1">{addon.description}</span>
            )}
          </div>
        </div>
        <Badge variant={isSelected ? "default" : "secondary"} className={`text-xs font-bold px-2 py-0.5 transition-colors ${isSelected ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-gray-100 text-gray-500'
          }`}>
          +{price.toLocaleString()} Ar
        </Badge>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-6 md:p-8 sticky top-24 transition-all duration-300">



      {/* Header Prix */}
      <div className="flex flex-col gap-2 mb-8 bg-gray-50/50 p-5 rounded-3xl border border-gray-100/50 relative overflow-hidden group/price">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Info size={40} />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 z-10">
          Total estimé
          <Popover open={showRates} onOpenChange={setShowRates}>
            <PopoverTrigger asChild>
              <button className="bg-white rounded-full p-1 text-gray-300 hover:text-primary-500 hover:shadow-sm transition-all shadow-none">
                <Info size={12} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden rounded-xl shadow-xl border-gray-100" align="end">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h4 className="font-bold text-gray-900">Détail des tarifs</h4>
              </div>
              <div className="p-4 space-y-3 text-sm">
                {pricingRates.hour && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Prix par heure</span>
                    <span className="font-bold text-gray-900">{pricingRates.hour.toLocaleString()} Ar</span>
                  </div>
                )}
                {pricingRates.day > 0 && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Prix par jour</span>
                    <span className="font-bold text-gray-900">{pricingRates.day.toLocaleString()} Ar</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-gray-500 text-xs">
                  <span>Caution</span>
                  <span className="font-bold text-gray-700">{deposit.toLocaleString()} Ar</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </span>
        <div className="flex items-baseline gap-2 z-10">
          <span className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            {totalPrice.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-gray-400">Ar</span>
        </div>

        {deposit > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50/80 backdrop-blur-sm w-fit px-2.5 py-1 rounded-full border border-emerald-100/50 z-10 mt-1">
            <ShieldCheck size={12} />
            Caution: {deposit.toLocaleString()} Ar
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Zone Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Zone de déplacement</label>
          <div className="grid grid-cols-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/50">
            <button
              onClick={() => availableZones.urbain && onTravelZoneChange('TANA')}
              disabled={!availableZones.urbain}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${!availableZones.urbain
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                : travelZone === 'TANA'
                  ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50 scale-[1.02]'
                  : 'text-gray-500 hover:bg-gray-200/50'
                }`}
            >
              Urbain (Tana)
              {!availableZones.urbain && (
                <span className="block text-[9px] mt-0.5 text-gray-400">Non disponible</span>
              )}
            </button>
            <button
              onClick={() => availableZones.province && onTravelZoneChange('PROVINCE')}
              disabled={!availableZones.province}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${!availableZones.province
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                : travelZone === 'PROVINCE'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                  : 'text-gray-500 hover:bg-gray-200/50'
                }`}
            >
              <span className="flex items-center gap-2">
                <Map size={14} /> Province
              </span>
              {!availableZones.province && (
                <span className="text-[9px] text-gray-400">Non disponible</span>
              )}
            </button>
          </div>

          {/* Info message if a zone is unavailable */}
          {(!availableZones.urbain || !availableZones.province) && (
            <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl">
              <p className="text-[10px] text-amber-700 flex items-center gap-1.5">
                <AlertCircle size={10} className="flex-shrink-0" />
                <span>
                  {!availableZones.urbain && !availableZones.province
                    ? "Aucune zone de tarification configurée pour ce véhicule"
                    : !availableZones.urbain
                      ? "Tarification urbaine non configurée"
                      : "Tarification province non configurée"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Date Time Picker - Redesigned */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Dates & Horaires</label>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100 ring-1 ring-gray-100 group focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
            {dateWarning && (
              <div className="p-3 bg-red-50 border-b border-red-100">
                <p className="text-xs text-red-600 font-medium flex items-center gap-2">
                  <AlertCircle size={12} />
                  {dateWarning}
                </p>
              </div>
            )}
            <div className="grid grid-cols-[1fr,auto] relative">
              <div className="p-3 pl-4 bg-gray-50/50 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={10} /> Début</label>
                <input
                  type="date"
                  value={pickupDate}
                  readOnly
                  disabled
                  className="bg-transparent font-bold text-gray-500 w-full outline-none text-sm cursor-not-allowed opacity-75"
                />
              </div>
              <div className="border-l border-gray-100 p-3 w-28 bg-gray-50/50 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block text-center"><Clock size={10} className="inline mr-1" />Heure</label>
                <input
                  type="time"
                  value={pickupTime}
                  readOnly
                  disabled
                  className="bg-transparent font-bold text-gray-500 w-full outline-none text-sm text-center cursor-not-allowed opacity-75"
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,auto] relative">
              <div className="p-3 pl-4 bg-gray-50/50 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={10} /> Fin</label>
                <input
                  type="date"
                  value={returnDate}
                  readOnly
                  disabled
                  className="bg-transparent font-bold text-gray-500 w-full outline-none text-sm cursor-not-allowed opacity-75"
                />
              </div>
              <div className="border-l border-gray-100 p-3 w-28 bg-gray-50/50 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block text-center"><Clock size={10} className="inline mr-1" />Heure</label>
                <input
                  type="time"
                  value={returnTime}
                  readOnly
                  disabled
                  className="bg-transparent font-bold text-gray-500 w-full outline-none text-sm text-center cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            {/* Info message */}
            <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <Info size={12} className="flex-shrink-0" />
                <span>Utilisez le calendrier ci-dessus pour sélectionner vos dates</span>
              </p>
            </div>
          </div>
        </div>

        {/* Duration Info */}
        <div className="flex justify-between items-center bg-blue-50/50 text-blue-900 px-5 py-4 rounded-xl text-xs font-bold border border-blue-100/50">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Durée: {durationLabel}
          </span>
          <Badge variant="secondary" className="bg-white shadow-sm text-blue-700 border-blue-100 hover:bg-white cursor-default">
            {rateApplied}
          </Badge>
        </div>

        {/* Driver Option */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Conducteur</label>
          <div className="grid grid-cols-2 gap-3">
            {driverOption !== DriverOption.REQUIRED && (
              <button
                onClick={() => onDriverOptionChange('SANS_CHAUFFEUR')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${selectedDriverOption === 'SANS_CHAUFFEUR'
                  ? 'border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="font-bold text-sm mb-1 z-10 relative">Je conduis</div>
                <div className={`text-[10px] z-10 relative ${selectedDriverOption === 'SANS_CHAUFFEUR' ? 'text-gray-300' : 'text-gray-400'}`}>
                  Carburant non inclus
                </div>
                {selectedDriverOption === 'SANS_CHAUFFEUR' && <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>}
              </button>
            )}

            <button
              onClick={() => onDriverOptionChange('AVEC_CHAUFFEUR')}
              disabled={driverOption === DriverOption.REQUIRED}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${selectedDriverOption === 'AVEC_CHAUFFEUR' || driverOption === DriverOption.REQUIRED
                ? 'border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="font-bold text-sm mb-1 relative z-10">Avec Chauffeur</div>
              <div className={`text-[10px] relative z-10 ${selectedDriverOption === 'AVEC_CHAUFFEUR' || driverOption === DriverOption.REQUIRED ? 'text-primary-100' : 'text-gray-400'
                }`}>
                (recommandé)
              </div>
              {(selectedDriverOption === 'AVEC_CHAUFFEUR' || driverOption === DriverOption.REQUIRED) && <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none"></div>}
            </button>
          </div>

          {selectedDriverOption === 'AVEC_CHAUFFEUR' && (
            <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Chauffeur assigné
              </p>

              {vehicle.driver_data ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-primary-100 shadow-sm">
                  <div className="relative">
                    <img
                      src={vehicle.driver_data.profile_photo || `https://ui-avatars.com/api/?name=${vehicle.driver_data.first_name}+${vehicle.driver_data.last_name}`}
                      alt={`${vehicle.driver_data.first_name} ${vehicle.driver_data.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 bg-gray-100"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {vehicle.driver_data.first_name} {vehicle.driver_data.last_name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {vehicle.driver_data.experience_years || 2} ans d'expérience
                    </p>
                    {vehicle.driver_data.phone_number && (
                      <p className="text-[10px] text-primary-600 font-medium mt-0.5">
                        📞 {vehicle.driver_data.phone_number}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 text-center flex flex-col items-center gap-2">
                    <Info size={16} className="text-gray-300" />
                    <span>Aucun chauffeur assigné à ce véhicule</span>
                    <span className="text-[10px] text-gray-400">Un chauffeur sera attribué lors de la confirmation</span>
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Options Extras with Search */}
      <div className="space-y-3 mt-8">
        <div className="flex justify-between items-end mb-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Options supplémentaires</label>
          {selectedAddons.length > 0 && (
            <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {selectedAddons.length} ajoutées
            </span>
          )}
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Rechercher une option (ex: Siège bébé...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block w-full p-3 pl-10 outline-none transition-all focus:bg-white focus:shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LayoutList className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {isLoadingAddons ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : filteredAddons.length > 0 ? (
            <>
              {filteredAddons.map((addon) => renderAddon(addon))}
              {!searchTerm && hasMoreAddons && (
                <div
                  onClick={() => document.querySelector('input')?.focus()}
                  className="text-center text-xs text-gray-400 hover:text-primary-600 cursor-pointer py-2 transition-colors flex items-center justify-center gap-1 group"
                >
                  <span className="group-hover:underline">+ {addons.length - 3} autres options disponibles.</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-gray-400 text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="flex justify-center mb-2"><Info size={16} /></div>
              Aucune option correspondante
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-xs font-medium text-gray-500">
          <span>Location ({durationLabel})</span>
          <span className="text-gray-900">{basePrice.toLocaleString()} Ar</span>
        </div>
        {driverFee > 0 && (
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Chauffeur</span>
            <span className="text-gray-900">{driverFee.toLocaleString()} Ar</span>
          </div>
        )}
        {totalAddOns > 0 && (
          <div className="flex justify-between text-xs font-medium text-primary-600 bg-primary-50 p-2 rounded-lg border border-primary-100">
            <span>Options sélectionnées ({selectedAddons.length})</span>
            <span className="font-bold">+{totalAddOns.toLocaleString()} Ar</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-medium text-gray-500">
          <span>Frais de service & assurance</span>
          <span className="text-gray-900">{serviceFee.toLocaleString()} Ar</span>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={desableReservation || basePrice <= 0 || isLoading}
        className="w-full h-14 bg-gray-900 text-white font-bold rounded-2xl mt-6 hover:bg-black transition-all duration-300 shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center gap-3">
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              Réserver maintenant <ArrowRight size={20} />
            </>
          )}
        </span>
      </Button>

      <p className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1.5">
        <ShieldCheck size={10} className="text-green-500" />
        Annulation gratuite jusqu'à 24h avant le départ
      </p>
    </div>
  );
};

export default BookingSidebar;
