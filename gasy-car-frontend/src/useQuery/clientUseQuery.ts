import { reservationServiceAPI } from "@/Actions/reservationsApi";
import { Reservation } from "@/types/reservationsType";
import { useQuery } from "@tanstack/react-query";

const ONE_HOUR_MS = 1000 * 60 * 60;


export const useReservationClientQuery = (clientId?: string) => {
  return useQuery<Reservation[]>({
    queryKey: ["reservation-clients-all", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID is required");
      const { data } = await reservationServiceAPI.get_reservation_of_client(
        clientId,
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    retry: 2,
  });
};
