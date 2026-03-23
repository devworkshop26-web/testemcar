import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export type AppNotification = {
  id: string;
  notification_type?: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  reservation?: string | null;
  vehicle?: string | null;
  vehicle_document?: string | null;
  action_url?: string | null;
  extra_data?: Record<string, any> | null;
};

type NotificationListResponse =
  | AppNotification[]
  | {
      count?: number;
      results?: AppNotification[];
    };

export const useNotificationsQuery = () => {
  return useQuery<NotificationListResponse>({
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