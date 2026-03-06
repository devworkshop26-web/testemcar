// src/Actions/vehiculePhotosApi.ts
import { InstanceAxis } from "@/helper/InstanceAxios";

export const uploadVehiclePhotos = (vehicleId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("photos", f));

  return InstanceAxis.post(
    `/vehicule/vehicule/${vehicleId}/photos/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const deleteVehiclePhoto = (photoId: string) => {
  return InstanceAxis.delete(`/vehicule/vehicle-photo/${photoId}/`);
};
