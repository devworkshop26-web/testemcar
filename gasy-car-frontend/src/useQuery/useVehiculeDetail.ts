import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { Vehicule } from "@/types/vehiculeType";

export const useVehiculeDetail = (vehicleId?: string) => {
  return useQuery<Vehicule>({
    queryKey: ["vehicule-detail", vehicleId],
    enabled: !!vehicleId,
    queryFn: async () => {
      const { data } = await InstanceAxis.get(
        `/vehicule/vehicule/${vehicleId}/`
      );
      return data;
    },
  });
};
