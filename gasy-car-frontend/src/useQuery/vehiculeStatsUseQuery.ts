import {  vehiculeSearchAPI } from "@/Actions/vehiculeApi";
import { VehicleSearchItem } from "@/types/vehicleSearchType";
import { useQuery } from "@tanstack/react-query";

type VehicleListResponse =
  | VehicleSearchItem[]
  | {
      results?: VehicleSearchItem[];
    };

const normalizeVehicleList = (payload: VehicleListResponse): VehicleSearchItem[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};


// ░░░░░░░░░░ POPULAR VEHICLES ░░░░░░░░░░
export const usePopularVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "popular"],
    queryFn: async () => normalizeVehicleList(await vehiculeSearchAPI.popular()),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useSponsoredVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "sponsored"],
    queryFn: async () => normalizeVehicleList(await vehiculeSearchAPI.sponsored()),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


// ░░░░░░░░░░ COUP DE COEUR VEHICLES ░░░░░░░░░░
export const useCoupDeCoeurVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "coup-de-coeur"],
    queryFn: async () => normalizeVehicleList(await vehiculeSearchAPI.coupDeCoeur()),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


// ░░░░░░░░░░ MOST BOOKED VEHICLES ░░░░░░░░░░
export const useMostBookedVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "most-booked"],
    queryFn: async () => normalizeVehicleList(await vehiculeSearchAPI.mostBooked()),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
