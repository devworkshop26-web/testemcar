import { adminAPI } from "@/Actions/adminApi";
import { User } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";

export const adminUseQuery = () => {
  // all users query
  const { data: usersData } = useQuery<Array<User>>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const { data } = await adminAPI.get_all_users();

      // sécurité si data n'est pas un tableau
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 60 * 24 * 365, // 1 an mais écrit propre
    retry: 2,
  });

  //   get all clients
  const { data: clientData } = useQuery<Array<User>>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await adminAPI.get_all_clients();
      return res.data;
    },
    staleTime: 31536000000,
  });

  //   get all support
  const { data: supportData } = useQuery<Array<User>>({
    queryKey: ["supports"],
    queryFn: async () => {
      const res = await adminAPI.get_all_support();
      return res.data;
    },
    staleTime: 31536000000,
  });

  //   get all prestataire
  const { data: prestataireData } = useQuery<Array<User>>({
    queryKey: ["prestataire"],
    queryFn: async () => {
      const res = await adminAPI.get_all_prestataire();
      return res.data;
    },
    staleTime: 31536000000,
  });

  return {
    usersData,
    clientData,
    supportData,
    prestataireData,
  };
};
