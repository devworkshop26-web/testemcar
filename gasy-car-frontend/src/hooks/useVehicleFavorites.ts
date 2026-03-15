import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurentuser } from "@/useQuery/authUseQuery";

const FAVORITES_STORAGE_PREFIX = "vehicle_favorites";

const getStorageKey = (userId: string) => `${FAVORITES_STORAGE_PREFIX}:${userId}`;

const parseFavorites = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};

export const useVehicleFavorites = () => {
  const { user } = useCurentuser();
  const userKey = useMemo(
    () => String(user?.id ?? user?.email ?? "anonymous"),
    [user?.id, user?.email]
  );

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(userKey));
    setFavoriteIds(parseFavorites(saved));
  }, [userKey]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(favoriteIds));
  }, [favoriteIds, userKey]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (vehicleId: string) => favoriteSet.has(vehicleId),
    [favoriteSet]
  );

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  }, []);

  const removeFavorite = useCallback((vehicleId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== vehicleId));
  }, []);

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
};
