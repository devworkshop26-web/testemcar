import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleDocumentsAPI } from "@/Actions/vehicleDocumentsApi";
import { VehicleDocument } from "@/types/vehicleDocumentsType";

export const useVehicleDocumentsQuery = (vehicleId?: string) => {
  return useQuery<VehicleDocument[]>({
    queryKey: ["vehicle-documents", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];
      const { data } = await vehicleDocumentsAPI.get_vehicle_documents(vehicleId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!vehicleId,
  });
};

export const useCreateVehicleDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      vehicleDocumentsAPI.create_document(formData).then((res) => res.data),
    onSuccess: (_, variables) => {
      const vehicleId = variables.get("vehicle") as string;
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });
};

export const useUpdateVehicleDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      vehicleDocumentsAPI.update_document(id, formData).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", data.vehicle] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", data.vehicle] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });
};

export const useReviewVehicleDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action,
      rejection_reason,
    }: {
      id: string;
      action: "approve" | "reject";
      rejection_reason?: string;
    }) =>
      vehicleDocumentsAPI
        .review_document(id, { action, rejection_reason })
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", data.vehicle] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", data.vehicle] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });
};

export const useDeleteVehicleDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicleId }: { id: string; vehicleId: string }) =>
      vehicleDocumentsAPI.delete_document(id).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    },
  });
};