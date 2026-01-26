import {  vehiculeSearchAPI } from "@/Actions/vehiculeApi";
import { VehicleSearchItem } from "@/types/vehicleSearchType";
import { useQuery } from "@tanstack/react-query";


// ░░░░░░░░░░ POPULAR VEHICLES ░░░░░░░░░░
export const usePopularVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "popular"],
    queryFn: vehiculeSearchAPI.popular,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};


// ░░░░░░░░░░ COUP DE COEUR VEHICLES ░░░░░░░░░░
export const useCoupDeCoeurVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "coup-de-coeur"],
    queryFn: vehiculeSearchAPI.coupDeCoeur,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


// ░░░░░░░░░░ MOST BOOKED VEHICLES ░░░░░░░░░░
export const useMostBookedVehicles = () => {
  return useQuery<VehicleSearchItem[]>({
    queryKey: ["vehicles", "most-booked"],
    queryFn: vehiculeSearchAPI.mostBooked,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
