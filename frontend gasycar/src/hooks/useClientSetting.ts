import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/Actions/usersApi";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useToast } from "@/components/ui/use-toast";

export interface ClientSettingsFormValues {
  first_name: string;
  last_name: string;
  phone: string;
  cin_number: string;
  address: string;
  date_of_birth: string;
  old_password?: string;
  new_password?: string;
  new_password_confirm: string;
}

export const useClientSettings = () => {
  const { user, isLoading: isUserLoading } = useCurentuser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<"profile" | "security">("profile");

  // Preview affichée
  const [previewPhoto, setPreviewPhoto] = useState("");

  // 🔥 Fichier réel envoyé au backend
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ✅ CIN (recto/verso) : preview + fichiers
  const [previewCinRecto, setPreviewCinRecto] = useState("");
  const [previewCinVerso, setPreviewCinVerso] = useState("");
  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);

  /* ---------------------------------------------------------
     📌 FORMULAIRE REACT-HOOK-FORM
  --------------------------------------------------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientSettingsFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      cin_number: "",
      address: "",
      date_of_birth: "",
      old_password: "",
      new_password: "",
      new_password_confirm: "", // ✅ AJOUT (sans rien supprimer)
    },
  });

  /* ---------------------------------------------------------
     🔐 MUTATION : CHANGEMENT MOT DE PASSE
  --------------------------------------------------------- */
  const changePasswordMutation = useMutation({
    mutationFn: (data: {
      old_password: string;
      new_password: string;
      new_password_confirm: string;
    }) => usersAPI.changePassword(data),

    onSuccess: () => {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès.",
      });

      // On vide uniquement les champs password
      reset({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });
    },

    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe.",
        variant: "destructive",
      });
    },
  });

  /* ---------------------------------------------------------
     📌 UPLOAD PHOTO → preview + sauvegarde du fichier
  --------------------------------------------------------- */
  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setPreviewPhoto("");
    setImageFile(null);
  };

  /* ---------------------------------------------------------
     ✅ UPLOAD CIN RECTO → preview + sauvegarde du fichier
  --------------------------------------------------------- */
  const handleCinRectoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinRectoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewCinRecto(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------------------------------------------------------
     ✅ UPLOAD CIN VERSO → preview + sauvegarde du fichier
  --------------------------------------------------------- */
  const handleCinVersoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinVersoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewCinVerso(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------------------------------------------------------
     ✅ SUPPRESSION BACKEND : une seule photo à la fois
  --------------------------------------------------------- */
  const deleteProfilePhoto = async () => {
    if (!user?.id) return;

    // Supprime uniquement "image" en base
    await usersAPI.clearProfilePhoto(user.id);

    // Mettre à jour l'UI
    handleDeletePhoto();

    // refresh user
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "Photo supprimée",
      description: "Votre photo de profil a été supprimée.",
    });
  };

  const deleteCinRecto = async () => {
    if (!user?.id) return;

    // Supprime uniquement "cin_photo_recto" en base
    await usersAPI.clearCinRecto(user.id);

    // Mettre à jour l'UI
    setPreviewCinRecto("");
    setCinRectoFile(null);

    // refresh user
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "CIN recto supprimé",
      description: "La photo CIN recto a été supprimée.",
    });
  };

  const deleteCinVerso = async () => {
    if (!user?.id) return;

    // Supprime uniquement "cin_photo_verso" en base
    await usersAPI.clearCinVerso(user.id);

    // Mettre à jour l'UI
    setPreviewCinVerso("");
    setCinVersoFile(null);

    // refresh user
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "CIN verso supprimé",
      description: "La photo CIN verso a été supprimée.",
    });
  };

  /* ---------------------------------------------------------
     📌 MUTATION UPDATE (FormData si image)
  --------------------------------------------------------- */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => usersAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont bien été enregistrées.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    },
  });

  /* ---------------------------------------------------------
     📌 CHARGER LES DONNÉES DU USER + image instantanée
  --------------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    // Si user.image existe → afficher direct !
    if (user.image) {
      const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
      const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");
      setPreviewPhoto(`${BASE_URL}${user.image}`);
    }

    // ✅ charger CIN recto/verso si le backend les renvoie
    const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
    const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");

    if ((user as any).cin_photo_recto) {
      setPreviewCinRecto(`${BASE_URL}${(user as any).cin_photo_recto}`);
    } else {
      setPreviewCinRecto("");
    }

    if ((user as any).cin_photo_verso) {
      setPreviewCinVerso(`${BASE_URL}${(user as any).cin_photo_verso}`);
    } else {
      setPreviewCinVerso("");
    }

    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      cin_number: user.cin_number || "",
      address: user.address || "",
      date_of_birth: user.date_of_birth || "",
      old_password: "",
      new_password: "",
      new_password_confirm: "",
    });
  }, [user, reset]);

  /* ---------------------------------------------------------
     📌 SUBMIT FINAL
  --------------------------------------------------------- */
  const onSubmit = handleSubmit(async (values) => {
    if (!user?.id) return;

    // 🔐 MODE SÉCURITÉ (CHANGEMENT MOT DE PASSE)
    if (section === "security") {
      await changePasswordMutation.mutateAsync({
        old_password: values.old_password || "",
        new_password: values.new_password || "",
        new_password_confirm: values.new_password_confirm,
      });
      return;
    }

    // 👤 MODE PROFIL (CODE EXISTANT INCHANGÉ)
    let payload: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      cin_number: values.cin_number,
      address: values.address,
      date_of_birth: values.date_of_birth,
    };

    let finalData: any = payload;

    // 📌 Si une image est présente → construire FormData
    // ✅ Si CIN recto/verso sont présents → FormData aussi
    if (imageFile || cinRectoFile || cinVersoFile) {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      if (imageFile) formData.append("image", imageFile);
      if (cinRectoFile) formData.append("cin_photo_recto", cinRectoFile);
      if (cinVersoFile) formData.append("cin_photo_verso", cinVersoFile);

      finalData = formData;
    }

    await updateMutation.mutateAsync({
      id: user.id,
      data: finalData,
    });
  });

  return {
    user,
    section,
    setSection,
    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,

    // ✅ CIN exports
    previewCinRecto,
    previewCinVerso,
    handleCinRectoUpload,
    handleCinVersoUpload,

    // ✅ suppression backend
    deleteProfilePhoto,
    deleteCinRecto,
    deleteCinVerso,

    register,
    onSubmit,
    errors,
    isSubmitting,
    isUserLoading,
  };
};
