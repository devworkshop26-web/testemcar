import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserData, User } from '../types/userType';
import { authAPI } from '@/Actions/authApi';
import { usersAPI } from '@/Actions/usersApi';

export const usersUseQuery = () => {
  const queryClient = useQueryClient();

  // -------------------------------------------------------
  // QUERY — récupérer tous les users
  // -------------------------------------------------------
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers().then(res => res.data),
    enabled: false,
  });

  // -------------------------------------------------------
  // CREATE — prestataire
  // -------------------------------------------------------
  const createPrestataire = useMutation({
    mutationFn: (userData: CreateUserData) => authAPI.createPrestataire(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // -------------------------------------------------------
  // CREATE — admin
  // -------------------------------------------------------
  const createAdmin = useMutation({
    mutationFn: (userData: CreateUserData) => authAPI.createAdmin(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // -------------------------------------------------------
  // UPDATE — informations du user (texte)
  // -------------------------------------------------------
  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersAPI.updateUser(id, data),
    onSuccess: (res, variables) => {
      // Met à jour currentUser uniquement si l'utilisateur modifié est l'utilisateur connecté.
      const currentUser = queryClient.getQueryData<User>(['currentUser']);
      const editedUserId = String(variables.id);
      const currentUserId = currentUser?.id ? String(currentUser.id) : null;

      if (currentUserId && currentUserId === editedUserId) {
        queryClient.setQueryData(['currentUser'], res.data);
      }

      // rafraîchit les listes
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // -------------------------------------------------------
  // UPLOAD — photo de profil
  // -------------------------------------------------------
const uploadProfilePhoto = useMutation({
  mutationFn: ({ user_id, formData }: { user_id: string; formData: FormData }) =>
    usersAPI.uploadProfilePhoto(user_id, formData),

  onSuccess: (res) => {
    queryClient.setQueryData(["currentUser"], res.data.user);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

  // -------------------------------------------------------
  // DELETE — photo de profil
  // (fallback: si ton backend n’a pas la route, on met la photo à null via updateUser)
  // -------------------------------------------------------
  const deleteProfilePhoto = useMutation({
    mutationFn: (id: string) =>
      usersAPI.updateUser(id, { profile_photo_url: null }),
    onSuccess: (res) => {
      queryClient.setQueryData(['currentUser'], res.data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // -------------------------------------------------------
  // DELETE — user complet
  // -------------------------------------------------------
  const deleteUser = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      usersAPI.deleteUser(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery,
    createPrestataire,
    createAdmin,
    updateUser,
    uploadProfilePhoto,
    deleteProfilePhoto,
    deleteUser,
  };
};


// Hook simple pour récupérer les users
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers().then((res) => res.data),
  });
};
