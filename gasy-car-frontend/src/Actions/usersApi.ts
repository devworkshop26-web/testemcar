import { InstanceAxis } from "@/helper/InstanceAxios";
import { User } from "@/types/userType";

export const usersAPI = {
  // Lister tous les utilisateurs
  getUsers: () => InstanceAxis.get("/users/users-all/"),

  // Récupérer un utilisateur
  getUser: (id: string): Promise<{ data: User }> =>
    InstanceAxis.get(`/users/profile/${id}/`),

  // Mettre à jour un utilisateur
  updateUser: (id: string, userData: any): Promise<{ data: User }> =>
    InstanceAxis.put(`/users/profile/${id}/`, userData, {
      headers: {
        "Content-Type":
          userData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    }),

  // Supprimer un utilisateur
  deleteUser: (id: string): Promise<{ data: { message: string } }> =>
    InstanceAxis.delete(`/users/profile/${id}/`),

  // Upload photo profil
  uploadProfilePhoto: (user_id: string, formData: FormData) =>
    InstanceAxis.post(`/users/profile/${user_id}/photo/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Upload CIN
  uploadCinPhoto: (formData: FormData) =>
    InstanceAxis.post("/users/profile/upload-cin-photo/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 🔥 SUPPRIMER UNE PHOTO — méthode compatible backend (PUT image=null)
  clearProfilePhoto: (user_id: string) =>
    InstanceAxis.put(
      `/users/profile/${user_id}/`,
      { image: null },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),

  // ✅ SUPPRIMER CIN RECTO (SEULEMENT recto)
  clearCinRecto: (user_id: string) =>
    InstanceAxis.put(
      `/users/profile/${user_id}/`,
      { cin_photo_recto: null },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),

  // ✅ SUPPRIMER CIN VERSO (SEULEMENT verso)
  clearCinVerso: (user_id: string) =>
    InstanceAxis.put(
      `/users/profile/${user_id}/`,
      { cin_photo_verso: null },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),

  // ✅ 🔐 CHANGER LE MOT DE PASSE
  changePassword: (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }) =>
    InstanceAxis.post("/users/password/change/", data),
};
