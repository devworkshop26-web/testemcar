// src/useQuery/support/useClientDetail.ts

import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useClientDetail(id: string) {
  return useQuery({
    queryKey: ["client-detail", id],
    queryFn: async () => {
      const res = await InstanceAxis.get(`/users/profile/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
}
