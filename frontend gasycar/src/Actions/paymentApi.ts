import { InstanceAxis } from "@/helper/InstanceAxios";
import { ReservationPayment, UploadPaymentProofPayload } from "@/types/reservationsType";

export const paymentAPI = {
  upload_proof: async (payload: UploadPaymentProofPayload) => {
    const formData = new FormData();
    formData.append("proof_image", payload.proof_image);
    formData.append("reservation", payload.reservation_id);
    
    return await InstanceAxis.post<ReservationPayment>(
      `/bookings/payments/upload-proof/`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
