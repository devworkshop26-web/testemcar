import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/Actions/authApi";
import type { User } from "@/types/userType";
import { accessTokenKey } from "@/helper/InstanceAxios";

export const useCurrentUserQuery = () => {
  const token = localStorage.getItem(accessTokenKey);

  const query = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await authAPI.getCurrentUser();
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  return {
    ...query,
    isLoading: !!token && query.isLoading,
    isAuthenticated: !!query.data && !query.isError
  };
};
