import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/Actions/usersApi";
import { prestataireAPI } from "@/Actions/prestataireApi";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/userType";

export interface PrestataireSettingsFormValues {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  cin_number: string;
  date_of_birth: string;

  company_name: string;
  nif: string;
  stat: string;
  rcs: string;
  cif: string;
  company_phone: string;
  secondary_phone: string;
  city: string;
  company_address: string;
  company_email: string;

  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

interface PrestataireProfile {
  id: string;
  company_name?: string;
  logo?: string;
  nif?: string;
  stat?: string;
  rcs?: string;
  cif?: string;
  phone?: string;
  secondary_phone?: string;
  email?: string;
  address?: string;
  city?: string;
}

const normalizePhoneForDisplay = (value?: string | null) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");

  if (!digits) return raw;

  if (digits.startsWith("00261")) {
    const rest = digits.slice(5);
    return rest.length === 9 ? `0${rest}` : raw;
  }

  if (digits.startsWith("261")) {
    const rest = digits.slice(3);
    return rest.length === 9 ? `0${rest}` : raw;
  }

  if (digits.length === 9) {
    return `0${digits}`;
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    return digits;
  }

  return raw;
};

const normalizeDateForInput = (value?: string | null) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.slice(0, 10);
};

const getMediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }
  const rawBaseUrl = String(InstanceAxis.defaults.baseURL || "");
  const baseUrl = rawBaseUrl.replace("/api", "").replace(/\/+$/, "");
  return `${baseUrl}${value}`;
};

