import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { favoritesAPI } from "@/Actions/favoritesApi";

export const useVehicleFavorites = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useCurentuser();

  const favoriteIdsQuery = useQuery({
    queryKey: ["vehicle-favorites", user?.id],
    queryFn: async () => {
      const { data } = await favoritesAPI.getFavoriteVehicleIds();
      return data.vehicle_ids ?? [];
    },
    enabled: Boolean(isAuthenticated && user?.id),
    staleTime: 30_000,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (vehicleId: string) => favoritesAPI.addFavorite(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-favorites", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-favorites-vehicles", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (vehicleId: string) => favoritesAPI.removeFavorite(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-favorites", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-favorites-vehicles", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });

  const favoriteIds = favoriteIdsQuery.data ?? [];
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (vehicleId: string) => favoriteSet.has(vehicleId),
    [favoriteSet]
  );

  const toggleFavorite = useCallback(
    (vehicleId: string) => {
      if (!isAuthenticated) return;
      if (favoriteSet.has(vehicleId)) {
        removeFavoriteMutation.mutate(vehicleId);
      } else {
        addFavoriteMutation.mutate(vehicleId);
      }
    },
    [isAuthenticated, favoriteSet, addFavoriteMutation, removeFavoriteMutation]
  );

  const removeFavorite = useCallback(
    (vehicleId: string) => {
      if (!isAuthenticated) return;
      removeFavoriteMutation.mutate(vehicleId);
    },
    [isAuthenticated, removeFavoriteMutation]
  );

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    isLoadingFavorites: favoriteIdsQuery.isLoading,
    isUpdatingFavorite: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
};
