import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { vehiculeAPI, VehicleConditionPoint, VehicleView } from "@/Actions/vehiculeApi";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useReservationClientQuery } from "@/useQuery/clientUseQuery";
import {
  Car,
  ImagePlus,
  Info,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Vehicule } from "@/types/vehiculeType";

type DamagePoint = VehicleConditionPoint;

const viewLabels: Record<VehicleView, string> = {
  left: "Vue gauche",
  right: "Vue droite",
  front: "Vue avant",
  rear: "Vue arrière",
  top: "Vue dessus",
  bottom: "Vue dessous",
  "interior-front": "Intérieur avant",
  "interior-rear": "Intérieur arrière",
};

const levelLabels: Record<DamagePoint["level"], string> = {
  léger: "Léger",
  moyen: "Moyen",
  important: "Important",
};

const pointLevelClasses: Record<DamagePoint["level"], string> = {
  léger: "bg-emerald-500 border-emerald-300",
  moyen: "bg-amber-500 border-amber-300",
  important: "bg-rose-500 border-rose-300",
};

const pointLevelChipClasses: Record<DamagePoint["level"], string> = {
  léger: "border-emerald-200 bg-emerald-50 text-emerald-700",
  moyen: "border-amber-200 bg-amber-50 text-amber-700",
  important: "border-rose-200 bg-rose-50 text-rose-700",
};

const levelOptions: DamagePoint["level"][] = ["léger", "moyen", "important"];

const getPointLevelColor = (level: DamagePoint["level"]) => pointLevelClasses[level];


type VehicleProfile = "car" | "van" | "truck" | "bus";
type VehicleProfileMode = "auto" | VehicleProfile;

const inferVehicleProfile = (vehicle?: Vehicule): VehicleProfile => {
  if (!vehicle) return "car";

  const signal = [
    vehicle.type_vehicule,
    vehicle.titre,
    vehicle.modele_data?.label,
    vehicle.categorie_data?.nom,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (signal.includes("bus") || signal.includes("minibus") || signal.includes("coaster")) return "bus";
  if (signal.includes("camion") || signal.includes("truck") || signal.includes("plateau") || signal.includes("benne")) return "truck";
  if (signal.includes("fourgon") || signal.includes("van") || signal.includes("utilitaire")) return "van";

  return "car";
};

const vehicleProfileLabels: Record<VehicleProfile, string> = {
  car: "Berline / SUV",
  van: "Fourgon / Utilitaire",
  truck: "Camion",
  bus: "Bus / Minibus",
};


const vehicleProfileModeLabels: Record<VehicleProfileMode, string> = {
  auto: "Auto",
  car: "Berline / SUV",
  van: "Fourgon / Utilitaire",
  truck: "Camion",
  bus: "Bus / Minibus",
};

const CarSideViewOutline = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg viewBox="0 0 460 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <path d="M36 124l10-26 39-24 66-14h170l58 10 34 24 11 30v16H36z" strokeWidth="2.6" />
      <path d="M118 79l30-28h142l40 28" strokeWidth="2.2" className="opacity-95" />
      <path d="M152 79h158v45H132z" strokeWidth="1.8" className="opacity-85" />
      <path d="M186 79v45M242 79v45" strokeWidth="1.5" className="opacity-75" />
      <path d="M84 121h46M338 121h50" strokeWidth="1.6" className="opacity-80" />
      <path d="M52 131h356" strokeWidth="1.4" className="opacity-50" />
      <circle cx="124" cy="140" r="32" strokeWidth="2.6" />
      <circle cx="124" cy="140" r="18" strokeWidth="1.8" className="opacity-80" />
      <circle cx="344" cy="140" r="32" strokeWidth="2.6" />
      <circle cx="344" cy="140" r="18" strokeWidth="1.8" className="opacity-80" />
      <path d="M64 109h24M396 109h24" strokeWidth="1.5" className="opacity-65" />
    </g>
  </svg>
);

