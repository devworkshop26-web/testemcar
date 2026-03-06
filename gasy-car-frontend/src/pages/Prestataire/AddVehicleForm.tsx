import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Import des composants les erreurs
import { Step1Identity } from "@/components/Prestataire/Step1Identity";
import { Step2CharacteristicsEquipment } from "@/components/Prestataire/Step2CharacteristicsEquipment";
import { Step3Pricing } from "@/components/Prestataire/Step3Pricing";
import { Step4Location } from "@/components/Prestataire/Step4Location";
import { StepFinalPublication } from "@/components/Prestataire/StepFinalPublication";

// Import des types et constantes
import { VehicleFormData, MAX_IMAGES, PhotoItem } from "@/types/addVehicleType";
import { useCreateVehiculeMutation } from "@/useQuery/vehiculeUseQuery";
import { useStatusVehiculesQuery } from "@/useQuery/statusVehiculeUseQuery";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";
import { transmissionsVehiculeUseQuery } from "@/useQuery/transmissionsUseQuery";
import { useFuelTypesQuery } from "@/useQuery/fueltypeUseQuery";
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery";
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery";
import { useAllVehicleEquipmentsQuery } from "@/useQuery/vehicleEquipmentsUseQuery";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

interface StepDefinition {
  id: number;
  title: string;
  description: string;
  fields: (keyof VehicleFormData)[];
  render: React.ReactNode;
}

