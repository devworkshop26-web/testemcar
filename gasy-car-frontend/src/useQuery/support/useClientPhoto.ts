import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { usersAPI } from "@/Actions/usersApi";

export const useClientPhoto = (client: any) => {
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState("");

  // Charger photo initiale
  useEffect(() => {
    if (client?.image) {
      const BASE = (InstanceAxis.defaults.baseURL || "").replace("/api", "");
      setPreview(`${BASE}${client.image}`);
    }
  }, [client]);

  // 🔥 Upload photo
  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      return usersAPI.updateUser(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientDetail"] });
    },
  });

  // 🔥 Delete photo
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersAPI.clearProfilePhoto(id),
    onSuccess: () => {
      setPreview("");
      queryClient.invalidateQueries({ queryKey: ["clientDetail"] });
    },
  });

  const uploadPhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !client?.id) return;

    // Preview immédiate
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    uploadMutation.mutate({ id: client.id, file });
  };


  const deletePhoto = () => {
    if (!client?.id) return;
    deleteMutation.mutate(client.id);
  };

  return { preview, uploadPhoto, deletePhoto };
};
