// src/queries/useVehicleSearchQuery.ts
import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { searchVehicles } from "@/Actions/vehiculeApi";
import { VehicleSearchFilters } from "@/types/vehicleSearchType";



export const useVehicleSearchQuery = (filters: VehicleSearchFilters) => {
  return useQuery({
    queryKey: ["vehicle-search", filters],
    queryFn: () => searchVehicles(filters),
    enabled: !!filters, // ne lance pas tant qu'on n’a rien rempli
  });
};
