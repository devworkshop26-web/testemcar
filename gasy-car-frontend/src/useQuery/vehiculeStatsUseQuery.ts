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
        const sponsoredFromSearch = normalizeVehicleList(await vehiculeSearchAPI.sponsored());
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
        const sponsoredFromList = normalizeVehicleList(sponsoredListData as VehicleListResponse);
        if (sponsoredFromList.length > 0) {
          return sponsoredFromList;
        }
      } catch {
        // fallback below
      }

      const { data: allVehiclesData } = await vehiculeAPI.get_all_vehicules();
      const allVehicles = normalizeVehicleList(allVehiclesData as VehicleListResponse);
      return allVehicles.filter((vehicle) => (vehicle as { est_sponsorise?: boolean }).est_sponsorise === true);
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
        const coupsFromSearch = normalizeVehicleList(await vehiculeSearchAPI.coupDeCoeur());
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
        const coupsFromList = normalizeVehicleList(coupsFromListData as VehicleListResponse);
        if (coupsFromList.length > 0) {
          return coupsFromList;
        }
      } catch {
        // fallback below
      }

      const { data: allVehiclesData } = await vehiculeAPI.get_all_vehicules();
      const allVehicles = normalizeVehicleList(allVehiclesData as VehicleListResponse);
      return allVehicles.filter((vehicle) => (vehicle as { est_coup_de_coeur?: boolean }).est_coup_de_coeur === true);
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
