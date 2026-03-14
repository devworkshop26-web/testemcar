import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "@/Actions/usersApi";

export const useAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await usersAPI.getUsers();
      return data; // liste complète
    },
  });
