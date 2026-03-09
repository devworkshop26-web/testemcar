import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/Actions/usersApi";
import { prestataireAPI } from "@/Actions/prestataireApi";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { InstanceAxis } from "@/helper/InstanceAxios";
import { useToast } from "@/components/ui/use-toast";

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

  old_password?: string;
  new_password?: string;
}

import { User } from "@/types/userType";

export const usePrestataireSettings = () => {
  const { user } = useCurentuser() as { user: User | null };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ✅ PRESTATAIRE QUERY
  const { data: prestataireData } = useQuery({
    queryKey: ["myPrestataireProfile"],
    queryFn: () => prestataireAPI.getMyProfile().then((res) => res.data),
    enabled: !!user,
    retry: false,
  });

  // ✅ PRESTATAIRE MUTATION (CREATE/UPDATE)
  const prestataireMutation = useMutation({
    mutationFn: (data: any) => {
      // Si on a déjà des data, on fait un update (PATCH), sinon on tente create (POST)
      // Mais endpoint 'me' gère update (PATCH) si existe.
      // Si 404 (pas de profil), il faut POST sur /prestataires/ (create standard)
      // Pour simplifier ici : si prestataireData existe, updateMe. Sinon create.
      if (prestataireData) {
        return prestataireAPI.updateMyProfile(data);
      } else {
        return prestataireAPI.createPrestataire(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPrestataireProfile"] });
      toast({
        title: "Informations entreprise enregistrées",
        description: "Votre profil prestataire a été mis à jour.",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les informations entreprise.",
        variant: "destructive",
      });
    },
  });

  // SECTION PAR DEFAUT
  const [section, setSection] = useState<"personal" | "company" | "security">(
    "personal"
  );

  // Preview affichée
  const [previewPhoto, setPreviewPhoto] = useState("");

  // 🔥 Fichier réel envoyé au backend
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ✅ CIN (recto/verso) : preview + fichiers
  const [previewCinRecto, setPreviewCinRecto] = useState("");
  const [previewCinVerso, setPreviewCinVerso] = useState("");
  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);

  // ✅ PRESTATAIRE DOCS & LOGO
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
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
    },
  });

  // -------------------------------------------------------------
  // Upload image → preview + sauvegarde du fichier
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // ✅ UPLOAD CIN RECTO → preview + sauvegarde du fichier
  // -------------------------------------------------------------
  const handleCinRectoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinRectoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewCinRecto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // ✅ UPLOAD CIN VERSO → preview + sauvegarde du fichier
  // -------------------------------------------------------------
  const handleCinVersoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCinVersoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewCinVerso(reader.result as string);
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // ✅ UPLOAD DOCS PRESTATAIRE (handlers)
  // -------------------------------------------------------------
  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNifUpload = (e: any) => setNifFile(e.target.files?.[0] || null);
  const handleStatUpload = (e: any) => setStatFile(e.target.files?.[0] || null);
  const handleRcsUpload = (e: any) => setRcsFile(e.target.files?.[0] || null);
  const handleCifUpload = (e: any) => setCifFile(e.target.files?.[0] || null);

  // -------------------------------------------------------------
  // ✅ SUPPRESSION BACKEND : une seule photo à la fois
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // Mutation API
  // -------------------------------------------------------------
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => usersAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // setPreviewPhoto("");
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

  // -------------------------------------------------------------
  // Remplissage automatique du formulaire
  // -------------------------------------------------------------
  const getMediaUrl = (value?: string | null) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
      return value;
    }
    const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
    const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");
    return `${BASE_URL}${value}`;
  };

  useEffect(() => {
    if (!user) return;

    // SI le backend renvoie une nouvelle image → affichage instantané !
    if (user.image) {
      setPreviewPhoto(getMediaUrl(user.image));
    }

    // ✅ charger CIN recto/verso si le backend les renvoie
    if ((user as any).cin_photo_recto) {
      setPreviewCinRecto(getMediaUrl((user as any).cin_photo_recto));
    } else {
      setPreviewCinRecto("");
    }

    if ((user as any).cin_photo_verso) {
      setPreviewCinVerso(getMediaUrl((user as any).cin_photo_verso));
    } else {
      setPreviewCinVerso("");
    }

    // Gestion PRESTATAIRE DATA
    let prestValues = {
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
    };

    if (prestataireData) {
      // Logo preview
      if (prestataireData.logo) {
        setPreviewLogo(getMediaUrl(prestataireData.logo));
      }

      prestValues = {
        company_name: prestataireData.company_name || "",
        nif: prestataireData.nif || "",
        stat: prestataireData.stat || "",
        rcs: prestataireData.rcs || "",
        cif: prestataireData.cif || "",
        company_phone: prestataireData.phone || "",
        secondary_phone: prestataireData.secondary_phone || "",
        city: prestataireData.city || "",
        company_address: prestataireData.address || "",
        company_email: prestataireData.email || "",
      };
    } else {
      // Fallback user values if not defined? 
      // Or just leave empty.
      prestValues = {
        // Maybe pre-fill company_name with full name?
        ...prestValues,
        company_name: user.company_name || "", // if backward compat
      } as any;
    }


    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      cin_number: user.cin_number || "",
      date_of_birth: user.date_of_birth || "",

      ...prestValues,

      old_password: "",
      new_password: "",
    });
  }, [user, prestataireData, reset]);

  // -------------------------------------------------------------
  // Submit final → envoi imageFile + données selon section
  // -------------------------------------------------------------
  const onSubmit = handleSubmit(async (values) => {
    if (!user?.id) return;

    let payload: any = {};

    if (section === "personal") {
      payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        cin_number: values.cin_number,
        date_of_birth: values.date_of_birth,
      };
    }

    if (section === "company") {
      // CONSTRUCTION PAYLOAD PRESTATAIRE
      const formData = new FormData();
      formData.append("company_name", values.company_name);
      formData.append("nif", values.nif);
      formData.append("stat", values.stat);
      if (values.rcs) formData.append("rcs", values.rcs);
      if (values.cif) formData.append("cif", values.cif);
      formData.append("phone", values.company_phone);
      if (values.secondary_phone) formData.append("secondary_phone", values.secondary_phone);
      formData.append("email", values.company_email);
      formData.append("address", values.company_address);
      formData.append("city", values.city);

      // FILES
      if (logoFile) formData.append("logo", logoFile);
      if (nifFile) formData.append("nif_document", nifFile);
      if (statFile) formData.append("stat_document", statFile);
      if (rcsFile) formData.append("rcs_document", rcsFile);
      if (cifFile) formData.append("cif_document", cifFile);

      await prestataireMutation.mutateAsync(formData);
      return; // Stop here, don't update user
    }

    // SECURITY & PERSONAL (USER UPDATE)
    if (section === "security") {
      payload = {
        old_password: values.old_password,
        new_password: values.new_password,
      };
    }

    // ... (rest of user update logic)

    // 🔥 SI UNE IMAGE EXISTE → CONSTRUIRE FORM-DATA
    // ✅ Si CIN recto/verso sont présents → FormData aussi
    let finalData: any = payload;

    if (imageFile || cinRectoFile || cinVersoFile) {
      const formData = new FormData();

      // Ajout texte
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // Ajout du fichier attendu par le backend
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
    isSubmitting: isSubmitting || prestataireMutation.isPending,

    // Exports Prestataire files
    previewLogo,
    handleLogoUpload,
    handleNifUpload,
    handleStatUpload,
    handleRcsUpload,
    handleCifUpload,
  };
};
