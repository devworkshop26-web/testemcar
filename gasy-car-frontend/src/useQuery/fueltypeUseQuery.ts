// queries/fueltype-vehicule-query.ts
import { fuelTypeVehiculeAPI } from "@/Actions/fueltypeApi";
import { CreateFuelTypePayload, FuelType, UpdateFuelTypePayload } from "@/types/fuelType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const useFuelTypesQuery = () => {
  return useQuery<FuelType[]>({
    queryKey: ["fueltypes-vehicule-all"],
    queryFn: async () => {
      const { data } = await fuelTypeVehiculeAPI.get_all_fuel_types();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

export const useFuelTypeQuery = (id?: string) => {
  return useQuery<FuelType>({
    queryKey: ["fueltypes-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID fuel type manquant");
      const { data } = await fuelTypeVehiculeAPI.get_one_fuel_type(id);
      return data;
    },
    retry: 1,
  });
};

export const useCreateFuelTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFuelTypePayload) =>
      fuelTypeVehiculeAPI.create_fuel_type(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fueltypes-vehicule-all"],
      });
    },
  });
};

export const useUpdateFuelTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFuelTypePayload;
    }) =>
      fuelTypeVehiculeAPI
        .update_fuel_type(id, payload)
        .then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["fueltypes-vehicule-all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fueltypes-vehicule-one", id],
      });
    },
  });
};

export const useDeleteFuelTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fuelTypeVehiculeAPI.delete_fuel_type(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fueltypes-vehicule-all"],
      });
    },
  });
};