const VanSideViewOutline = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg viewBox="0 0 460 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <path d="M48 130V96l26-24 56-12h194l38 10 34 24v36H48z" strokeWidth="2.6" />
      <path d="M100 60v-18h122l28 18" strokeWidth="2" className="opacity-90" />
      <path d="M116 84h230" strokeWidth="1.6" className="opacity-75" />
      <path d="M116 102h250" strokeWidth="1.6" className="opacity-75" />
      <path d="M158 60v70M214 60v70M270 60v70M326 60v70" strokeWidth="1.5" className="opacity-70" />
      <rect x="332" y="83" width="36" height="47" rx="4" strokeWidth="1.6" className="opacity-75" />
      <path d="M72 122h36" strokeWidth="1.4" className="opacity-65" />
      <circle cx="136" cy="141" r="29" strokeWidth="2.6" />
      <circle cx="136" cy="141" r="16" strokeWidth="1.8" className="opacity-80" />
      <circle cx="334" cy="141" r="29" strokeWidth="2.6" />
      <circle cx="334" cy="141" r="16" strokeWidth="1.8" className="opacity-80" />
    </g>
  </svg>
);

const TruckSideViewOutline = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg viewBox="0 0 460 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <rect x="34" y="84" width="224" height="58" rx="8" strokeWidth="2.6" />
      <path d="M258 90h84l44 36v16h-128z" strokeWidth="2.6" />
      <path d="M270 96h54l16 14h-70z" strokeWidth="1.8" className="opacity-80" />
      <path d="M66 103h160M66 121h160" strokeWidth="1.6" className="opacity-75" />
      <path d="M98 84v58M132 84v58M166 84v58M200 84v58" strokeWidth="1.4" className="opacity-65" />
      <path d="M226 142h162" strokeWidth="1.4" className="opacity-55" />
      <circle cx="102" cy="146" r="26" strokeWidth="2.5" />
      <circle cx="102" cy="146" r="14" strokeWidth="1.7" className="opacity-80" />
      <circle cx="236" cy="146" r="26" strokeWidth="2.5" />
      <circle cx="236" cy="146" r="14" strokeWidth="1.7" className="opacity-80" />
      <circle cx="350" cy="146" r="26" strokeWidth="2.5" />
      <circle cx="350" cy="146" r="14" strokeWidth="1.7" className="opacity-80" />
    </g>
  </svg>
);

const BusSideViewOutline = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg viewBox="0 0 460 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <path d="M26 72c0-12 10-22 22-22h348c12 0 22 10 22 22v70H26z" strokeWidth="2.6" />
      <path d="M26 142h392" strokeWidth="2.2" />
      <path d="M60 84h262M60 103h262" strokeWidth="1.5" className="opacity-75" />
      <path d="M76 50v92M116 50v92M156 50v92M196 50v92M236 50v92M276 50v92M316 50v92" strokeWidth="1.5" className="opacity-72" />
      <path d="M336 78h68v52h-68z" strokeWidth="1.8" className="opacity-80" />
      <path d="M346 122h46" strokeWidth="1.4" className="opacity-65" />
      <circle cx="114" cy="146" r="25" strokeWidth="2.5" />
      <circle cx="114" cy="146" r="14" strokeWidth="1.7" className="opacity-80" />
      <circle cx="346" cy="146" r="25" strokeWidth="2.5" />
      <circle cx="346" cy="146" r="14" strokeWidth="1.7" className="opacity-80" />
    </g>
  </svg>
);

const FrontViewOutline = () => (
  <svg viewBox="0 0 250 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 140v-48l16-27 31-18h92l31 18 16 27v48z" strokeWidth="2.6" />
    <path d="M58 84h134M48 102h154" strokeWidth="1.8" className="opacity-80" />
    <path d="M77 68l-24 20M173 68l24 20" strokeWidth="1.8" className="opacity-90" />
    <rect x="98" y="108" width="54" height="14" rx="6" strokeWidth="1.7" className="opacity-80" />
    <circle cx="68" cy="145" r="13" strokeWidth="2.5" />
    <circle cx="182" cy="145" r="13" strokeWidth="2.5" />
    <path d="M58 132h32M160 132h32" strokeWidth="1.6" className="opacity-70" />
  </svg>
);

