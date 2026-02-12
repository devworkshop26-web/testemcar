import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Eraser,
  ImagePlus,
  Info,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";

type VehicleView = "left" | "right" | "front" | "rear" | "top" | "bottom" | "interior-front" | "interior-rear";

type DamagePoint = {
  id: string;
  view: VehicleView;
  x: number;
  y: number;
  level: "léger" | "moyen" | "important";
  description: string;
};

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

const reportViewOrder: VehicleView[] = [
  "top",
  "front",
  "left",
  "right",
  "rear",
  "bottom",
  "interior-front",
  "interior-rear",
];


const annotationPalette = [
  "bg-sky-500 border-sky-300",
  "bg-emerald-500 border-emerald-300",
  "bg-violet-500 border-violet-300",
  "bg-amber-500 border-amber-300",
  "bg-rose-500 border-rose-300",
  "bg-cyan-500 border-cyan-300",
  "bg-indigo-500 border-indigo-300",
  "bg-orange-500 border-orange-300",
];

const getAnnotationColor = (index: number) => annotationPalette[index % annotationPalette.length];

const SideViewOutline = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg viewBox="0 0 460 190" className="h-full w-full text-slate-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <path d="M42 118l8-23 36-20 64-13h186l68 10 26 20 8 26v16H42z" strokeWidth="2.6" />
      <path d="M116 73l30-30h133l45 30" strokeWidth="2.2" />
      <path d="M176 73v59M240 73v59M304 73v59" strokeWidth="1.7" className="opacity-85" />
      <path d="M90 120h52M318 120h58" strokeWidth="1.7" className="opacity-80" />
      <circle cx="124" cy="136" r="31" strokeWidth="2.6" />
      <circle cx="124" cy="136" r="17" strokeWidth="1.8" className="opacity-80" />
      <circle cx="344" cy="136" r="31" strokeWidth="2.6" />
      <circle cx="344" cy="136" r="17" strokeWidth="1.8" className="opacity-80" />
      <path d="M58 108h30M404 108h30" strokeWidth="1.5" className="opacity-70" />
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

const VehicleOutline = ({ view }: { view: VehicleView }) => {
  if (view === "left") return <SideViewOutline />;
  if (view === "right") return <SideViewOutline mirrored />;
  if (view === "front") return <FrontViewOutline />;
  if (view === "rear") return <RearViewOutline />;
  if (view === "top") return <TopViewOutline />;
  if (view === "bottom") return <BottomViewOutline />;
  if (view === "interior-front") return <InteriorFrontOutline />;
  return <InteriorRearOutline />;
};

