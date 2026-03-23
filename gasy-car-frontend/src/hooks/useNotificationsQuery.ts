import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export const useNotificationsQuery = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await InstanceAxis.get("/notifications/");
            return response.data;
        },
    });
};

export const useMarkAllReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await InstanceAxis.post("/notifications/mark_all_read/");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useMarkReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await InstanceAxis.patch(`/notifications/${id}/mark_read/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
