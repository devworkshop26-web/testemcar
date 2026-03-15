import { vehiculeAPI, vehiculeSearchAPI } from "@/Actions/vehiculeApi";
import { VehicleSearchItem } from "@/types/vehicleSearchType";
import { useQuery } from "@tanstack/react-query";

type QueryConfig = {
  enabled?: boolean;
};

type VehicleListResponse =
  | VehicleSearchItem[]
  | {
      data?: VehicleSearchItem[] | { results?: VehicleSearchItem[]; items?: VehicleSearchItem[]; vehicles?: VehicleSearchItem[] };
      items?: VehicleSearchItem[];
      vehicles?: VehicleSearchItem[];
      results?: VehicleSearchItem[];
    };

const normalizeVehicleList = (payload: VehicleListResponse): VehicleSearchItem[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.data) {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.data.results)) {
      return payload.data.results;
    }

    if (Array.isArray(payload.data.items)) {
      return payload.data.items;
    }

    if (Array.isArray(payload.data.vehicles)) {
      return payload.data.vehicles;
    }
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }

  if (payload && Array.isArray(payload.vehicles)) {
    return payload.vehicles;
  }

  return [];
};


const isVehicleFlagEnabled = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["false", "0", "non", "no", "off", "disabled", "not sponsored", "non sponsorise", "non sponsorisé"].includes(normalized)) {
      return false;
    }

    return ["true", "1", "yes", "oui", "on", "enabled", "sponsorise", "sponsorisé", "sponsored", "coup de coeur", "coup_de_coeur"].includes(normalized);
  }

  return false;
};

const getNestedValue = (vehicle: Record<string, unknown>, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }

    return undefined;
  }, vehicle);
};

const getVehicleFlagValue = (vehicle: Record<string, unknown>, flag: "est_sponsorise" | "est_coup_de_coeur"): unknown => {
  const flagKeys =
    flag === "est_sponsorise"
      ? [
          "est_sponsorise",
          "sponsorise",
          "sponsored",
          "is_sponsored",
          "details.est_sponsorise",
          "details.sponsorise",
          "details.sponsored",
          "vehicule.est_sponsorise",
          "vehicule.sponsorise",
          "vehicle.est_sponsorise",
          "vehicle.sponsored",
          "statut_sponsoring",
          "sponsoring_status",
        ]
      : [
          "est_coup_de_coeur",
          "coup_de_coeur",
          "is_favorite",
          "favorite",
          "details.est_coup_de_coeur",
          "details.coup_de_coeur",
          "vehicule.est_coup_de_coeur",
          "vehicle.est_coup_de_coeur",
          "statut_coup_de_coeur",
        ];

  for (const key of flagKeys) {
    const value = key.includes(".") ? getNestedValue(vehicle, key) : vehicle[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
};

const filterVehiclesByFlag = <T extends VehicleSearchItem>(
  vehicles: T[],
  flag: "est_sponsorise" | "est_coup_de_coeur",
  options?: { keepIfFlagMissing?: boolean }
): T[] =>
  vehicles.filter((vehicle) => {
    const rawFlag = getVehicleFlagValue(vehicle as Record<string, unknown>, flag);
    if (rawFlag === undefined || rawFlag === null) {
      return options?.keepIfFlagMissing === true;
    }

    return isVehicleFlagEnabled(rawFlag);
  });


// ░░░░░░░░░░ POPULAR VEHICLES ░░░░░░░░░░
export const usePopularVehicles = (config?: QueryConfig) => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "popular"],
    queryFn: async () => normalizeVehicleList(await vehiculeSearchAPI.popular()),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: config?.enabled,
  });
};

export const useSponsoredVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "sponsored"],
    queryFn: async () => {
      try {
        const sponsoredFromSearch = filterVehiclesByFlag(
          normalizeVehicleList(await vehiculeSearchAPI.sponsored()),
          "est_sponsorise",
          { keepIfFlagMissing: true }
        );
        if (sponsoredFromSearch.length > 0) {
          return sponsoredFromSearch;
        }
      } catch {
        // fallback below
      }

      try {
        const { data: sponsoredListData } = await vehiculeAPI.get_all_vehicules({
          est_sponsorise: true,
        });
        const sponsoredFromList = filterVehiclesByFlag(
          normalizeVehicleList(sponsoredListData as VehicleListResponse),
          "est_sponsorise",
          { keepIfFlagMissing: true }
        );
        if (sponsoredFromList.length > 0) {
          return sponsoredFromList;
        }
      } catch {
        // fallback below
      }

      const { data: allVehiclesData } = await vehiculeAPI.get_all_vehicules();
      const allVehicles = normalizeVehicleList(allVehiclesData as VehicleListResponse);
      return filterVehiclesByFlag(allVehicles, "est_sponsorise");
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


// ░░░░░░░░░░ COUP DE COEUR VEHICLES ░░░░░░░░░░
export const useCoupDeCoeurVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "coup-de-coeur"],
    queryFn: async () => {
      try {
        const coupsFromSearch = filterVehiclesByFlag(
          normalizeVehicleList(await vehiculeSearchAPI.coupDeCoeur()),
          "est_coup_de_coeur"
        );
        if (coupsFromSearch.length > 0) {
          return coupsFromSearch;
        }
      } catch {
        // fallback below
      }

      try {
        const { data: coupsFromListData } = await vehiculeAPI.get_all_vehicules({
          est_coup_de_coeur: true,
        });
        const coupsFromList = filterVehiclesByFlag(
          normalizeVehicleList(coupsFromListData as VehicleListResponse),
          "est_coup_de_coeur"
        );
        if (coupsFromList.length > 0) {
          return coupsFromList;
        }
      } catch {
        // fallback below
      }

      const { data: allVehiclesData } = await vehiculeAPI.get_all_vehicules();
      const allVehicles = normalizeVehicleList(allVehiclesData as VehicleListResponse);
      return filterVehiclesByFlag(allVehicles, "est_coup_de_coeur");
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


// ░░░░░░░░░░ MOST BOOKED VEHICLES ░░░░░░░░░░
export const useMostBookedVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "most-booked"],
    queryFn: async () => {
      try {
        const mostBookedFromSearch = normalizeVehicleList(await vehiculeSearchAPI.mostBooked());
        if (mostBookedFromSearch.length > 0) {
          return mostBookedFromSearch;
        }
      } catch {
        // fallback below
      }

      const { data: allVehiclesData } = await vehiculeAPI.get_all_vehicules({
        est_disponible: true,
      });
      const allVehicles = normalizeVehicleList(allVehiclesData as VehicleListResponse);

      return [...allVehicles]
        .sort((a, b) => (Number(b.nombre_locations) || 0) - (Number(a.nombre_locations) || 0))
        .slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
