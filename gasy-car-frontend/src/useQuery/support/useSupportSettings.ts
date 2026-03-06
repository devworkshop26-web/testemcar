import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersAPI } from "@/Actions/usersApi";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useToast } from "@/components/ui/use-toast";

type SectionType = "personal" | "security";

export const useSupportSettings = () => {
  const { user } = useCurentuser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<SectionType>("personal");

  // PHOTO
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      cin_number: "",
      date_of_birth: "",
      old_password: "",
      new_password: "",
    },
  });

  // Remplir infos user
  useEffect(() => {
    if (!user) return;

    if (user.image) {
      const BASE = (InstanceAxis.defaults.baseURL || "").replace("/api", "");
      setPreviewPhoto(`${BASE}${user.image}`);
    }

    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      cin_number: user.cin_number || "",
      date_of_birth: user.date_of_birth || "",
      old_password: "",
      new_password: "",
    });
  }, [user, reset]);

  // 🔥 Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (id: string) => usersAPI.clearProfilePhoto(id),
    onSuccess: () => {
      setPreviewPhoto("");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Photo supprimée",
        description: "Votre photo de profil a été supprimée.",
      });
    },
  });

  // Photo preview
  const handlePhotoUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);

    const reader = new FileReader();
    reader.onload = () => setPreviewPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleDeletePhoto = () => {
    if (!user?.id) return;
    deletePhotoMutation.mutate(user.id);
  };

  // Submit infos support
  const onSubmit = handleSubmit(async (values) => {
    if (!user?.id) return;

    let payload: any = values;

    // Image → FormData
    let finalData = payload;

    if (imageFile) {
      const formData = new FormData();
      Object.keys(payload).forEach((k) => formData.append(k, payload[k]));
      formData.append("image", imageFile);
      finalData = formData;
    }

    await usersAPI.updateUser(user.id, finalData);
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "Enregistré",
      description: "Vos informations ont été mises à jour.",
    });
  });

  return {
    user,
    section,
    setSection,
    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,
    register,
    onSubmit,
    errors,
    isSubmitting,
  };
};
