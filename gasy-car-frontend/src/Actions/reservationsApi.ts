import { InstanceAxis } from "@/helper/InstanceAxios";
import type {
  CreateReservationPayload,
  UpdateReservationPayload,
  ReservationService,
  CreateReservationServicePayload,
  UpdateReservationServicePayload,
  ReservationGraphiqueDay,
  ReservationGraphiqueWeek,
  ReservationGraphiqueMonth,
  ReservationPricingConfig,
  UpdateReservationPricingConfigPayload,
  ReservationTransitionAction,
} from "@/types/reservationsType";
import { Reservation } from "@/types/reservationsType";

export const reservationAPI = {
  get_all_reservations: async () => {
    return await InstanceAxis.get<Reservation[]>("/bookings/reservations/");
  },

  get_one_reservation: async (id: string) => {
    return await InstanceAxis.get<Reservation>(`/bookings/reservations/${id}/`);
  },

  create_reservation: async (payload: CreateReservationPayload) => {
    return await InstanceAxis.post<Reservation>("/bookings/reservations/", payload);
  },

  update_reservation: async (id: string, payload: UpdateReservationPayload) => {
    return await InstanceAxis.patch<Reservation>(`/bookings/reservations/${id}/`, payload);
  },

  delete_reservation: async (id: string) => {
    return await InstanceAxis.delete<void>(`/bookings/reservations/${id}/`);
  },

  transition_reservation: async (id: string, action: ReservationTransitionAction) => {
    return await InstanceAxis.post<Reservation>(`/bookings/reservations/${id}/${action}/`);
  },

  delete_all_reservations: async (password: string) => {
    return await InstanceAxis.post<{ message: string; deleted_count: number }>(
      "/bookings/reservations/delete-all/",
      { password }
    );
  },

  get_reservation_pricing_config: async () => {
    return await InstanceAxis.get<ReservationPricingConfig>("/bookings/pricing-config/");
  },

  update_reservation_pricing_config: async (payload: UpdateReservationPricingConfigPayload) => {
    return await InstanceAxis.patch<ReservationPricingConfig>("/bookings/pricing-config/", payload);
  },

  get_all_reservations_of_Myvehicule: async (user_id: string) => {
    return await InstanceAxis.get<Reservation[]>(`/bookings/owner/${user_id}/reservations/`);
  },

  get_all_client_of_Myvehicule: async (user_id: string) => {
    return await InstanceAxis.get<Reservation[]>(`/bookings/owner/${user_id}/reservations/`);
  },
};

export const reservationServiceAPI = {
  get_all_services: async (reservationId?: string) => {
    return await InstanceAxis.get<ReservationService[]>(
      "/bookings/reservation-services/",
      {
        params: reservationId ? { reservation: reservationId } : undefined,
      }
    );
  },

  get_one_service: async (id: string) => {
    return await InstanceAxis.get<ReservationService>(`/bookings/reservation-services/${id}/`);
  },

  create_service: async (payload: CreateReservationServicePayload) => {
    return await InstanceAxis.post<ReservationService>("/bookings/reservation-services/", payload);
  },

  update_service: async (id: string, payload: UpdateReservationServicePayload) => {
    return await InstanceAxis.put<ReservationService>(`/bookings/reservation-services/${id}/`, payload);
  },

  delete_service: async (id: string) => {
    return await InstanceAxis.delete<void>(`/bookings/reservation-services/${id}/`);
  },

  get_reservation_of_client: async (id: string) => {
    return await InstanceAxis.get<Reservation[]>(`/bookings/user/${id}/reservations/`);
  },
};

export const reservationGraphiqueAPI = {
  get_reservation_graphique_day: async () => {
    return await InstanceAxis.get<ReservationGraphiqueDay[]>(`/bookings/stats/day/`);
  },
  get_reservation_graphique_week: async () => {
    return await InstanceAxis.get<ReservationGraphiqueWeek[]>(`/bookings/stats/week/`);
  },
  get_reservation_graphique_month: async () => {
    return await InstanceAxis.get<ReservationGraphiqueMonth[]>(`/bookings/stats/month/`);
  },
};