const RearViewOutline = () => (
  <svg viewBox="0 0 250 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 140v-45l13-26 35-21h90l35 21 13 26v45z" strokeWidth="2.6" />
    <path d="M56 98h138M54 116h142" strokeWidth="1.8" className="opacity-85" />
    <rect x="95" y="74" width="60" height="20" rx="7" strokeWidth="1.8" className="opacity-90" />
    <path d="M74 77l24 17M176 77l-24 17" strokeWidth="1.7" className="opacity-80" />
    <circle cx="68" cy="145" r="13" strokeWidth="2.5" />
    <circle cx="182" cy="145" r="13" strokeWidth="2.5" />
  </svg>
);

const TopViewOutline = () => (
  <svg viewBox="0 0 380 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 96c0-46 38-78 164-78s164 32 164 78-38 78-164 78S26 142 26 96z" strokeWidth="2.6" />
    <rect x="110" y="52" width="160" height="88" rx="28" strokeWidth="2.1" />
    <path d="M136 52v88M244 52v88" strokeWidth="1.7" className="opacity-80" />
    <path d="M30 70h48M350 70h-48M30 122h48M350 122h-48" strokeWidth="1.5" className="opacity-70" />
  </svg>
);

const BottomViewOutline = () => (
  <svg viewBox="0 0 380 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 96c0-46 38-78 164-78s164 32 164 78-38 78-164 78S26 142 26 96z" strokeWidth="2.6" />
    <rect x="126" y="54" width="128" height="80" rx="20" strokeWidth="2" />
    <path d="M190 54v80M126 94h128" strokeWidth="1.6" className="opacity-75" />
    <circle cx="78" cy="64" r="13" strokeWidth="2" />
    <circle cx="302" cy="64" r="13" strokeWidth="2" />
    <circle cx="78" cy="128" r="13" strokeWidth="2" />
    <circle cx="302" cy="128" r="13" strokeWidth="2" />
    <path d="M142 72h96M142 118h96" strokeWidth="1.5" className="opacity-70" />
  </svg>
);


const InteriorFrontOutline = () => (
  <svg viewBox="0 0 420 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="28" y="28" width="364" height="134" rx="22" strokeWidth="2.3" />
    <rect x="82" y="54" width="92" height="74" rx="14" strokeWidth="2" />
    <rect x="246" y="54" width="92" height="74" rx="14" strokeWidth="2" />
    <circle cx="210" cy="74" r="22" strokeWidth="2.2" />
    <path d="M210 52v44M188 74h44" strokeWidth="1.5" className="opacity-75" />
    <path d="M42 118h336" strokeWidth="1.6" className="opacity-70" />
  </svg>
);

const InteriorRearOutline = () => (
  <svg viewBox="0 0 420 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="28" y="28" width="364" height="134" rx="22" strokeWidth="2.3" />
    <rect x="68" y="64" width="284" height="66" rx="14" strokeWidth="2" />
    <path d="M122 64v66M210 64v66M298 64v66" strokeWidth="1.7" className="opacity-80" />
    <path d="M42 52h336M42 142h336" strokeWidth="1.5" className="opacity-65" />
  </svg>
);

const VehicleOutline = ({ view, profile }: { view: VehicleView; profile: VehicleProfile }) => {
  if (view === "left") {
    if (profile === "bus") return <BusSideViewOutline />;
    if (profile === "truck") return <TruckSideViewOutline />;
    if (profile === "van") return <VanSideViewOutline />;
    return <CarSideViewOutline />;
  }
  if (view === "right") {
    if (profile === "bus") return <BusSideViewOutline mirrored />;
    if (profile === "truck") return <TruckSideViewOutline mirrored />;
    if (profile === "van") return <VanSideViewOutline mirrored />;
    return <CarSideViewOutline mirrored />;
  }
  if (view === "front") return <FrontViewOutline />;
  if (view === "rear") return <RearViewOutline />;
  if (view === "top") return <TopViewOutline />;
  if (view === "bottom") return <BottomViewOutline />;
  if (view === "interior-front") return <InteriorFrontOutline />;
  return <InteriorRearOutline />;
};

