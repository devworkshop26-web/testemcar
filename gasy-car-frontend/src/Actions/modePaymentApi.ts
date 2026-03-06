import { InstanceAxis } from "@/helper/InstanceAxios";
import { ModePayment } from "@/types/modePayment";

const BASE_URL = "/modepayment/mode-payments/";

export const modePaymentAPI = {
  get_all_mode_payments: async () => {
    return await InstanceAxis.get<ModePayment[]>(BASE_URL);
  },

  get_one_mode_payment: async (id: string) => {
    return await InstanceAxis.get<ModePayment>(`${BASE_URL}${id}/`);
  },

  create_mode_payment: async (payload: FormData) => {
    return await InstanceAxis.post<ModePayment>(BASE_URL, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update_mode_payment: async (id: string, payload: FormData) => {
    return await InstanceAxis.put<ModePayment>(`${BASE_URL}${id}/`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete_mode_payment: async (id: string) => {
    return await InstanceAxis.delete<void>(`${BASE_URL}${id}/`);
  },
};
