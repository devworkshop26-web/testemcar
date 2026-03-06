// src/Actions/bookingApi.ts
import { InstanceAxis } from "@/helper/InstanceAxios";

export type BookingReservation = {
  id: string;
  reference?: string;
  start_datetime?: string;
  end_datetime?: string;
  vehicle_data?: any;
};

async function fetchFirstOk<T>(paths: string[]): Promise<T> {
  let lastErr: any = null;
  for (const p of paths) {
    try {
      const res = await InstanceAxis.get<T>(p);
      return res.data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export const bookingAPI = {
  getAllReservations: async (): Promise<BookingReservation[]> => {
    // BaseURL de InstanceAxis est souvent ".../api"
    // donc on tente d'abord sans "/api"
    return fetchFirstOk<BookingReservation[]>([
      "/bookings/reservations/",
      "/api/bookings/reservations/",
    ]);
  },
};