const VehicleConditionReportPage = () => {
  const { user } = useCurentuser();
  const { data: vehicules = [], isLoading } = useOwnerVehiculesQuery(user?.id);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [damageLevel, setDamageLevel] = useState<DamagePoint["level"]>("léger");
  const [points, setPoints] = useState<DamagePoint[]>([]);
  const [customPhotosByView, setCustomPhotosByView] = useState<Partial<Record<VehicleView, string>>>({});
  const [useCustomPhotos, setUseCustomPhotos] = useState(true);
  const [viewNotes, setViewNotes] = useState<Record<VehicleView, string>>({
    left: "",
    right: "",
    front: "",
    rear: "",
    top: "",
    bottom: "",
    "interior-front": "",
    "interior-rear": "",
  });

  const selectedVehicle = useMemo(
    () => vehicules.find((vehicule) => vehicule.id === selectedVehicleId),
    [vehicules, selectedVehicleId]
  );

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
        level: damageLevel,
        description: "",
      },
    ]);
  };

  const handleUploadForView = (view: VehicleView, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCustomPhotosByView((prev) => ({ ...prev, [view]: previewUrl }));
  };

  const resetUploadedPhotos = () => setCustomPhotosByView({});
  const removePhotoForView = (view: VehicleView) => {
    setCustomPhotosByView((prev) => {
      const next = { ...prev };
      delete next[view];
      return next;
    });
  };
  const updatePointDescription = (pointId: string, description: string) => {
    setPoints((prev) => prev.map((point) => (point.id === pointId ? { ...point, description } : point)));
  };

  const updateViewNote = (view: VehicleView, note: string) => {
    setViewNotes((prev) => ({ ...prev, [view]: note }));
  };

  const clearAllPoints = () => setPoints([]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">État des lieux annoté du véhicule</h1>
        <p className="text-sm text-slate-600">
          Vous pouvez maintenant insérer vos propres photos (gauche, droite, avant, arrière, dessus, dessous, intérieur avant et intérieur arrière) pour un rapport plus réaliste.
        </p>
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

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
              {(["léger", "moyen", "important"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDamageLevel(level)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    damageLevel === level
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

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

            <button
              type="button"
              onClick={clearAllPoints}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Eraser className="h-4 w-4" />
              Effacer points
            </button>

            <button
              type="button"
              onClick={resetUploadedPhotos}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser photos
            </button>
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
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden border-slate-900 bg-slate-950 shadow-[0_24px_70px_-32px_rgba(2,8,23,0.9)]">
            <CardContent className="space-y-4 p-4">
              <div className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels.top}</span>
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
                </div>
                <div className="relative h-64 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)]" onClick={(event) => addDamagePoint("top", event)}>
                  {useCustomPhotos && customPhotosByView.top ? (
                    <img src={customPhotosByView.top} alt={`Inspection ${viewLabels.top}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                  ) : (
                    <VehicleOutline view="top" />
                  )}
                  {groupedPoints.top.map((point, index) => (
                    <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getAnnotationColor(index)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels.top} - point ${index + 1}`}>
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {(["left", "right", "front", "rear", "interior-front", "interior-rear"] as const).map((view) => (
                  <div key={view} className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels[view]}</span>
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
                    </div>
                    <div className="relative h-64 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)]" onClick={(event) => addDamagePoint(view, event)}>
                      {useCustomPhotos && customPhotosByView[view] ? (
                        <img src={customPhotosByView[view]} alt={`Inspection ${viewLabels[view]}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                      ) : (
                        <VehicleOutline view={view} />
                      )}
                      {groupedPoints[view].map((point, index) => (
                        <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getAnnotationColor(index)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels[view]} - point ${index + 1}`}>
                          {index + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-700/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{viewLabels.bottom}</span>
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
                </div>
                <div className="relative h-64 cursor-crosshair overflow-hidden rounded-lg border border-slate-700/80 bg-[radial-gradient(circle_at_center,_#0f172a,_#020617)]" onClick={(event) => addDamagePoint("bottom", event)}>
                  {useCustomPhotos && customPhotosByView.bottom ? (
                    <img src={customPhotosByView.bottom} alt={`Inspection ${viewLabels.bottom}`} className="absolute inset-0 h-full w-full object-contain bg-black/30" />
                  ) : (
                    <VehicleOutline view="bottom" />
                  )}
                  {groupedPoints.bottom.map((point, index) => (
                    <span key={point.id} className={`absolute flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1 text-[10px] font-bold text-white ${getAnnotationColor(index)}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} title={`${viewLabels.bottom} - point ${index + 1}`}>
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Rapport rapide
              </CardTitle>
              <CardDescription>{selectedVehicle.titre} • {selectedVehicle.numero_immatriculation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-emerald-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <p>Total points annotés : <strong>{points.length}</strong></p>
                </div>
              </div>

              {points.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    Cliquez sur une vue pour placer les zones d&apos;impact.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {reportViewOrder.map((view) => {
                    const viewPoints = groupedPoints[view];

                    return (
                      <div key={view} className="rounded-lg border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-800">{viewLabels[view]}</p>
                          <span className="text-xs text-slate-500">{viewPoints.length} point(s)</span>
                        </div>

                        <textarea
                          value={viewNotes[view]}
                          onChange={(event) => updateViewNote(view, event.target.value)}
                          placeholder={`Observation générale - ${viewLabels[view]}`}
                          className="mb-2 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-xs outline-none ring-primary/20 focus:ring-2"
                        />

                        {viewPoints.length === 0 ? (
                          <p className="text-xs text-slate-400">Aucun point annoté pour cette vue.</p>
                        ) : (
                          <div className="space-y-2">
                            {viewPoints.map((point, index) => {
                              const pointNumber = index + 1;

                              return (
                                <div key={point.id} className="rounded-md border border-slate-200 p-2">
                                  <div className="mb-2 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-700">Point #{pointNumber}</span>
                                    <span className={`inline-flex min-w-6 items-center justify-center rounded-full border px-1 py-0.5 text-[10px] font-bold text-white ${getAnnotationColor(index)}`}>{pointNumber}</span>
                                  </div>
                                  <input
                                    value={point.description}
                                    onChange={(event) => updatePointDescription(point.id, event.target.value)}
                                    placeholder="Description du dommage (rayure, choc, fissure...)"
                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs outline-none ring-primary/20 focus:ring-2"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VehicleConditionReportPage;
