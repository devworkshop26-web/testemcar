import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BookingSidebar from './components/BookingSidebar';
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import VehicleGallery from './components/VehicleGallery';
import VehicleHeader from './components/VehicleHeader';
import { ArrowLeft, CalendarIcon, Clock, Info, MessageSquare, AlertCircle, Lock, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { addDays, startOfToday, format } from "date-fns";
import { fr } from "date-fns/locale";

import ReviewsSection from './components/ReviewsSection';
import VehicleInfoSection from './components/VehicleInfoSection';
import PricingGridSection from './components/PricingGridSection';
import {
  DriverOption,
  type ChauffeurChoice,
  type PricingRates,
  type ReservationAddon,
  type ReservationVehicle,
  type TravelZone
} from './reservationTypes';
import { useVehiculeQuery } from '@/useQuery/vehiculeUseQuery';
import { useAllVehicleEquipmentsQuery } from '@/useQuery/vehicleEquipmentsUseQuery';
import { useCreateReservationMutation } from '@/useQuery/reservationsUseQuery';
import { useCurentuser } from '@/useQuery/authUseQuery';
import { toast } from 'sonner';
import { CreateReservationPayload } from '@/types/reservationsType';
import Header from '@/components/Header';
import { useCurrentUserQuery } from '@/useQuery/useCurrentUserQuery';

const ReservationsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vehicleData, isLoading } = useVehiculeQuery(id);

  const { isAuthenticated, data: currentUser } = useCurrentUserQuery();




  // Mutation and User
  const createReservationMutation = useCreateReservationMutation();

  const [selectedDriverOption, setSelectedDriverOption] = useState<ChauffeurChoice>('SANS_CHAUFFEUR');
  const [travelZone, setTravelZone] = useState<TravelZone>('TANA');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);

  const [pickupDate, setPickupDate] = useState(format(tomorrow, 'yyyy-MM-dd'));
  const [pickupTime, setPickupTime] = useState('08:00');
  const [returnDate, setReturnDate] = useState(format(dayAfter, 'yyyy-MM-dd'));
  const [returnTime, setReturnTime] = useState('18:00');
  const [desableReservation, setDesableReservation] = useState(false);

  

  // Date Range state for the DateSelector component
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: tomorrow,
    to: dayAfter
  });

  // verification authentication

  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      if (currentUser && currentUser.role !== "CLIENT") {
        setDesableReservation(true);
        toast.error("Vous n'avez pas la permission d'effectuer une réservation.");
        return;
      }

    };
  }, []);



  // Sync DateSelector change to string format
  useEffect(() => {
    if (dateRange.from) {
      setPickupDate(format(dateRange.from, 'yyyy-MM-dd'));
    }
    if (dateRange.to) {
      setReturnDate(format(dateRange.to, 'yyyy-MM-dd'));
    }
  }, [dateRange]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]));
  };

  const vehicle = useMemo<ReservationVehicle | null>(() => {
    if (!vehicleData) return null;

    const asReservation = vehicleData as ReservationVehicle;
    const image =
      asReservation.image || vehicleData.photos?.find((photo) => photo.is_primary)?.image || vehicleData.photos?.[0]?.image;
    const title = asReservation.title || vehicleData.titre;
    const location = asReservation.location || vehicleData.ville || vehicleData.zone;
    const ownerName = asReservation.ownerName || vehicleData.proprietaire_data?.first_name || vehicleData.proprietaire;
    const rating = asReservation.rating ?? (vehicleData.note_moyenne ? Number(vehicleData.note_moyenne) : undefined);
    const trips = asReservation.trips ?? vehicleData.nombre_locations;
    const features =
      asReservation.features || vehicleData.equipements_details?.map((equipment) => equipment.label) || vehicleData.equipements || [];
    const pricePerDay = Number(asReservation.pricePerDay ?? vehicleData.prix_jour ?? 0) || 0;

    return {
      ...vehicleData,
      ...asReservation,
      image,
      title,
      location,
      ownerName,
      rating,
      trips,
      features,
      pricePerDay,
      categoryLabel: vehicleData.categorie_data?.nom || vehicleData.categorie || 'Non spécifié',
      transmissionLabel: vehicleData.transmission_data?.nom || vehicleData.transmission || 'Manuelle',
      fuelLabel: vehicleData.type_carburant_data?.nom || vehicleData.type_carburant || 'Essence',
      year: vehicleData.annee,
      seatCount: vehicleData.nombre_places,
      doorCount: vehicleData.nombre_portes,
      color: vehicleData.couleur || undefined,
      bootVolume: vehicleData.volume_coffre_litres || undefined,
      currentMileage: vehicleData.kilometrage_actuel_km || undefined,
      licensePlate: vehicleData.numero_immatriculation || undefined
    };
  }, [vehicleData]);

  const pricingRates: PricingRates = useMemo(() => {
    if (!vehicle) {
      return { day: 0 };
    }

    const baseDayPrice = Number(vehicle.pricePerDay ?? 0) || 0;
    const rates: Partial<PricingRates> = vehicle.pricingRates || {};
    const pricingGrid = vehicle.pricing_grid || [];
    const provinceRate = pricingGrid.find(p => p.zone_type === 'PROVINCE');

    const provinceDayPrice = provinceRate?.prix_jour
      ? Number(provinceRate.prix_jour)
      : (vehicle.province_prix_jour ? Number(vehicle.province_prix_jour) : baseDayPrice);

    const urbanRate = pricingGrid.find(p => p.zone_type === 'URBAIN');
    const hourlyPrice = urbanRate?.prix_heure ? Number(urbanRate.prix_heure) : Number(vehicle.prix_heure ?? 0);
    const weeklyPrice = urbanRate?.prix_par_semaine ? Number(urbanRate.prix_par_semaine) : Number(vehicle.prix_par_semaine ?? 0);
    const monthlyPrice = urbanRate?.prix_mois ? Number(urbanRate.prix_mois) : Number(vehicle.prix_mois ?? 0);

    return {
      hour: hourlyPrice > 0 ? hourlyPrice : undefined,
      halfDay: rates.halfDay ?? Math.max(Math.round(baseDayPrice / 2), 0),
      day: rates.day ?? baseDayPrice,
      twentyFourHours: rates.twentyFourHours ?? baseDayPrice,
      week: weeklyPrice > 0 ? weeklyPrice : undefined,
      month: monthlyPrice > 0 ? monthlyPrice : undefined,
      provinceDay: rates.provinceDay ?? provinceDayPrice,
      weeklyDiscount: rates.weeklyDiscount ?? (vehicle.remise_longue_duree_pourcent ? Number(vehicle.remise_longue_duree_pourcent) : 0),
      monthlyDiscount: rates.monthlyDiscount ?? (vehicle.remise_longue_duree_pourcent ? Number(vehicle.remise_longue_duree_pourcent) : 0)
    };
  }, [vehicle]);

  const driverOption = vehicle?.driverOption ?? DriverOption.OPTIONAL;

  useEffect(() => {
    if (!vehicle) return;

    if (driverOption === DriverOption.REQUIRED) {
      setSelectedDriverOption('AVEC_CHAUFFEUR');
    } else if (driverOption === DriverOption.NONE) {
      setSelectedDriverOption('SANS_CHAUFFEUR');
    }
  }, [vehicle, driverOption]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { price: basePrice, durationLabel, rateApplied, durationDays } = useMemo(() => {
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (!Number.isFinite(diffHours) || diffHours <= 0) {
      return { price: 0, durationLabel: 'Dates invalides', rateApplied: '-', durationDays: 0 };
    }

    const isSameDay = pickupDate === returnDate;
    let price = 0;
    let label = '';
    let appliedRate = '';

    if (travelZone === 'PROVINCE' && pricingRates.provinceDay) {
      const days = Math.max(1, Math.ceil(diffHours / 24));
      price = days * pricingRates.provinceDay;
      label = `${days} Jours (Province)`;
      appliedRate = 'Tarif Province';
    } else if (diffHours <= 5 && pricingRates.halfDay) {
      price = pricingRates.halfDay;
      label = 'Demi-journée';
      appliedRate = 'Tarif réduit (4h)';
    } else if (diffHours <= 14 && isSameDay) {
      price = pricingRates.day;
      label = '1 Journée';
      appliedRate = 'Tarif Journée';
    } else {
      const days24h = Math.ceil(diffHours / 24);
      const unitPrice = pricingRates.twentyFourHours ?? pricingRates.day;
      let discount = 0;

      if (days24h >= 30) {
        discount = pricingRates.monthlyDiscount ?? 0;
        appliedRate = `Mensuel (-${discount}%)`;
      } else if (days24h >= 7) {
        discount = pricingRates.weeklyDiscount ?? 0;
        appliedRate = `Hebdo (-${discount}%)`;
      } else {
        appliedRate = 'Tarif 24h';
      }

      price = days24h * unitPrice * (1 - discount / 100);
      label = `${days24h} Jours`;
    }

    return { price, durationLabel: label, rateApplied: appliedRate, durationDays: Math.max(1, Math.ceil(diffHours / 24)) };
  }, [pickupDate, pickupTime, returnDate, returnTime, travelZone, pricingRates]);

  // Check if a date is unavailable based on vehicle availability periods
  const isDateUnavailable = useMemo(() => {
    const unavailablePeriods = vehicle?.availabilities?.filter(
      (avail) => avail.type === 'BLOCKED' || avail.type === 'RESERVED' || avail.type === 'MAINTENANCE'
    ) || [];

    return (date: Date) => {
      // Disable past dates
      if (date < today) return true;

      // Check if date falls within any unavailable period
      return unavailablePeriods.some((period) => {
        const start = new Date(period.start_date);
        const end = new Date(period.end_date);
        // Set time to start of day for accurate comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        const checkDate = new Date(date);
        checkDate.setHours(12, 0, 0, 0);
        return checkDate >= start && checkDate <= end;
      });
    };
  }, [vehicle?.availabilities, today]);

  // Get the availability type for a specific date (for styling)
  const getAvailabilityType = useMemo(() => {
    const availabilities = vehicle?.availabilities || [];

    return (date: Date) => {
      for (const period of availabilities) {
        const start = new Date(period.start_date);
        const end = new Date(period.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        const checkDate = new Date(date);
        checkDate.setHours(12, 0, 0, 0);

        if (checkDate >= start && checkDate <= end) {
          return period.type;
        }
      }
      return null;
    };
  }, [vehicle?.availabilities]);

  // Create modifiers for different availability types
  const calendarModifiers = useMemo(() => {
    const blocked: Date[] = [];
    const reserved: Date[] = [];
    const maintenance: Date[] = [];

    vehicle?.availabilities?.forEach((avail) => {
      const start = new Date(avail.start_date);
      const end = new Date(avail.end_date);

      // Generate all dates in the range
      const current = new Date(start);
      while (current <= end) {
        const dateToAdd = new Date(current);

        if (avail.type === 'BLOCKED') {
          blocked.push(dateToAdd);
        } else if (avail.type === 'RESERVED') {
          reserved.push(dateToAdd);
        } else if (avail.type === 'MAINTENANCE') {
          maintenance.push(dateToAdd);
        }

        current.setDate(current.getDate() + 1);
      }
    });

    return { blocked, reserved, maintenance };
  }, [vehicle?.availabilities]);

  // Get availability summary
  const availabilitySummary = useMemo(() => {
    const blocked = vehicle?.availabilities?.filter(a => a.type === 'BLOCKED').length || 0;
    const reserved = vehicle?.availabilities?.filter(a => a.type === 'RESERVED').length || 0;
    const maintenance = vehicle?.availabilities?.filter(a => a.type === 'MAINTENANCE').length || 0;
    return { blocked, reserved, maintenance, total: blocked + reserved + maintenance };
  }, [vehicle?.availabilities]);

  const { data: equipmentsData, isLoading: isLoadingEquipments } = useAllVehicleEquipmentsQuery();

  const addonsList = useMemo<ReservationAddon[]>(() => {
    if (!equipmentsData) return [];
    return equipmentsData.map((eq) => ({
      id: eq.id,
      label: eq.label,
      price: Number(eq.price) || 0,
      description: eq.description,
      iconKey: (eq.code as any) || 'LayoutList'
    }));
  }, [equipmentsData]);

  const driverFee = selectedDriverOption === 'AVEC_CHAUFFEUR' ? 40000 * durationDays : 0;

  const totalAddOns = useMemo(
    () => addonsList
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + (a.price || 0) * durationDays, 0),
    [selectedAddons, durationDays, addonsList]
  );

  const serviceFee = 5000;
  const totalPrice = basePrice + driverFee + totalAddOns + serviceFee;

  // Handlers for reservation creation
  const handleReservationSubmit = () => {
    if (!currentUser) {
      toast.error("Veuillez vous connecter pour effectuer une réservation.");
      return;
    }

    if (!vehicle) {
      toast.error("Véhicule non trouvé.");
      return;
    }

    // Calcul des dates
    const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const endDateTime = new Date(`${returnDate}T${returnTime}`);

    // Validate dates
    if (endDateTime <= startDateTime) {
      toast.error("La date de retour doit être après la date de départ.");
      return;
    }

    // Check if any date in the selected range falls within an unavailable period
    const checkDateRange = (start: Date, end: Date) => {
      const unavailablePeriods = vehicle?.availabilities?.filter(
        (avail) => avail.type === 'BLOCKED' || avail.type === 'RESERVED' || avail.type === 'MAINTENANCE'
      ) || [];

      for (const period of unavailablePeriods) {
        const periodStart = new Date(period.start_date);
        const periodEnd = new Date(period.end_date);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd.setHours(23, 59, 59, 999);

        // Check if there's any overlap between selected range and unavailable period
        if (start <= periodEnd && end >= periodStart) {
          return {
            isUnavailable: true,
            type: period.type,
            periodStart: periodStart.toLocaleDateString('fr-FR'),
            periodEnd: periodEnd.toLocaleDateString('fr-FR')
          };
        }
      }
      return { isUnavailable: false };
    };

    const availabilityCheck = checkDateRange(startDateTime, endDateTime);
    if (availabilityCheck.isUnavailable) {
      const typeMessages = {
        BLOCKED: 'bloquée par le propriétaire',
        RESERVED: 'déjà réservée',
        MAINTENANCE: 'en maintenance'
      };
      const typeMessage = typeMessages[availabilityCheck.type as keyof typeof typeMessages] || 'indisponible';
      toast.error(
        `Impossible de réserver : Le véhicule est ${typeMessage} du ${availabilityCheck.periodStart} au ${availabilityCheck.periodEnd}. Veuillez sélectionner d'autres dates.`,
        { duration: 6000 }
      );
      return;
    }

    // Calcul du nombre de jours
    const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Construction du payload
    const payload: CreateReservationPayload = {
      client: currentUser.id,
      vehicle: vehicle.id,
      start_datetime: startDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      total_days: diffDays > 0 ? diffDays : 1,
      base_amount: basePrice.toString(),
      options_amount: totalAddOns.toString(),
      total_amount: totalPrice.toString(),
      caution_amount: vehicle.montant_caution || "0",
      status: "PENDING",
      with_chauffeur: driverOption === DriverOption.REQUIRED || selectedDriverOption === 'AVEC_CHAUFFEUR',
      pickup_location: vehicle.adresse_localisation || "À définir",
      dropoff_location: vehicle.adresse_localisation || "À définir",
      driving_mode: (driverOption === DriverOption.REQUIRED || selectedDriverOption === 'AVEC_CHAUFFEUR') ? "WITH_DRIVER" : "SELF_DRIVE",
      pricing_zone: travelZone === 'TANA' ? 'URBAIN' : 'PROVINCE',
      equipments: selectedAddons,
    };

    createReservationMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success("Réservation créée avec succès !");
        navigate(`/reservation-payment/${data.id}`);
      },
      onError: (error: any) => {
        console.error("Erreur création réservation:", error);
        let errorMessage = "Erreur lors de la création de la réservation.";
        if (error?.response?.data) {
          const errorData = error.response.data;
          if (errorData.detail) errorMessage = errorData.detail;
          else if (errorData.error) errorMessage = errorData.error;
          else if (typeof errorData === 'string') errorMessage = errorData;
        }
        toast.error(errorMessage);
      }
    });
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-gray-900">Identifiant véhicule manquant</h2>
        <Button variant="link" onClick={() => navigate('/search')} className="mt-4">
          Retour aux résultats
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-semibold">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-gray-900">Véhicule introuvable</h2>
        <Button variant="link" onClick={() => navigate('/search')} className="mt-4">
          Retour aux résultats
        </Button>
      </div>
    );
  }

  const coverImage = vehicle.image || 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=60';
  const vehicleTitle = vehicle.title || 'Véhicule';
  const vehicleLocation = vehicle.location || 'Madagascar';
  const vehicleRating = vehicle.rating ?? 4.8;
  const vehicleTrips = vehicle.trips ?? 0;
  const vehicleType = vehicle.type || vehicle.type_vehicule || 'Véhicule';
  const isCertified = vehicle.isCertified ?? vehicle.est_certifie ?? false;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      <Header />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/allcars')} className="pl-0 hover:bg-transparent text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour aux résultats finale
          </Button>
        </div>

        <VehicleHeader
          vehicleTitle={vehicleTitle}
          vehicleLocation={vehicleLocation}
          vehicleRating={vehicleRating}
          vehicleTrips={vehicleTrips}
          vehicleType={vehicleType}
          isCertified={isCertified}
          pricingRates={pricingRates}
          onBack={() => navigate('/search')}
        />

        <VehicleGallery photos={vehicle.photos || [{ image: coverImage, is_primary: true }]} />

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mt-12">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            <Tabs defaultValue="availability" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 rounded-2xl h-14">
                <TabsTrigger value="availability" className="rounded-xl h-12 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary-700 transition-all">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Disponibilités
                </TabsTrigger>
                <TabsTrigger value="info" className="rounded-xl h-12 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary-700 transition-all">
                  <Info className="w-4 h-4 mr-2" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl h-12 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary-700 transition-all">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Avis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="availability" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    Sélectionnez vos dates
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 ml-8">Vérifiez la disponibilité du véhicule et choisissez votre période.</p>

                  {/* Availability Summary */}
                  {availabilitySummary.total > 0 && (
                    <div className="mb-6 ml-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Périodes indisponibles détectées
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-blue-700">
                            {availabilitySummary.blocked > 0 && (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {availabilitySummary.blocked} période{availabilitySummary.blocked > 1 ? 's' : ''} bloquée{availabilitySummary.blocked > 1 ? 's' : ''}
                              </span>
                            )}
                            {availabilitySummary.reserved > 0 && (
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {availabilitySummary.reserved} réservation{availabilitySummary.reserved > 1 ? 's' : ''}
                              </span>
                            )}
                            {availabilitySummary.maintenance > 0 && (
                              <span className="flex items-center gap-1">
                                <Wrench className="w-3 h-3" />
                                {availabilitySummary.maintenance} maintenance{availabilitySummary.maintenance > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center bg-slate-50/50 rounded-3xl p-8 border border-slate-100 overflow-hidden">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range ? { from: range.from, to: range.to } : { from: undefined, to: undefined })}
                      disabled={isDateUnavailable}
                      modifiers={calendarModifiers}
                      modifiersClassNames={{
                        blocked: "bg-red-100 text-red-700 hover:bg-red-200 border-red-300 font-semibold",
                        reserved: "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300 font-semibold",
                        maintenance: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300 font-semibold",
                      }}
                      numberOfMonths={2}
                      className="p-0 w-full max-w-4xl"
                      classNames={{
                        months: "flex flex-col md:flex-row gap-12 space-y-8 md:space-y-0 w-full justify-center",
                        month: "space-y-6 w-full max-w-sm",
                        caption: "flex justify-center pt-1 relative items-center mb-6",
                        caption_label: "text-xl font-bold text-gray-800 capitalize",
                        nav: "space-x-2 flex items-center bg-white rounded-full shadow-sm border border-gray-100 p-1.5 absolute right-0 top-0",
                        nav_button: "h-8 w-8 bg-transparent p-0 text-gray-500 opacity-70 hover:opacity-100 hover:bg-gray-50 rounded-full transition-all",
                        nav_button_previous: "static",
                        nav_button_next: "static",
                        table: "w-full border-collapse space-y-2",
                        head_row: "flex mb-4",
                        head_cell: "text-gray-400 rounded-md w-full font-semibold text-sm uppercase tracking-wide",
                        row: "flex w-full mt-2 gap-1",
                        cell: "h-14 w-full text-center text-sm p-0 m-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
                        day: "h-14 w-full p-0 font-medium text-base aria-selected:opacity-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all border border-transparent",
                        day_selected: "bg-primary text-white hover:bg-primary hover:text-white shadow-lg shadow-primary/30 font-bold border-primary",
                        day_today: "bg-white text-primary font-bold border-2 border-primary/20",
                        day_outside: "text-gray-300 opacity-30",
                        day_disabled: "opacity-50 cursor-not-allowed",
                        day_range_middle: "aria-selected:bg-primary/5 aria-selected:text-primary-700 rounded-none my-0",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>

                  {/* Legend for calendar */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Légende du calendrier
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-primary rounded shadow-sm" />
                        <span className="text-gray-700 font-medium">Sélectionné</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white border-2 border-primary/30 rounded shadow-sm" />
                        <span className="text-gray-700 font-medium">Aujourd'hui</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 border border-red-300 rounded shadow-sm flex items-center justify-center">
                          <Lock className="w-3 h-3 text-red-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Bloqué</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-100 border border-orange-300 rounded shadow-sm flex items-center justify-center">
                          <CalendarIcon className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Réservé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-yellow-100 border border-yellow-300 rounded shadow-sm flex items-center justify-center">
                          <Wrench className="w-3 h-3 text-yellow-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Maintenance</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Heure de départ
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full h-14 rounded-xl border-2 border-gray-100 px-4 font-bold text-gray-700 focus:border-primary focus:ring-0 transition-colors bg-gray-50/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Heure de retour
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full h-14 rounded-xl border-2 border-gray-100 px-4 font-bold text-gray-700 focus:border-primary focus:ring-0 transition-colors bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="info" className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <VehicleInfoSection vehicle={vehicle} vehicleTitle={vehicleTitle} vehicleLocation={vehicleLocation} />
                <PricingGridSection
                  pricingGrid={vehicle.pricing_grid || []}
                  weeklyDiscount={pricingRates.weeklyDiscount}
                  monthlyDiscount={pricingRates.monthlyDiscount}
                />
              </TabsContent>

              <TabsContent value="reviews" className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <ReviewsSection
                  vehicleId={vehicle.id}
                  ownerId={vehicle.proprietaire_data?.id}
                  ownerName={vehicle.ownerName}
                  rating={Number(vehicle.rating ?? 5)}
                  totalReviews={Number(vehicle.trips ?? 0)}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3 relative z-30">
            <BookingSidebar
              vehicle={vehicle}
              durationLabel={durationLabel}
              basePrice={basePrice}
              totalPrice={totalPrice}
              pricingRates={pricingRates}
              addons={addonsList}
              selectedAddons={selectedAddons}
              driverOption={driverOption}
              selectedDriverOption={selectedDriverOption}
              isLoadingAddons={isLoadingEquipments}
              isLoading={createReservationMutation.isPending}
              availabilities={vehicle.availabilities || []}
                      desableReservation={desableReservation}
              // Missing props
              deposit={vehicle.montant_caution ? Number(vehicle.montant_caution) : (pricingRates.day ?? 0) * 10}
              travelZone={travelZone}
              pickupDate={pickupDate}
              returnDate={returnDate}
              pickupTime={pickupTime}
              returnTime={returnTime}
              rateApplied={rateApplied || '-'}
              driverFee={driverFee}
              totalAddOns={totalAddOns}
              serviceFee={serviceFee}

              // Handlers
              onTravelZoneChange={setTravelZone}
              onDriverOptionChange={setSelectedDriverOption}
              onToggleAddon={toggleAddon}
              onSubmit={handleReservationSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
