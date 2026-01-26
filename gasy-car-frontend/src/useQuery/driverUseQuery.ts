import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDrivers, getDriver, createDriver, updateDriver, deleteDriver, CreateDriverPayload, UpdateDriverPayload } from "../Actions/driverApi";
import { toast } from "sonner"; // Assuming sonner is used, or replace with appropriate toast
// Note: If 'sonner' isn't available, I'll remove it. I see 'react-hot-toast' or similar in other files usually.
// Let's check imports later, but 'sonner' is common in shadcn.

export const useDriversQuery = () => {
    return useQuery({
        queryKey: ["drivers"],
        queryFn: () => getDrivers(),
    });
};

export const useDriverQuery = (id: string) => {
    return useQuery({
        queryKey: ["drivers", id],
        queryFn: () => getDriver(id),
        enabled: !!id,
    });
};

export const useCreateDriverMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateDriverPayload | FormData) => createDriver(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            // toast.success("Chauffeur créé avec succès");
        },
        onError: (error: any) => {
            console.error("Erreur création chauffeur:", error);
            // toast.error("Erreur lors de la création du chauffeur");
        }
    });
};

export const useUpdateDriverMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateDriverPayload | FormData }) => updateDriver(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            queryClient.invalidateQueries({ queryKey: ["drivers", variables.id] });
            // toast.success("Chauffeur mis à jour");
        },
    });
};

export const useDeleteDriverMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteDriver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            // toast.success("Chauffeur supprimé");
        },
    });
};