export const usePrestataireSettings = () => {
  const { user } = useCurentuser() as { user: User | null };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<"personal" | "company" | "security">("personal");
  const [companyEnabled, setCompanyEnabled] = useState(false);

  const [previewPhoto, setPreviewPhoto] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [previewCinRecto, setPreviewCinRecto] = useState("");
  const [previewCinVerso, setPreviewCinVerso] = useState("");
  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState("");

  const [nifFile, setNifFile] = useState<File | null>(null);
  const [statFile, setStatFile] = useState<File | null>(null);
  const [rcsFile, setRcsFile] = useState<File | null>(null);
  const [cifFile, setCifFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PrestataireSettingsFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      cin_number: "",
      date_of_birth: "",

      company_name: "",
      nif: "",
      stat: "",
      rcs: "",
      cif: "",
      company_phone: "",
      secondary_phone: "",
      city: "",
      company_address: "",
      company_email: "",

      old_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  const { data: prestataireData } = useQuery<PrestataireProfile | null>({
    queryKey: ["myPrestataireProfile"],
    queryFn: async () => {
      try {
        const res = await prestataireAPI.getMyProfile();
        return res.data;
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user,
    retry: false,
  });

  const companyChoiceMutation = useMutation({
    mutationFn: async (isCompany: boolean) => {
      if (!user?.id) {
        throw new Error("Utilisateur introuvable");
      }
      return usersAPI.updateUser(user.id, { is_company: isCompany });
    },
    onSuccess: async (_response, isCompany) => {
      setCompanyEnabled(isCompany);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      if (!isCompany) {
        setSection("personal");
      }

      toast({
        title: isCompany ? "Mode entreprise activé" : "Mode entreprise désactivé",
        description: isCompany
          ? "Les paramètres entreprise sont maintenant disponibles."
          : "Les paramètres entreprise ont été masqués.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre choix entreprise.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, any> }) =>
      usersAPI.updateUser(id, data),
    onSuccess: async () => {
      setImageFile(null);
      setCinRectoFile(null);
      setCinVersoFile(null);

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast({
        title: "Modification enregistrée",
        description: "Les informations ont bien été mises à jour.",
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

  const prestataireMutation = useMutation({
    mutationFn: (data: FormData | Record<string, any>) => {
      if (prestataireData) {
        return prestataireAPI.updateMyProfile(data);
      }
      return prestataireAPI.createPrestataire(data);
    },
    onSuccess: async () => {
      setLogoFile(null);
      setNifFile(null);
      setStatFile(null);
      setRcsFile(null);
      setCifFile(null);

      setCompanyEnabled(true);

      await queryClient.invalidateQueries({ queryKey: ["myPrestataireProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast({
        title: "Informations entreprise enregistrées",
        description: "Votre profil prestataire a été mis à jour.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les informations entreprise.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: {
      old_password: string;
      new_password: string;
      new_password_confirm: string;
    }) => usersAPI.changePassword(data),
    onSuccess: () => {
      const currentValues = getValues();
      reset({
        ...currentValues,
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Impossible de modifier votre mot de passe.";

      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleCinRectoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinRectoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewCinRecto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCinVersoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinVersoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewCinVerso(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNifUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setNifFile(e.target.files?.[0] || null);
  };

  const handleStatUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setStatFile(e.target.files?.[0] || null);
  };

  const handleRcsUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setRcsFile(e.target.files?.[0] || null);
  };

  const handleCifUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setCifFile(e.target.files?.[0] || null);
  };

  const deleteProfilePhoto = async () => {
    if (!user?.id) return;

    await usersAPI.clearProfilePhoto(user.id);
    handleDeletePhoto();
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "Photo supprimée",
      description: "Votre photo de profil a été supprimée.",
    });
  };

  const deleteCinRecto = async () => {
    if (!user?.id) return;

    await usersAPI.clearCinRecto(user.id);
    setPreviewCinRecto("");
    setCinRectoFile(null);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "CIN recto supprimé",
      description: "La photo CIN recto a été supprimée.",
    });
  };

  const deleteCinVerso = async () => {
    if (!user?.id) return;

    await usersAPI.clearCinVerso(user.id);
    setPreviewCinVerso("");
    setCinVersoFile(null);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "CIN verso supprimé",
      description: "La photo CIN verso a été supprimée.",
    });
  };

  useEffect(() => {
    if (!user) return;

    const hasCompany = Boolean(user.is_company || prestataireData);
    setCompanyEnabled(hasCompany);

    setPreviewPhoto(user.image ? getMediaUrl(user.image) : "");
    setPreviewCinRecto(user.cin_photo_recto ? getMediaUrl(user.cin_photo_recto) : "");
    setPreviewCinVerso(user.cin_photo_verso ? getMediaUrl(user.cin_photo_verso) : "");
    setPreviewLogo(prestataireData?.logo ? getMediaUrl(prestataireData.logo) : "");

    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: normalizePhoneForDisplay(user.phone),
      email: user.email || "",
      address: user.address || "",
      cin_number: user.cin_number || "",
      date_of_birth: normalizeDateForInput(user.date_of_birth),

      company_name: prestataireData?.company_name || "",
      nif: prestataireData?.nif || "",
      stat: prestataireData?.stat || "",
      rcs: prestataireData?.rcs || "",
      cif: prestataireData?.cif || "",
      company_phone: normalizePhoneForDisplay(prestataireData?.phone),
      secondary_phone: normalizePhoneForDisplay(prestataireData?.secondary_phone),
      city: prestataireData?.city || "",
      company_address: prestataireData?.address || "",
      company_email: prestataireData?.email || "",

      old_password: "",
      new_password: "",
    });
  }, [user, prestataireData, reset]);

  const saveCompanyChoice = async (isCompany: boolean) => {
    await companyChoiceMutation.mutateAsync(isCompany);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.id) return;

    if (section === "company") {
      const formData = new FormData();

      formData.append("company_name", values.company_name || "");
      formData.append("nif", values.nif || "");
      formData.append("stat", values.stat || "");
      formData.append("rcs", values.rcs || "");
      formData.append("cif", values.cif || "");
      formData.append("phone", normalizePhoneForDisplay(values.company_phone));
      formData.append("secondary_phone", normalizePhoneForDisplay(values.secondary_phone));
      formData.append("email", values.company_email || "");
      formData.append("address", values.company_address || "");
      formData.append("city", values.city || "");

      if (logoFile) formData.append("logo", logoFile);
      if (nifFile) formData.append("nif_document", nifFile);
      if (statFile) formData.append("stat_document", statFile);
      if (rcsFile) formData.append("rcs_document", rcsFile);
      if (cifFile) formData.append("cif_document", cifFile);

      await prestataireMutation.mutateAsync(formData);
      return;
    }

    if (section === "security") {
      if (!values.old_password?.trim()) {
        toast({
          title: "Erreur",
          description: "L'ancien mot de passe est obligatoire.",
          variant: "destructive",
        });
        return;
      }

      if (!values.new_password?.trim()) {
        toast({
          title: "Erreur",
          description: "Le nouveau mot de passe est obligatoire.",
          variant: "destructive",
        });
        return;
      }

      if (!values.new_password_confirm?.trim()) {
        toast({
          title: "Erreur",
          description: "La confirmation du mot de passe est obligatoire.",
          variant: "destructive",
        });
        return;
      }

      if (values.new_password !== values.new_password_confirm) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas.",
          variant: "destructive",
        });
        return;
      }

      await changePasswordMutation.mutateAsync({
        old_password: values.old_password,
        new_password: values.new_password,
        new_password_confirm: values.new_password_confirm,
      });
      return;
    }

    const payload: Record<string, any> = {
      first_name: values.first_name || "",
      last_name: values.last_name || "",
      phone: normalizePhoneForDisplay(values.phone),
      address: values.address || "",
      cin_number: values.cin_number || "",
      date_of_birth: values.date_of_birth || "",
    };

    let finalData: FormData | Record<string, any> = payload;

    if (imageFile || cinRectoFile || cinVersoFile) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value ?? "");
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

    companyEnabled,
    saveCompanyChoice,
    isCompanyChoiceLoading: companyChoiceMutation.isPending,

    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,

    previewCinRecto,
    previewCinVerso,
    handleCinRectoUpload,
    handleCinVersoUpload,

    deleteProfilePhoto,
    deleteCinRecto,
    deleteCinVerso,

    register,
    onSubmit,
    errors,
    isSubmitting:
      isSubmitting ||
      updateMutation.isPending ||
      prestataireMutation.isPending ||
      changePasswordMutation.isPending ||
      companyChoiceMutation.isPending,

    previewLogo,
    handleLogoUpload,
    handleNifUpload,
    handleStatUpload,
    handleRcsUpload,
    handleCifUpload,
  };
};