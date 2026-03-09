// queries/reservation-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateReservationPayload,
  UpdateReservationPayload,
  ReservationService,
  CreateReservationServicePayload,
  ReservationGraphiqueDay,
  ReservationGraphiqueWeek,
  ReservationGraphiqueMonth,
} from "@/types/reservationsType";
import { Reservation } from "@/types/reservationsType";
import {
  reservationAPI,
  reservationGraphiqueAPI,
  reservationServiceAPI,
} from "@/Actions/reservationsApi";
import { reservationPaymentAPI } from "@/Actions/reservation-payment-api";

const ONE_HOUR_MS = 1000 * 60 * 60;

// 🔹 Reservations

export const useReservationsQuery = () => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations-all"],
    queryFn: async () => {
      const { data } = await reservationAPI.get_all_reservations();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    retry: 2,
  });
};

export const useReservationQuery = (id?: string) => {
  return useQuery<Reservation>({
    queryKey: ["reservation-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID réservation manquant");
      const { data } = await reservationAPI.get_one_reservation(id);
      return data;
    },
    retry: 1,
  });
};

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReservationPayload) =>
      reservationAPI.create_reservation(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
      queryClient.invalidateQueries({ queryKey: ["reservation-of-Myvehicule-all"] });
    },
  });
};

export const useUpdateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReservationPayload;
    }) =>
      reservationAPI.update_reservation(id, payload).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
      queryClient.invalidateQueries({ queryKey: ["reservation-one", id] });
    },
  });
};

export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      reservationAPI.delete_reservation(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
    },
  });
};

// 🔹 Reservation Services

export const useReservationServicesQuery = (reservationId?: string) => {
  return useQuery<ReservationService[]>({
    queryKey: ["reservation-services-all", reservationId],
    enabled: !!reservationId,
    queryFn: async () => {
      const { data } = await reservationServiceAPI.get_all_services(
        reservationId
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    retry: 2,
  });
};

export const useCreateReservationServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReservationServicePayload) =>
      reservationServiceAPI.create_service(payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reservation-services-all", data.reservation],
      });
    },
  });
};

export const useDeleteReservationServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      reservationServiceAPI.delete_service(id).then((res) => res.data),
    // tu peux invalider depuis la page, où tu connais reservationId
  });
};



/* ----------------------------------------
   🟦 Query: Graphique par jour
---------------------------------------- */
export const useReservationGraphiqueDayQuery = () =>
  useQuery<ReservationGraphiqueDay[]>({
    queryKey: ["reservation", "stats", "day"],
    queryFn: async () => {
      const { data } = await reservationGraphiqueAPI.get_reservation_graphique_day();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    retry: 2,
  });

/* ----------------------------------------
   🟩 Query: Graphique par semaine
---------------------------------------- */
export const useReservationGraphiqueWeekQuery = () =>
  useQuery<ReservationGraphiqueWeek[]>({
    queryKey: ["reservation", "stats", "week"],
    queryFn: async () => {
      const { data } = await reservationGraphiqueAPI.get_reservation_graphique_week();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    retry: 2,
  });

/* ----------------------------------------
   🟧 Query: Graphique par mois
---------------------------------------- */
export const useReservationGraphiqueMonthQuery = () =>
  useQuery<ReservationGraphiqueMonth[]>({
    queryKey: ["reservation", "stats", "month"],
    queryFn: async () => {
      const { data } = await reservationGraphiqueAPI.get_reservation_graphique_month();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_HOUR_MS,
    retry: 2,
  });

/* ----------------------------------------
   🟪 Hook global : toutes les queries
---------------------------------------- */
export const useReservationStatsQuery = () => {
  const day = useReservationGraphiqueDayQuery();
  const week = useReservationGraphiqueWeekQuery();
  const month = useReservationGraphiqueMonthQuery();

  return { day, week, month };
};



export const useAllReservationOfMyvehiculeQuery = (id?: string) => {
  return useQuery<Reservation[]>({
    queryKey: ["reservation-of-Myvehicule-all", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID véhicule manquant");
      const { data } = await reservationAPI.get_all_reservations_of_Myvehicule(id);
      return data; // data est un tableau
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    retry: 1,
  });
};


export const useUpdateReservationPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status: "PENDING" | "VALIDATED" | "REJECTED" };
    }) => reservationPaymentAPI.update_payment_status(id, payload),

    onSuccess: () => {
      // 🔥 recharge les réservations pour refléter le paiement
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
    },
  });
};