const defaultViewNotes: Record<VehicleView, string> = {
  left: "",
  right: "",
  front: "",
  rear: "",
  top: "",
  bottom: "",
  "interior-front": "",
  "interior-rear": "",
};

const VehicleConditionReportPage = () => {
  const { user } = useCurentuser();
  const isClientReadonly = user?.role === "CLIENT";
  const { data: ownerVehicules = [], isLoading: isOwnerVehiclesLoading } = useOwnerVehiculesQuery(isClientReadonly ? undefined : user?.id);
  const { data: clientReservations = [], isLoading: isClientReservationsLoading } = useReservationClientQuery(isClientReadonly ? user?.id : undefined);

  const clientVehicules = useMemo(() => {
    const uniqueVehicules = new Map<string, Vehicule>();
    clientReservations.forEach((reservation) => {
      const vehicle = reservation.vehicle_data as Vehicule | undefined;
      if (vehicle?.id && !uniqueVehicules.has(vehicle.id)) {
        uniqueVehicules.set(vehicle.id, vehicle);
      }
    });
    return Array.from(uniqueVehicules.values());
  }, [clientReservations]);

  const vehicules = isClientReadonly ? clientVehicules : ownerVehicules;
  const isLoading = isClientReadonly ? isClientReservationsLoading : isOwnerVehiclesLoading;

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [vehicleProfileMode, setVehicleProfileMode] = useState<VehicleProfileMode>("auto");
  const [points, setPoints] = useState<DamagePoint[]>([]);
  const [customPhotosByView, setCustomPhotosByView] = useState<Partial<Record<VehicleView, string>>>({});
  const [useCustomPhotos, setUseCustomPhotos] = useState(true);
  const [viewNotes, setViewNotes] = useState<Record<VehicleView, string>>(defaultViewNotes);
  const [savedViewTimestamps, setSavedViewTimestamps] = useState<Partial<Record<VehicleView, string>>>({});
  const [hasHydratedReport, setHasHydratedReport] = useState(false);
  const skipAutoSaveRef = useRef(true);

  useEffect(() => {
    if (!selectedVehicleId && vehicules.length > 0) {
      setSelectedVehicleId(vehicules[0].id);
    }
  }, [vehicules, selectedVehicleId]);

  const {
    data: conditionReport,
    isLoading: isConditionReportLoading,
    refetch: refetchConditionReport,
  } = useQuery({
    queryKey: ["vehicule-condition-report", selectedVehicleId],
    enabled: !!selectedVehicleId,
    queryFn: async () => {
      if (!selectedVehicleId) throw new Error("Véhicule non sélectionné");
      const { data } = await vehiculeAPI.get_vehicle_condition_report(selectedVehicleId);
      return data;
    },
  });

  useEffect(() => {
    if (!conditionReport) {
      setPoints([]);
      setCustomPhotosByView({});
      setViewNotes(defaultViewNotes);
      setSavedViewTimestamps({});
      setHasHydratedReport(false);
      return;
    }

    setPoints(Array.isArray(conditionReport.points) ? conditionReport.points : []);
    setCustomPhotosByView(conditionReport.custom_photos_by_view || {});
    setSavedViewTimestamps(conditionReport.saved_view_timestamps || {});
    setViewNotes({
      ...defaultViewNotes,
      ...(conditionReport.view_notes || {}),
    });
    skipAutoSaveRef.current = true;
    setHasHydratedReport(true);
  }, [conditionReport]);

  useEffect(() => {
    if (!selectedVehicleId) return;
    setHasHydratedReport(false);
    skipAutoSaveRef.current = true;
  }, [selectedVehicleId]);

  const saveReportMutation = useMutation({
    mutationFn: async (payload: {
      view_notes: Partial<Record<VehicleView, string>>;
      saved_view_timestamps: Partial<Record<VehicleView, string>>;
      points: DamagePoint[];
      custom_photos_by_view: Partial<Record<VehicleView, string>>;
    }) => {
      if (!selectedVehicleId) throw new Error("Véhicule non sélectionné");
      const { data } = await vehiculeAPI.patch_vehicle_condition_report(selectedVehicleId, payload);
      return data;
    },
    onSuccess: (savedReport) => {
      setPoints(Array.isArray(savedReport.points) ? savedReport.points : []);
      setCustomPhotosByView(savedReport.custom_photos_by_view || {});
      setSavedViewTimestamps(savedReport.saved_view_timestamps || {});
      setViewNotes({
        ...defaultViewNotes,
        ...(savedReport.view_notes || {}),
      });
      refetchConditionReport();
    },
  });

  const selectedVehicle = useMemo(
    () => vehicules.find((vehicule) => vehicule.id === selectedVehicleId),
    [vehicules, selectedVehicleId]
  );

  const inferredVehicleProfile = useMemo(() => inferVehicleProfile(selectedVehicle), [selectedVehicle]);
  const vehicleProfile = vehicleProfileMode === "auto" ? inferredVehicleProfile : vehicleProfileMode;

  const groupedPoints = useMemo(
    () => points.reduce<Record<VehicleView, DamagePoint[]>>(
      (acc, point) => {
        acc[point.view].push(point);
        return acc;
      },
      { left: [], right: [], front: [], rear: [], top: [], bottom: [], "interior-front": [], "interior-rear": [] }
    ),
    [points]
  );

  const addDamagePoint = (view: VehicleView, event: MouseEvent<HTMLDivElement>) => {
    if (isClientReadonly) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setPoints((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        view,
        x,
        y,
        level: "léger",
        description: "",
      },
    ]);
  };

  const handleUploadForView = (view: VehicleView, event: ChangeEvent<HTMLInputElement>) => {
    if (isClientReadonly) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setCustomPhotosByView((prev) => ({ ...prev, [view]: result }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const persistReport = (payload?: Partial<{
    custom_photos_by_view: Partial<Record<VehicleView, string>>;
    saved_view_timestamps: Partial<Record<VehicleView, string>>;
  }>) => {
    if (isClientReadonly) return;
    saveReportMutation.mutate({
      view_notes: viewNotes,
      saved_view_timestamps: payload?.saved_view_timestamps ?? savedViewTimestamps,
      points,
      custom_photos_by_view: payload?.custom_photos_by_view ?? customPhotosByView,
    });
  };

  useEffect(() => {
    if (!selectedVehicleId || !hasHydratedReport) return;

    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      persistReport();
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [selectedVehicleId, hasHydratedReport, points, viewNotes, customPhotosByView]);

  const removePhotoForView = (view: VehicleView) => {
    if (isClientReadonly) return;
    setCustomPhotosByView((prev) => {
      const nextPhotosByView = { ...prev };
      delete nextPhotosByView[view];
      return nextPhotosByView;
    });
  };

  const removePoint = (pointId: string) => {
    if (isClientReadonly) return;
    setPoints((prev) => prev.filter((point) => point.id !== pointId));
  };

  const updatePointDescription = (pointId: string, description: string) => {
    if (isClientReadonly) return;
    setPoints((prev) => prev.map((point) => (point.id === pointId ? { ...point, description } : point)));
  };

  const updatePointLevel = (pointId: string, level: DamagePoint["level"]) => {
    if (isClientReadonly) return;
    setPoints((prev) => prev.map((point) => (point.id === pointId ? { ...point, level } : point)));
  };

  const updateViewNote = (view: VehicleView, note: string) => {
    if (isClientReadonly) return;
    setViewNotes((prev) => ({ ...prev, [view]: note }));
  };

  const saveViewReport = (view: VehicleView) => {
    if (isClientReadonly) return;
    const nextTimestamps = {
      ...savedViewTimestamps,
      [view]: new Date().toLocaleTimeString("fr-FR"),
    };

    setSavedViewTimestamps(nextTimestamps);
    persistReport({ saved_view_timestamps: nextTimestamps });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">État des lieux annoté du véhicule</h1>
        <p className="text-sm text-slate-600">
          Vous pouvez maintenant insérer vos propres photos (gauche, droite, avant, arrière, dessus, dessous, intérieur avant et intérieur arrière) pour un rapport plus réaliste.
        </p>
        {selectedVehicleId && isConditionReportLoading && (
          <p className="text-xs text-slate-500">Chargement du rapport enregistré...</p>
        )}
        {selectedVehicleId && !isClientReadonly && !isConditionReportLoading && saveReportMutation.isPending && (
          <p className="text-xs text-slate-500">Synchronisation avec le backend...</p>
        )}
      </div>

      <Card className="border-slate-200/70">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-primary" />
            Sélection du véhicule
          </CardTitle>
          <CardDescription>Choisissez un véhicule puis ajoutez vos vraies photos d&apos;inspection.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
            <select
              value={selectedVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-2 md:max-w-lg"
            >
              <option value="">{isLoading ? "Chargement des véhicules..." : "Sélectionner un véhicule"}</option>
              {vehicules.map((vehicule) => (
                <option key={vehicule.id} value={vehicule.id}>
                  {vehicule.titre} - {vehicule.numero_immatriculation}
                </option>
              ))}
            </select>

            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
              <span className="pl-1 text-[11px] font-semibold text-slate-600">Type schéma</span>
              <select
                value={vehicleProfileMode}
                onChange={(event) => setVehicleProfileMode(event.target.value as VehicleProfileMode)}
                disabled={isClientReadonly}
                className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 outline-none ring-primary/20 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(["auto", "car", "van", "truck", "bus"] as const).map((mode) => (
                  <option key={mode} value={mode}>{vehicleProfileModeLabels[mode]}</option>
                ))}
              </select>
            </div>

            <span className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
              Schéma actif: {vehicleProfileLabels[vehicleProfile]}{vehicleProfileMode === "auto" ? " (auto)" : " (manuel)"}
            </span>

            {!isClientReadonly && (
              <button
                type="button"
                onClick={() => setUseCustomPhotos((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  useCustomPhotos
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                {useCustomPhotos ? "Mode photos réelles" : "Mode schéma"}
              </button>
            )}

          </div>
        </CardContent>
      </Card>

      {!selectedVehicle ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="flex items-center gap-3 py-8 text-slate-600">
            <Info className="h-5 w-5" />
            Sélectionnez un véhicule pour ouvrir le plan d&apos;inspection annotable.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-slate-900 bg-slate-950 shadow-[0_24px_70px_-32px_rgba(2,8,23,0.9)]">
          <CardContent className={`space-y-4 p-4 ${isClientReadonly ? "opacity-95" : ""}`}>
            <div className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels.top}</span>
                <div className="flex items-center gap-2">
                  {!isClientReadonly && (
                    <>
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-200 transition hover:bg-slate-800">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Ajouter photo
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUploadForView("top", event)} />
                      </label>
                      {customPhotosByView.top && (
                        <button type="button" onClick={() => removePhotoForView("top")} className="inline-flex items-center gap-1 rounded-md border border-red-400/70 px-2 py-1 text-[10px] font-semibold text-red-200 hover:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" />
                          Effacer photo
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
                <div className="rounded-lg border border-slate-200 bg-white p-3 lg:order-last">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800">Rapport - {viewLabels.top}</p>
                    <div className="flex items-center gap-2">
                      {savedViewTimestamps.top && <span className="text-[10px] text-emerald-400">Enregistré à {savedViewTimestamps.top}</span>}
                      {!isClientReadonly && (
                        <button type="button" disabled={saveReportMutation.isPending} onClick={() => saveViewReport("top")} className="rounded-md border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">{saveReportMutation.isPending ? "Sauvegarde..." : "Enregistrer"}</button>
                      )}
                    </div>
                  </div>
                  <textarea value={viewNotes.top} readOnly={isClientReadonly} onChange={(event) => updateViewNote("top", event.target.value)} placeholder={`Observation générale - ${viewLabels.top}`} className="mb-2 min-h-16 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                  {groupedPoints.top.length > 0 && (
                    <div className="space-y-2">
                      {groupedPoints.top.map((point, index) => (
                        <div key={point.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">Point #{index + 1}</span>
                                <span className={`inline-flex min-w-6 items-center justify-center rounded-full border px-1 py-0.5 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`}>{index + 1}</span>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pointLevelChipClasses[point.level]}`}>{levelLabels[point.level]}</span>
                                <select
                                  value={point.level}
                                  onChange={(event) => updatePointLevel(point.id, event.target.value as DamagePoint["level"])}
                                  disabled={isClientReadonly}
                                  className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-medium text-slate-700 outline-none ring-primary/20 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {levelOptions.map((level) => (
                                    <option key={level} value={level}>{levelLabels[level]}</option>
                                  ))}
                                </select>
                              </div>
                              <input value={point.description} readOnly={isClientReadonly} onChange={(event) => updatePointDescription(point.id, event.target.value)} placeholder="Description du dommage" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                          {!isClientReadonly && (
                          <button
                            type="button"
                            onClick={() => removePoint(point.id)}
                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer #{index + 1}
                          </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative h-72 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)] lg:h-80 lg:order-first" onClick={(event) => addDamagePoint("top", event)}>
                  {useCustomPhotos && customPhotosByView.top ? (
                    <img src={customPhotosByView.top} alt={`Inspection ${viewLabels.top}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                  ) : (
                    <VehicleOutline view="top" profile={vehicleProfile} />
                  )}
                  {groupedPoints.top.map((point, index) => (
                    <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels.top} - point ${index + 1}`}>
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {(["left", "right", "front", "rear", "interior-front", "interior-rear"] as const).map((view) => (
                <div key={view} className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels[view]}</span>
                    <div className="flex items-center gap-2">
                      {!isClientReadonly && (
                        <>
                          <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-200 transition hover:bg-slate-800">
                            <ImagePlus className="h-3.5 w-3.5" />
                            Ajouter photo
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUploadForView(view, event)} />
                          </label>
                          {customPhotosByView[view] && (
                            <button type="button" onClick={() => removePhotoForView(view)} className="inline-flex items-center gap-1 rounded-md border border-red-400/70 px-2 py-1 text-[10px] font-semibold text-red-200 hover:bg-red-500/10">
                              <Trash2 className="h-3.5 w-3.5" />
                              Effacer photo
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 lg:order-last">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">Rapport - {viewLabels[view]}</p>
                        <div className="flex items-center gap-2">
                          {savedViewTimestamps[view] && <span className="text-[10px] text-emerald-400">Enregistré à {savedViewTimestamps[view]}</span>}
                          {!isClientReadonly && (
                            <button type="button" disabled={saveReportMutation.isPending} onClick={() => saveViewReport(view)} className="rounded-md border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">{saveReportMutation.isPending ? "Sauvegarde..." : "Enregistrer"}</button>
                          )}
                        </div>
                      </div>
                      <textarea value={viewNotes[view]} readOnly={isClientReadonly} onChange={(event) => updateViewNote(view, event.target.value)} placeholder={`Observation générale - ${viewLabels[view]}`} className="mb-2 min-h-16 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                      {groupedPoints[view].length > 0 && (
                        <div className="space-y-2">
                          {groupedPoints[view].map((point, index) => (
                            <div key={point.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">Point #{index + 1}</span>
                                <span className={`inline-flex min-w-6 items-center justify-center rounded-full border px-1 py-0.5 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`}>{index + 1}</span>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pointLevelChipClasses[point.level]}`}>{levelLabels[point.level]}</span>
                                <select
                                  value={point.level}
                                  onChange={(event) => updatePointLevel(point.id, event.target.value as DamagePoint["level"])}
                                  disabled={isClientReadonly}
                                  className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-medium text-slate-700 outline-none ring-primary/20 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {levelOptions.map((level) => (
                                    <option key={level} value={level}>{levelLabels[level]}</option>
                                  ))}
                                </select>
                              </div>
                              <input value={point.description} readOnly={isClientReadonly} onChange={(event) => updatePointDescription(point.id, event.target.value)} placeholder="Description du dommage" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                              {!isClientReadonly && (
                              <button
                                type="button"
                                onClick={() => removePoint(point.id)}
                                className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Supprimer #{index + 1}
                              </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative h-72 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)] lg:h-80 lg:order-first" onClick={(event) => addDamagePoint(view, event)}>
                      {useCustomPhotos && customPhotosByView[view] ? (
                        <img src={customPhotosByView[view]} alt={`Inspection ${viewLabels[view]}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                      ) : (
                        <VehicleOutline view={view} profile={vehicleProfile} />
                      )}
                      {groupedPoints[view].map((point, index) => (
                        <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels[view]} - point ${index + 1}`}>
                          {index + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels.bottom}</span>
                <div className="flex items-center gap-2">
                  {!isClientReadonly && (
                    <>
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-200 transition hover:bg-slate-800">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Ajouter photo
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUploadForView("bottom", event)} />
                      </label>
                      {customPhotosByView.bottom && (
                        <button type="button" onClick={() => removePhotoForView("bottom")} className="inline-flex items-center gap-1 rounded-md border border-red-400/70 px-2 py-1 text-[10px] font-semibold text-red-200 hover:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" />
                          Effacer photo
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
                <div className="rounded-lg border border-slate-200 bg-white p-3 lg:order-last">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800">Rapport - {viewLabels.bottom}</p>
                    <div className="flex items-center gap-2">
                      {savedViewTimestamps.bottom && <span className="text-[10px] text-emerald-400">Enregistré à {savedViewTimestamps.bottom}</span>}
                      {!isClientReadonly && (
                        <button type="button" disabled={saveReportMutation.isPending} onClick={() => saveViewReport("bottom")} className="rounded-md border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">{saveReportMutation.isPending ? "Sauvegarde..." : "Enregistrer"}</button>
                      )}
                    </div>
                  </div>
                  <textarea value={viewNotes.bottom} readOnly={isClientReadonly} onChange={(event) => updateViewNote("bottom", event.target.value)} placeholder={`Observation générale - ${viewLabels.bottom}`} className="mb-2 min-h-16 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                  {groupedPoints.bottom.length > 0 && (
                    <div className="space-y-2">
                      {groupedPoints.bottom.map((point, index) => (
                        <div key={point.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">Point #{index + 1}</span>
                            <span className={`inline-flex min-w-6 items-center justify-center rounded-full border px-1 py-0.5 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`}>{index + 1}</span>
                          </div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pointLevelChipClasses[point.level]}`}>{levelLabels[point.level]}</span>
                            <select
                              value={point.level}
                              onChange={(event) => updatePointLevel(point.id, event.target.value as DamagePoint["level"])}
                              disabled={isClientReadonly}
                              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-medium text-slate-700 outline-none ring-primary/20 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {levelOptions.map((level) => (
                                <option key={level} value={level}>{levelLabels[level]}</option>
                              ))}
                            </select>
                          </div>
                          <input value={point.description} readOnly={isClientReadonly} onChange={(event) => updatePointDescription(point.id, event.target.value)} placeholder="Description du dommage" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-primary/20 focus:ring-2" />
                          {!isClientReadonly && (
                          <button
                            type="button"
                            onClick={() => removePoint(point.id)}
                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer #{index + 1}
                          </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative h-72 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)] lg:h-80 lg:order-first" onClick={(event) => addDamagePoint("bottom", event)}>
                  {useCustomPhotos && customPhotosByView.bottom ? (
                    <img src={customPhotosByView.bottom} alt={`Inspection ${viewLabels.bottom}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                  ) : (
                    <VehicleOutline view="bottom" profile={vehicleProfile} />
                  )}
                  {groupedPoints.bottom.map((point, index) => (
                    <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getPointLevelColor(point.level)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels.bottom} - point ${index + 1}`}>
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleConditionReportPage;
