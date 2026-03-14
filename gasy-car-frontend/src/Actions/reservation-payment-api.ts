import { InstanceAxis } from "@/helper/InstanceAxios";
import type { PaymentStatus, ReservationPayment } from "@/types/reservationsType";

export const reservationPaymentAPI = {
  get_all_payments: async () => {
    return await InstanceAxis.get<ReservationPayment[]>("/bookings/reservation-payment/");
  },

  update_payment_status: async (
    id: string,
    payload: { status: PaymentStatus }
  ) => {
    return await InstanceAxis.patch<ReservationPayment>(
      `/bookings/reservation-payment/${id}/`,
      payload
    );
  },
};