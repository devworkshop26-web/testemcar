import { InstanceAxis } from "@/helper/InstanceAxios";
import { User } from "@/types/userType";

export const usersAPI = {
  getUsers: () => InstanceAxis.get("/users/users-all/"),

  getUser: (id: string): Promise<{ data: User }> =>
    InstanceAxis.get(`/users/profile/${id}/`),

  updateUser: (
    id: string,
    userData: FormData | Record<string, any>
  ): Promise<{ data: User }> => {
    if (userData instanceof FormData) {
      return InstanceAxis.patch(`/users/profile/${id}/`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return InstanceAxis.patch(`/users/profile/${id}/`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  deleteUser: (
    id: string,
    password: string
  ): Promise<{ data: { message: string } }> =>
    InstanceAxis.delete(`/users/profile/${id}/`, {
      data: { password },
    }),

  uploadProfilePhoto: (user_id: string, formData: FormData) =>
    InstanceAxis.post(`/users/profile/${user_id}/photo/`, formData),

  uploadCinPhoto: (formData: FormData) =>
    InstanceAxis.post("/users/profile/upload-cin-photo/", formData),

  clearProfilePhoto: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, { image: null }),

  clearCinRecto: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, { cin_photo_recto: null }),

  clearCinVerso: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, { cin_photo_verso: null }),

  clearResidenceCertificate: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, { residence_certificate: null }),

  clearDrivingLicenseRecto: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, {
      permis_conduire: null,
      permis_conduire_recto: null,
    }),

  clearDrivingLicenseVerso: (user_id: string) =>
    InstanceAxis.patch(`/users/profile/${user_id}/`, {
      permis_conduire_verso: null,
    }),

  changePassword: (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }) => InstanceAxis.post("/users/password/change/", data),
};
