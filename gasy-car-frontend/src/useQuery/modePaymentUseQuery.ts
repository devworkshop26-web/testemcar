import { modePaymentAPI } from "@/Actions/modePaymentApi";
import {
  CreateModePaymentPayload,
  ModePayment,
  UpdateModePaymentPayload,
} from "@/types/modePayment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

const buildFormData = (payload: CreateModePaymentPayload | UpdateModePaymentPayload) => {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.numero !== undefined) {
    formData.append("numero", payload.numero);
  }

  if (payload.operateur !== undefined) {
    formData.append("operateur", payload.operateur ?? "");
  }

  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const useModePaymentsQuery = () => {
  return useQuery<ModePayment[]>({
    queryKey: ["mode-payments-all"],
    queryFn: async () => {
      const { data } = await modePaymentAPI.get_all_mode_payments();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

export const useCreateModePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateModePaymentPayload) => {
      const formData = buildFormData(payload);
      return modePaymentAPI.create_mode_payment(formData).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mode-payments-all"] });
    },
  });
};

export const useUpdateModePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateModePaymentPayload;
    }) => {
      const formData = buildFormData(payload);
      return modePaymentAPI.update_mode_payment(id, formData).then((res) => res.data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["mode-payments-all"] });
      queryClient.invalidateQueries({
        queryKey: ["mode-payments-one", id],
      });
    },
  });
};

export const useDeleteModePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      modePaymentAPI.delete_mode_payment(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mode-payments-all"] });
    },
  });
};
