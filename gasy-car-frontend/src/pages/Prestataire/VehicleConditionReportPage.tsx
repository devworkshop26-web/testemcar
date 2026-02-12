import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { AlertCircle, Car, CheckCircle2, ClipboardCheck, Eraser, Info } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";

type VehicleView = "left" | "front" | "rear" | "top";

type DamagePoint = {
  id: string;
  view: VehicleView;
  x: number;
  y: number;
  level: "léger" | "moyen" | "important";
};

const viewLabels: Record<VehicleView, string> = {
  left: "Vue latérale",
  front: "Vue avant",
  rear: "Vue arrière",
  top: "Vue de dessus",
};

const levelClasses: Record<DamagePoint["level"], string> = {
  léger: "bg-emerald-500",
  moyen: "bg-amber-500",
  important: "bg-red-500",
};

const VehicleOutline = ({ view }: { view: VehicleView }) => {
  if (view === "left") {
    return (
      <svg viewBox="0 0 420 160" className="h-full w-full text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="48" y="58" width="316" height="52" rx="12" />
        <path d="M98 58l38-24h148l42 24" />
        <circle cx="120" cy="114" r="26" />
        <circle cx="302" cy="114" r="26" />
        <path d="M184 58v52M238 58v52" />
      </svg>
    );
  }

  if (view === "front") {
    return (
      <svg viewBox="0 0 220 160" className="h-full w-full text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="30" y="35" width="160" height="90" rx="18" />
        <path d="M58 88h104M44 68h132" />
        <circle cx="64" cy="128" r="11" />
        <circle cx="156" cy="128" r="11" />
        <path d="M76 64l-20 24M144 64l20 24" />
      </svg>
    );
  }

  if (view === "rear") {
    return (
      <svg viewBox="0 0 220 160" className="h-full w-full text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="30" y="35" width="160" height="90" rx="18" />
        <path d="M52 82h116" />
        <rect x="84" y="58" width="52" height="20" rx="6" />
        <circle cx="64" cy="128" r="11" />
        <circle cx="156" cy="128" r="11" />
        <path d="M60 56l24 18M160 56l-24 18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 160" className="h-full w-full text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="24" y="22" width="272" height="116" rx="26" />
      <rect x="84" y="42" width="152" height="78" rx="20" />
      <path d="M120 42v78M200 42v78" />
      <path d="M24 58h60M296 58h-60M24 102h60M296 102h-60" />
    </svg>
  );
};

const VehicleConditionReportPage = () => {
  const { user } = useCurentuser();
  const { data: vehicules = [], isLoading } = useOwnerVehiculesQuery(user?.id);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [damageLevel, setDamageLevel] = useState<DamagePoint["level"]>("léger");
  const [points, setPoints] = useState<DamagePoint[]>([]);

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
      { left: [], front: [], rear: [], top: [] }
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
      },
    ]);
  };

  const clearAllPoints = () => setPoints([]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">État des lieux annoté du véhicule</h1>
        <p className="text-sm text-slate-600">
          Créez un constat visuel (avant/après location) en plaçant les dommages directement sur le plan du véhicule.
        </p>
      </div>

      <Card className="border-slate-200/70">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-primary" />
            Sélection du véhicule
          </CardTitle>
          <CardDescription>Choisissez un véhicule pour commencer l&apos;inspection visuelle.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
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
              onClick={clearAllPoints}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Eraser className="h-4 w-4" />
              Effacer
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
          <Card className="overflow-hidden border-slate-900 bg-slate-900">
            <CardContent className="grid gap-4 p-4 md:grid-cols-2">
              {(["left", "front", "rear", "top"] as VehicleView[]).map((view) => (
                <div
                  key={view}
                  className="relative rounded-xl border border-white/20 bg-gradient-to-b from-slate-800 to-slate-900 p-3"
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/80">{viewLabels[view]}</div>
                  <div
                    className="relative h-44 cursor-crosshair rounded-lg border border-white/20"
                    onClick={(event) => addDamagePoint(view, event)}
                  >
                    <VehicleOutline view={view} />
                    {groupedPoints[view].map((point) => (
                      <span
                        key={point.id}
                        className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white ${levelClasses[point.level]}`}
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        title={`${viewLabels[view]} - ${point.level}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
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
                    Cliquez sur le schéma pour placer les zones d&apos;impact.
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {points.map((point, index) => (
                    <li key={point.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                      <span className="text-slate-700">#{index + 1} • {viewLabels[point.view]}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${levelClasses[point.level]}`} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VehicleConditionReportPage;
