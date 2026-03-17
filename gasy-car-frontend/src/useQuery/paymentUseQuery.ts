import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentAPI } from "@/Actions/paymentApi";
import { UploadPaymentProofPayload } from "@/types/reservationsType";

export const useUploadPaymentProofMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadPaymentProofPayload) =>
      paymentAPI.upload_proof(payload).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
      queryClient.invalidateQueries({ queryKey: ["reservation-one", variables.reservation_id] });
    },
  });
};
