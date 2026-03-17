import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateReservationPaymentPayload, ReservationPayment, UpdateReservationPaymentPayload } from "@/types/reservationsType";

export const paymentApi = {
  getAll: async () => {
    const res = await InstanceAxis.get<ReservationPayment[]>("/bookings/reservation-payment/");
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await InstanceAxis.get<ReservationPayment>(`/bookings/reservation-payment/${id}/`);
    return res.data;
  },

  create: async (data: CreateReservationPaymentPayload) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    const res = await InstanceAxis.post("/bookings/reservation-payment/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: string, data: UpdateReservationPaymentPayload) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    const res = await InstanceAxis.patch(`/bookings/reservation-payment/${id}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await InstanceAxis.delete(`/bookings/reservation-payment/${id}/`);
    return res.data;
  },
};



export const paymenReservationtApi = {
  /**
   * ENVOYER LE LIEN DE PAIEMENT AU MAIL DU CLIENT
   * POST /bookings/send-link-payment/
   */
  sendLinkToEmail: async (payload: {
    methode_payment: string;
    reservation_id: string;
  }) => {
    const res = await InstanceAxis.post("/bookings/send-link-payment/", payload);
    return res.data;
  },

  /**
   * SUBMIT PAYMENT (form with proof)
   * POST multipart -> /bookings/payment/submit/
   */
  submitPayment: async (data: {
    reservation_id: string;
    mode: string;
    reason: string;
    proof_image: File;
  }) => {
    const form = new FormData();
    form.append("reservation", data.reservation_id);
    form.append("mode", data.mode);
    form.append("reason", data.reason);
    form.append("proof_image", data.proof_image);

    const res = await InstanceAxis.post("/bookings/payment/submit/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },
};
