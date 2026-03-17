import { InstanceAxis } from "@/helper/InstanceAxios";
import type { Vehicule } from "@/types/vehiculeType";

export const favoritesAPI = {
  getFavoriteVehicles: () =>
    InstanceAxis.get<Vehicule[]>("/vehicule/vehicule/favorites/"),

  getFavoriteVehicleIds: () =>
    InstanceAxis.get<{ vehicle_ids: string[] }>("/vehicule/vehicule/favorites-ids/"),

  addFavorite: (vehicleId: string) =>
    InstanceAxis.post(`/vehicule/vehicule/${vehicleId}/favorite/`),

  removeFavorite: (vehicleId: string) =>
    InstanceAxis.delete(`/vehicule/vehicule/${vehicleId}/favorite/`),
};
