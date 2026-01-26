// src/pages/Prestataire/EditVehiclePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, Save, Loader2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  useVehiculeQuery,
  useUpdateVehiculeMutation,
} from "@/useQuery/vehiculeUseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleFormData } from "@/types/addVehicleType";
import { EditStepFinalPublication } from "@/components/Prestataire/EditStepFinalPublication";

import { Step1Identity } from "@/components/Prestataire/Step1Identity";
import { Step2CharacteristicsEquipment } from "@/components/Prestataire/Step2CharacteristicsEquipment";
import { Step3Pricing } from "@/components/Prestataire/Step3Pricing";
import { Step4Location } from "@/components/Prestataire/Step4Location";

import { useStatusVehiculesQuery } from "@/useQuery/statusVehiculeUseQuery";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";
import { transmissionsVehiculeUseQuery } from "@/useQuery/transmissionsUseQuery";
import { useFuelTypesQuery } from "@/useQuery/fueltypeUseQuery";
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery";
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery";
import { useAllVehicleEquipmentsQuery } from "@/useQuery/vehicleEquipmentsUseQuery";

const EditVehiclePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const { data: vehicle, isLoading } = useVehiculeQuery(id);
  const updateMutation = useUpdateVehiculeMutation();

  const { data: statusData } = useStatusVehiculesQuery();
  const { CategoryData } = categoryVehiculeUseQuery();
  const { data: transmissionData } = transmissionsVehiculeUseQuery();
  const { data: fuelTypes } = useFuelTypesQuery();
  const { data: marqueData } = marquesVehiculeUseQuery();
  const { data: modeleData } = useModelesVehiculeQuery();
  const { data: equipmentData } = useAllVehicleEquipmentsQuery();

  const methods = useForm<VehicleFormData>({
    shouldUnregister: false,
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
    },
  });

  const { handleSubmit, reset } = methods;

  // Effet pour remonter en haut de page à chaque changement d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    if (!vehicle) return;
    reset({
      titre: vehicle.titre || "",
      marque: vehicle.marque_data?.id || vehicle.marque || "",
      modele: vehicle.modele_data?.id || vehicle.modele || "",
      categorie: vehicle.categorie_data?.id || vehicle.categorie || "",
      transmission: vehicle.transmission_data?.id ?? vehicle.transmission?.id ?? "",
      type_carburant: vehicle.type_carburant_data?.id ?? vehicle.type_carburant?.id ?? "",
      statut: vehicle.statut_data?.id ?? vehicle.statut?.id ?? "",
      type_vehicule: vehicle.type_vehicule === "UTILITAIRE" ? "UTILITAIRE" : "TOURISME",
      // Caractéristiques
      annee: vehicle.annee || new Date().getFullYear(),
      numero_immatriculation: vehicle.numero_immatriculation || "",
      numero_serie: vehicle.numero_serie || "",
      couleur: vehicle.couleur || "",
      kilometrage_actuel_km: vehicle.kilometrage_actuel_km || 0,
      volume_coffre_litres: vehicle.volume_coffre_litres ?? null,
      nombre_places: vehicle.nombre_places || 5,
      nombre_portes: vehicle.nombre_portes || 4,

      // Équipements (Tableau d'IDs pour les checkboxes/multi-select)
      equipements: vehicle.equipements_details?.map((e: any) => e.id) || vehicle.equipements || [],

      // Localisation
      adresse_localisation: vehicle.adresse_localisation || "",
      ville: vehicle.ville || "",
      zone: vehicle.zone || "",

      // Tarification (Conversion des strings decimal en numbers)
      prix_jour: vehicle.prix_jour ? parseFloat(vehicle.prix_jour) : 0,
      prix_heure: vehicle.prix_heure ? parseFloat(vehicle.prix_heure) : null,
      prix_mois: vehicle.prix_mois ? parseFloat(vehicle.prix_mois) : null,
      prix_par_semaine: vehicle.prix_par_semaine ? parseFloat(vehicle.prix_par_semaine) : null,
      remise_par_heure: vehicle.remise_par_heure ? parseFloat(vehicle.remise_par_heure) : null,
      remise_par_jour: vehicle.remise_par_jour ? parseFloat(vehicle.remise_par_jour) : null,
      remise_par_mois: vehicle.remise_par_mois ? parseFloat(vehicle.remise_par_mois) : null,
      remise_longue_duree_pourcent: vehicle.remise_longue_duree_pourcent ? parseFloat(vehicle.remise_longue_duree_pourcent) : null,
      devise: vehicle.devise || "MGA",
      montant_caution: vehicle.montant_caution ? parseFloat(vehicle.montant_caution) : 0,

      // Tarification Province
      province_prix_jour: vehicle.province_prix_jour ? parseFloat(vehicle.province_prix_jour) : 0,
      province_prix_heure: vehicle.province_prix_heure ? parseFloat(vehicle.province_prix_heure) : null,
      province_prix_mois: vehicle.province_prix_mois ? parseFloat(vehicle.province_prix_mois) : null,
      province_prix_par_semaine: vehicle.province_prix_par_semaine ? parseFloat(vehicle.province_prix_par_semaine) : null,
      province_remise_par_heure: vehicle.province_remise_par_heure ? parseFloat(vehicle.province_remise_par_heure) : null,
      province_remise_par_jour: vehicle.province_remise_par_jour ? parseFloat(vehicle.province_remise_par_jour) : null,
      province_remise_par_mois: vehicle.province_remise_par_mois ? parseFloat(vehicle.province_remise_par_mois) : null,
      province_remise_longue_duree_pourcent: vehicle.province_remise_longue_duree_pourcent ? parseFloat(vehicle.province_remise_longue_duree_pourcent) : null,

      // Flags & Meta
      est_certifie: vehicle.est_certifie || false,
      est_disponible: vehicle.est_disponible || true,
      description: vehicle.description || "",
      conditions_particulieres: vehicle.conditions_particulieres || "",
      proprietaire: vehicle.proprietaire || "",
    });

    if (vehicle.photos?.length) {
      setPhotos(
        vehicle.photos.map((p: any) => ({
          id: p.id,
          previewUrl: p.image,
          isExisting: true,
        }))
      );
    }
  }, [vehicle, reset]);

  // Options pour les Selects
  const statusOptions = [{ label: "Choisir un statut", value: "" }, ...(statusData || []).map((s) => ({ label: s.nom, value: s.id }))];
  const categoryOptions = [{ label: "Choisir une catégorie", value: "" }, ...(CategoryData || []).map((c) => ({ label: c.nom, value: c.id }))];
  const transmissionOptions = [{ label: "Choisir une transmission", value: "" }, ...(transmissionData || []).map((t) => ({ label: t.nom, value: t.id }))];
  const fuelOptions = [{ label: "Choisir un type de carburant", value: "" }, ...(fuelTypes || []).map((f) => ({ label: f.nom, value: f.id }))];
  const marqueOptions = [{ label: "Choisir une marque", value: "" }, ...(marqueData || []).map((m) => ({ label: m.nom, value: m.id }))];
  const modeleOptions = [{ label: "Choisir un modèle", value: "", marque: null }, ...(modeleData || []).map((m) => ({ label: m.label, value: m.id, marque: m.marque ?? null }))];
  const equipmentOptions = equipmentData?.map((e) => ({ id: e.id, label: e.label ?? e.id })) || [];

  const handlePhotosChange = (files: FileList | null) => {
    if (!files) return;
    const existing = photos.filter((p) => p.isExisting).length;
    if (existing + files.length > 5) {
      setPhotoError(`Maximum 5 images (${existing} existantes)`);
      return;
    }
    setPhotos((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({
        id: `${Date.now()}-${f.name}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        isExisting: false,
      })),
    ]);
    setPhotoError(null);
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const onSubmit = async (data: VehicleFormData) => {
    if (!id) return;
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'equipements' && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      data.equipements.forEach((eid) => formData.append("equipements", eid));
      photos.filter((p) => p.isExisting).forEach((p) => formData.append("existing_photos", p.id));
      photos.filter((p) => !p.isExisting && p.file).forEach((p) => formData.append("uploaded_photos", p.file));

      await updateMutation.mutateAsync({ id, payload: formData });
      toast({ title: "Succès", description: "Mise à jour réussie" });
      navigate(`/prestataire/vehicle/${id}/manage`);
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const steps = [
    { title: "Identité & typologie", render: <Step1Identity stepNumber={1} brandOptions={marqueOptions} modelOptions={modeleOptions} categories={categoryOptions} transmissions={transmissionOptions} fuels={fuelOptions} statuses={statusOptions} loading={false} /> },
    { title: "Caractéristiques & équipements", render: <Step2CharacteristicsEquipment stepNumber={2} equipments={equipmentOptions} /> },
    { title: "Tarification", render: <Step3Pricing stepNumber={3} /> },
    { title: "Localisation", render: <Step4Location stepNumber={4} /> },
    { title: "Publication & photos", render: <EditStepFinalPublication stepNumber={5} photos={photos} onAddPhotos={handlePhotosChange} onRemovePhoto={removePhoto} error={photoError} isAdding={false} isEditMode /> },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg"><Car className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le véhicule</h1>
            <p className="text-sm text-muted-foreground">Étape {currentStep + 1} sur {steps.length} : {steps[currentStep].title}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => navigate(`/prestataire/vehicle/${id}/manage`)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la gestion
        </Button>
      </div>

      <FormProvider {...methods}>
        <form className="space-y-6">
          <Card><CardContent className="pt-6">{steps[currentStep].render}</CardContent></Card>
          <div className="flex justify-between items-center">
            <div className="min-w-[100px]">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
                </Button>
              )}
            </div>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={() => setCurrentStep((s) => s + 1)} className="px-8">Suivant</Button>
            ) : (
              <Button type="button" disabled={updateMutation.isPending} className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleSubmit(onSubmit)}>
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer les modifications
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditVehiclePage;