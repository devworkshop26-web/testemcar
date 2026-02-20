import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymenReservationtApi, paymentApi } from "@/Actions/ReservatioPaymentApi";
import { CreateReservationPaymentPayload, UpdateReservationPaymentPayload } from "@/types/reservationsType";
import { toast } from "sonner";

export const useReservationPaymentsQuery = () => {
  return useQuery({
    queryKey: ["reservation-payments"],
    queryFn: paymentApi.getAll,
  });
};

export const useReservationPaymentQuery = (id: string) => {
  return useQuery({
    queryKey: ["reservation-payment", id],
    queryFn: () => paymentApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateReservationPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationPaymentPayload) => paymentApi.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation-payments"] });
      queryClient.invalidateQueries({ queryKey: ["reservation-one", variables.reservation] });
      queryClient.invalidateQueries({ queryKey: ["reservations-all"] });
      toast.success("Paiement soumis avec succès !");
    },
    onError: (error: any) => {
      console.error("Error creating payment:", error);
      toast.error("Erreur lors de la soumission du paiement.");
    },
  });
};

export const useUpdateReservationPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationPaymentPayload }) =>
      paymentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservation-payments"] });
      toast.success("Paiement mis à jour avec succès !");
    },
    onError: (error: any) => {
      console.error("Error updating payment:", error);
      toast.error("Erreur lors de la mise à jour du paiement.");
    },
  });
};


export const useSendPaymentLink = () => {
  return useMutation({
    mutationFn: paymenReservationtApi.sendLinkToEmail,
  });
};

