import { InstanceAxis } from "@/helper/InstanceAxios";

export interface ReservationPayment {
  id: string;
  reservation: string;
  status: "PENDING" | "VALIDATED" | "REJECTED";
  proof_image?: string;
  reason?: string;
}

export const reservationPaymentAPI = {
  // GET /bookings/reservation-payment/
  get_all_payments: async () => {
    return await InstanceAxis.get<ReservationPayment[]>(
      "/bookings/reservation-payment/"
    );
  },

  // PATCH /bookings/reservation-payment/:id/
  update_payment_status: async (
    id: string,
    payload: { status: "PENDING" | "VALIDATED" | "REJECTED" }
  ) => {
    return await InstanceAxis.patch<ReservationPayment>(
      `/bookings/reservation-payment/${id}/`,
      payload
    );
  },
};