// --- Composant Principal Multi-étapes ---
export const AddVehicleForm = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [isHandlingSubmission, setIsHandlingSubmission] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const methods = useForm<VehicleFormData>({
    defaultValues: {
      devise: "MGA",
      est_disponible: true,
      est_certifie: false,
      annee: new Date().getFullYear(),
      nombre_places: 5,
      nombre_portes: 4,
      kilometrage_actuel_km: 0,
      prix_jour: 0,
      equipements: [],
      prix_heure: null,
      prix_mois: null,
      prix_par_semaine: null,
      remise_par_heure: null,
      remise_par_jour: null,
      remise_par_mois: null,
      remise_longue_duree_pourcent: null,
      volume_coffre_litres: null,
      statut: null,
      note_moyenne: null,
      nombre_locations: 0,
      nombre_favoris: 0,
      proprietaire: "",
      description: "",
      conditions_particulieres: "",
      titre: "",
      marque: "",
      modele: "",
      numero_immatriculation: "",
      numero_serie: "",
      adresse_localisation: "",
      ville: "",
      zone: "",
      categorie: "",
      transmission: "",
      type_carburant: "",
      couleur: "",
      type_vehicule: "TOURISME",
    },
  });

  const { handleSubmit, trigger, setValue, watch } = methods;
  const watchDescription = watch("description");

  const { data: currentUser } = useCurrentUserQuery();

  const { data: statusData, isLoading: statusLoading } = useStatusVehiculesQuery();
  const { CategoryData } = categoryVehiculeUseQuery();
  const { data: transmissionData, isLoading: transmissionLoading } = transmissionsVehiculeUseQuery();
  const { data: fuelTypes, isLoading: fuelLoading } = useFuelTypesQuery();
  const { data: marqueData, isLoading: marqueLoading } = marquesVehiculeUseQuery();
  const { data: modeleData, isLoading: modeleLoading } = useModelesVehiculeQuery();
  const { data: equipmentData } = useAllVehicleEquipmentsQuery();

  const statusOptions = useMemo(
    () => [
      { label: "Choisir un statut", value: "" },
      ...(statusData || []).map((status) => ({ label: status.nom, value: status.id })),
    ],
    [statusData]
  );

  const categoryOptions = useMemo(
    () => [
      { label: "Choisir une catégorie", value: "" },
      ...(CategoryData || []).map((item) => ({ label: item.nom, value: item.id })),
    ],
    [CategoryData]
  );

  const transmissionOptions = useMemo(
    () => [
      { label: "Choisir une transmission", value: "" },
      ...(transmissionData || []).map((item) => ({ label: item.nom, value: item.id })),
    ],
    [transmissionData]
  );

  const fuelOptions = useMemo(
    () => [
      { label: "Choisir un type de carburant", value: "" },
      ...(fuelTypes || []).map((item) => ({ label: item.nom, value: item.id })),
    ],
    [fuelTypes]
  );

  const marqueOptions = useMemo(
    () => [
      { label: "Choisir une marque", value: "" },
      ...(marqueData || []).map((item) => ({ label: item.nom, value: item.id })),
    ],
    [marqueData]
  );

  const modeleOptions = useMemo(
    () =>
      [
        { label: "Choisir un modèle", value: "", marque: null },
        ...(modeleData || []).map((item) => ({
          label: item.label,
          value: item.id,
          marque: (item as typeof item & { marque?: string | null }).marque ?? null,
        })),
      ],
    [modeleData]
  );

  const equipmentOptions = useMemo(
    () => (equipmentData || []).map((item) => ({ id: item.id, label: item.label ?? item.id })),
    [equipmentData]
  );

  useEffect(() => {
    if (currentUser?.id) {
      setValue("proprietaire", currentUser.id);
    }
  }, [currentUser, setValue]);

  const createVehiculeMutation = useCreateVehiculeMutation();

  const handlePhotosChange = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const incomingFiles = Array.from(files);

      if (photos.length + incomingFiles.length > MAX_IMAGES) {
        setPhotoError(`Vous pouvez importer au maximum ${MAX_IMAGES} images.`);
        return;
      }

      const tooHeavy = incomingFiles.find((file) => file.size > 5 * 1024 * 1024);
      if (tooHeavy) {
        setPhotoError("Chaque image doit peser moins de 5 Mo.");
        return;
      }

      setIsAddingPhotos(true);
      try {
        const newPhotos: PhotoItem[] = incomingFiles.map((file, index) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
        setPhotoError(null);
      } finally {
        setIsAddingPhotos(false);
      }
    },
    [photos.length]
  );

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }, []);

  const handleFinalSubmit = async (formData: VehicleFormData) => {
    if (!formData.proprietaire) {
      toast({
        title: "Utilisateur requis",
        description: "Impossible de créer un véhicule sans identifiant propriétaire.",
        variant: "destructive",
      });
      return;
    }

    if (photos.length === 0) {
      setPhotoError("Veuillez ajouter au moins une image (limite de 5).");
      return;
    }

    setIsHandlingSubmission(true);
    setPhotoError(null);

    try {
      const data = new FormData();

      data.append("titre", formData.titre);
      data.append("annee", formData.annee.toString());
      data.append("numero_immatriculation", formData.numero_immatriculation);
      data.append("numero_serie", formData.numero_serie);
      data.append("nombre_places", formData.nombre_places.toString());
      data.append("nombre_portes", formData.nombre_portes.toString());
      data.append("couleur", formData.couleur);
      data.append("kilometrage_actuel_km", formData.kilometrage_actuel_km.toString());

      if (formData.volume_coffre_litres) {
        data.append("volume_coffre_litres", formData.volume_coffre_litres.toString());
      }

      data.append("adresse_localisation", formData.adresse_localisation);
      data.append("ville", formData.ville);
      data.append("zone", formData.zone);
      data.append("devise", formData.devise);
      data.append("est_certifie", formData.est_certifie ? "true" : "false");
      data.append("est_disponible", formData.est_disponible ? "true" : "false");
      data.append("description", formData.description);
      data.append("conditions_particulieres", formData.conditions_particulieres || "");
      data.append("proprietaire", formData.proprietaire);
      data.append("type_vehicule", formData.type_vehicule || "TOURISME");

      const simpleFields = ["marque", "modele", "categorie", "transmission", "type_carburant", "statut"];
      simpleFields.forEach((field) => {
        if (formData[field as keyof VehicleFormData]) {
          data.append(field, formData[field as keyof VehicleFormData] as string);
        }
      });

      data.append("prix_jour", formData.prix_jour.toString());

      const numberFields = [
        "prix_heure",
        "prix_mois",
        "prix_par_semaine",
        "remise_par_heure",
        "remise_par_jour",
        "remise_par_mois",
        "remise_longue_duree_pourcent",
      ];
      numberFields.forEach((field) => {
        if (formData[field as keyof VehicleFormData]) {
          data.append(field, (formData[field as keyof VehicleFormData] as number).toString());
        }
      });

      if ("montant_caution" in formData && (formData as any).montant_caution) {
        data.append("montant_caution", String((formData as any).montant_caution));
      } else {
        data.append("montant_caution", "0");
      }

      const provinceFields = [
        "province_prix_jour",
        "province_prix_heure",
        "province_prix_mois",
        "province_prix_par_semaine",
        "province_remise_par_heure",
        "province_remise_par_jour",
        "province_remise_par_mois",
        "province_remise_longue_duree_pourcent",
      ];
      provinceFields.forEach((field) => {
        if (formData[field as keyof VehicleFormData]) {
          data.append(field, (formData[field as keyof VehicleFormData] as number).toString());
        }
      });

      if (formData.equipements && formData.equipements.length > 0) {
        formData.equipements.forEach((item) => {
          data.append("equipements", item);
        });
      }

      photos.forEach((photo) => {
        if (photo.file) data.append("uploaded_photos", photo.file);
      });

      await createVehiculeMutation.mutateAsync(data);

      toast({ title: "Succès", description: "Véhicule créé avec succès." });
      navigate("/prestataire/fleet");
    } catch (error: any) {
      console.error("Erreur lors de la création :", error);

      const detail = error.response?.data?.detail;
      const errorData = error.response?.data;

      let description: React.ReactNode = "Une erreur est survenue lors de l'enregistrement du véhicule.";

      if (detail) {
        description = detail;
      } else if (errorData && typeof errorData === "object") {
        const keys = Object.keys(errorData);
        if (keys.length > 0) {
          description = (
            <div className="flex flex-col gap-1">
              <p>Erreur sur les champs suivants :</p>
              <ul className="list-disc list-inside">
                {keys.map((key) => (
                  <li key={key}>
                    {key} : {Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      }

      toast({
        title: "Création échouée",
        description,
        variant: "destructive",
      });
    } finally {
      setIsHandlingSubmission(false);
    }
  };

  const scrollFormToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const steps: StepDefinition[] = useMemo(
    () => [
      {
        id: 1,
        title: "Identité & typologie",
        description: "Marque, modèle, catégorie, transmission et carburant.",
        fields: [
          "titre",
          "marque",
          "modele",
          "annee",
          "numero_immatriculation",
          "numero_serie",
          "categorie",
          "transmission",
          "type_carburant",
          "statut",
          "type_vehicule",
        ],
        render: (
          <Step1Identity
            stepNumber={1}
            brandOptions={marqueOptions}
            modelOptions={modeleOptions}
            categories={categoryOptions}
            transmissions={transmissionOptions}
            fuels={fuelOptions}
            statuses={statusOptions}
            loading={marqueLoading || modeleLoading || fuelLoading || transmissionLoading || statusLoading}
          />
        ),
      },
      {
        id: 2,
        title: "Caractéristiques & équipements",
        description: "Couleur, places, portes, kilométrage, coffre et équipements.",
        fields: ["couleur", "kilometrage_actuel_km", "volume_coffre_litres", "nombre_places", "nombre_portes", "equipements"],
        render: <Step2CharacteristicsEquipment stepNumber={2} equipments={equipmentOptions} />,
      },
      {
        id: 3,
        title: "Tarification",
        description: "Prix par jour, options tarifaires et devise.",
        fields: [
          "prix_jour",
          "prix_heure",
          "prix_mois",
          "prix_par_semaine",
          "remise_par_heure",
          "remise_par_jour",
          "remise_par_mois",
          "devise",
          "remise_longue_duree_pourcent",
        ],
        render: <Step3Pricing stepNumber={3} />,
      },
      {
        id: 4,
        title: "Localisation",
        description: "Adresse, ville et zone d'activité du véhicule.",
        fields: ["adresse_localisation", "ville", "zone"],
        render: <Step4Location stepNumber={4} />,
      },
      {
        id: 5,
        title: "Publication & photos",
        description: "Ajoutez une description et des photos pour mettre en valeur votre véhicule.",
        fields: ["description", "conditions_particulieres"],
        render: (
          <StepFinalPublication
            stepNumber={5}
            photos={photos}
            onAddPhotos={handlePhotosChange}
            onRemovePhoto={removePhoto}
            error={photoError}
            isAdding={isAddingPhotos}
          />
        ),
      },
    ],
    [
      marqueOptions,
      modeleOptions,
      marqueLoading,
      modeleLoading,
      categoryOptions,
      transmissionOptions,
      fuelOptions,
      statusOptions,
      equipmentOptions,
      photos,
      photoError,
      handlePhotosChange,
      removePhoto,
      isAddingPhotos,
      fuelLoading,
      transmissionLoading,
      statusLoading,
    ]
  );

  const progressValue = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep, steps.length]);

  useEffect(() => {
    scrollFormToTop();
  }, [currentStep, scrollFormToTop]);

  const handleStepValidation = async () => {
    const fields = steps[currentStep].fields;
    if (fields.length === 0) return true;

    const isValid = await trigger(fields, { shouldFocus: true });

    if (!isValid) {
      const currentErrors = methods.formState.errors;
      const invalidFields = fields.filter((field) => currentErrors[field]);

      if (invalidFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Champs invalides",
          description: (
            <div className="flex flex-col gap-1">
              <p>Veuillez corriger les champs suivants :</p>
              <ul className="list-disc list-inside">
                {invalidFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          ),
        });
      }
    }

    if (steps[currentStep].id === 5) {
      if (!watchDescription || watchDescription.trim().length < 30) {
        toast({
          title: "Description incomplète",
          description: "La description doit contenir au moins 30 caractères.",
          variant: "destructive",
        });
        return false;
      }

      if (photos.length === 0) {
        toast({
          title: "Photos requises",
          description: "Veuillez ajouter au moins une photo du véhicule.",
          variant: "destructive",
        });
        return false;
      }
    }

    return isValid;
  };

  const onNext = async () => {
    const isValid = await handleStepValidation();
    if (!isValid) return;

    if (currentStep === steps.length - 1) {
      await handleSubmit(handleFinalSubmit)();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  // ✅ AJOUT: retour page précédente (avec fallback si pas d'historique)
  const goBackPage = useCallback(() => {
    const idx = (window.history.state as any)?.idx;
    const canGoBack = typeof idx === "number" ? idx > 0 : window.history.length > 1;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    // fallback vers la liste des véhicules (et en dernier recours onBack)
    navigate("/prestataire/fleet");
    // onBack(); // si tu veux garder ton comportement parent en fallback
  }, [navigate]);

  // ✅ MODIF UNIQUEMENT ICI: step back sinon page back
  const onPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      return;
    }
    goBackPage();
  };

  const getPrimaryButtonLabel = () => {
    if (currentStep === steps.length - 1) {
      return createVehiculeMutation.isPending || isHandlingSubmission ? "Ajout en cours..." : "Ajouter le véhicule";
    }
    return "Suivant";
  };

  return (
    <FormProvider {...methods}>
      <form ref={formRef} className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20 max-w-6xl mx-auto">
        <div className="rounded-3xl p-6 shadow-sm border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">{steps[currentStep].title}</h2>
              <p className="text-sm text-slate-600">{steps[currentStep].description}</p>
            </div>

            <div className="ml-auto flex items-center gap-2 text-xs bg-white px-3 py-2 rounded-full border border-slate-200 shadow-sm text-slate-700">
              Étape {currentStep + 1} / {steps.length}
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progressValue} className="w-full h-2 rounded-full bg-slate-100" />
            <div className="flex justify-between text-xs text-slate-600 mt-2">
              <span>{currentStep === steps.length - 1 ? "Upload des images" : "Saisie des informations"}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative space-y-6">{steps[currentStep].render}</div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="px-6 rounded-xl h-12 border-slate-200 hover:-translate-y-0.5 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
            </Button>
          )}

          <Button
            type="button"
            onClick={onNext}
            disabled={createVehiculeMutation.isPending || isHandlingSubmission || isAddingPhotos}
            className="ml-auto bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-12 shadow-lg shadow-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createVehiculeMutation.isPending || isHandlingSubmission ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {getPrimaryButtonLabel()}
              </>
            ) : (
              getPrimaryButtonLabel()
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddVehicleForm;
