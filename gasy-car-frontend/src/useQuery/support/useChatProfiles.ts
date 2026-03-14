import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";
import type { User } from "@/types/userType";

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export function useChatProfiles(senderIds: string[], usersList: User[]) {
  const byIdBase = useMemo(() => {
    const map: Record<string, User> = {};
    for (const u of usersList ?? []) {
      if (u?.id) map[String(u.id)] = u;
      // @ts-ignore (au cas où)
      if ((u as any)?.user_id) map[String((u as any).user_id)] = u as any;
    }
    return map;
  }, [usersList]);

  const byEmailBase = useMemo(() => {
    const map: Record<string, User> = {};
    for (const u of usersList ?? []) {
      const email = String((u as any)?.email ?? "").trim().toLowerCase();
      if (email) map[email] = u;
    }
    return map;
  }, [usersList]);

  const uniqueIds = useMemo(() => {
    const set = new Set<string>();
    for (const x of senderIds ?? []) {
      const s = String(x ?? "").trim();
      if (s) set.add(s);
    }
    return Array.from(set);
  }, [senderIds]);

  const missing = useMemo(() => {
    return uniqueIds.filter((id) => isUuid(id) && !byIdBase[id]);
  }, [uniqueIds, byIdBase]);

  const detailQueries = useQueries({
    queries: missing.map((id) => ({
      queryKey: ["client-detail", id],
      enabled: !!id,
      queryFn: async () => {
        const res = await InstanceAxis.get(`/users/profile/${id}/`);
        return res.data as User;
      },
      staleTime: 5 * 60_000,
    })),
  });

  const details = useMemo(
    () => detailQueries.map((q) => q.data).filter(Boolean) as User[],
    [detailQueries]
  );

  const byId = useMemo(() => {
    const map: Record<string, User> = { ...byIdBase };
    for (const u of details) if (u?.id) map[String(u.id)] = u;
    return map;
  }, [byIdBase, details]);

  const byEmail = useMemo(() => {
    const map: Record<string, User> = { ...byEmailBase };
    for (const u of details) {
      const email = String((u as any)?.email ?? "").trim().toLowerCase();
      if (email) map[email] = u;
    }
    return map;
  }, [byEmailBase, details]);

  const isLoading = detailQueries.some((q) => q.isLoading);

  return { byId, byEmail, isLoading };
}
