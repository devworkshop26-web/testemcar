import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginData, CreateUserData, UserRole } from "../types/userType";
import { authAPI } from "@/Actions/authApi";
import { useCurrentUserQuery } from "./useCurrentUserQuery";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Mutation pour la connexion
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginData) => authAPI.login(credentials),
    onSuccess: (data) => {
      // Mettre à jour le cache avec l'utilisateur connecté
      queryClient.setQueryData(["currentUser"], data.data.user);
    },
  });

  // Mutation pour l'inscription
  const registerMutation = useMutation({
    mutationFn: (userData: CreateUserData) => authAPI.register(userData),
  });

  // Mutation pour la déconnexion
  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Supprimer l'utilisateur du cache
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    },
  });

  // Use the unified query hook
  const currentUserQuery = useCurrentUserQuery();

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    currentUser: currentUserQuery,
  };
};

export function useCurentuser() {
  const { data: user, isLoading, isError, isAuthenticated } = useCurrentUserQuery();
  const role = (user?.role ?? null) as UserRole | null;

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    isError,
  };
}
