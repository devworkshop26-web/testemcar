import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery"
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery"
import { transmissionsVehiculeUseQuery } from "@/useQuery/transmissionsUseQuery"
import { useFuelTypesQuery } from "@/useQuery/fueltypeUseQuery"
import { useStatusVehiculesQuery } from "@/useQuery/statusVehiculeUseQuery"
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery"
import { useCreateVehiculeMutation } from "@/useQuery/vehiculeUseQuery"
import { useToast } from "@/components/ui/use-toast"
import { ModeleVehicule } from "@/types/ModeleVehiculeType"
import { CreateVehiculePayload } from "@/types/vehiculeType"
import { InstanceAxis } from "@/helper/InstanceAxios"
import {
  FormValues,
  IdentityProps,
  MainInfoProps,
  PhotoItem,
  PhotosProps,
  SelectOption,
} from "@/components/vehicule/types"
import { VehiculeMainInfo } from "@/components/vehicule/VehiculeMainInfo"
import { VehiculeIdentitySection } from "@/components/vehicule/VehiculeIdentitySection"
import { VehiculeLocationSection } from "@/components/vehicule/VehiculeLocationSection"
import { VehiculePricingSection } from "@/components/vehicule/VehiculePricingSection"
import { VehiculeFeaturesSection } from "@/components/vehicule/VehiculeFeaturesSection"
import { VehiculeOptionsSection } from "@/components/vehicule/VehiculeOptionsSection"
import { VehiculeEquipmentsSection } from "@/components/vehicule/VehiculeEquipmentsSection"
import { VehiculePhotosSection } from "@/components/vehicule/VehiculePhotosSection"
import { adminUseQuery } from "@/useQuery/adminUseQuery"
import { User } from "@/types/userType"
import { useAllVehicleEquipmentsQuery } from "@/useQuery/vehicleEquipmentsUseQuery"

export default function AdminCreateVehiculePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: marques = [], isLoading: marquesLoading } = marquesVehiculeUseQuery()
  const { CategoryData: categories = [] } = categoryVehiculeUseQuery()
  const { data: transmissions = [], isLoading: transmissionsLoading } = transmissionsVehiculeUseQuery()
  const { data: fuelTypes = [], isLoading: fuelTypesLoading } = useFuelTypesQuery()
  const { data: statusList = [], isLoading: statusLoading } = useStatusVehiculesQuery()
  const { data: modeles = [], isLoading: modelesLoading } = useModelesVehiculeQuery()
  const { data: equipments = [], isLoading: equipmentsLoading } = useAllVehicleEquipmentsQuery()
  const createVehiculeMutation = useCreateVehiculeMutation()

  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      titre: "",
      marque: "",
      modele: "",
      annee: new Date().getFullYear(),
      numero_immatriculation: "",
      numero_serie: "",
      categorie: "",
      transmission: "",
      type_carburant: "",
      statut: "",
      type_vehicule: "TOURISME",
      nombre_places: 4,
      nombre_portes: 4,
      couleur: "",
      kilometrage_actuel_km: 0,
      volume_coffre_litres: 0,
      adresse_localisation: "",
      ville: "",
      zone: "",
      prix_jour: 0,
      prix_heure: 0,
      prix_mois: 0,
      prix_par_semaine: 0,
      remise_par_heure: 0,
      remise_par_jour: 0,
      remise_par_mois: 0,
      devise: "MGA",
      montant_caution: 0,
      remise_longue_duree_pourcent: 0,
      est_certifie: true,
      est_disponible: true,
      description: "",
      conditions_particulieres: "",
      equipements: [],
      proprietaire: "",
    },
    mode: "onBlur",
  })

  const selectedMarque = watch("marque")
  const filteredModeles = useMemo(() => {
    if (!selectedMarque) return modeles
    return modeles.filter((modele) => {
      const modeleWithMarque = modele as ModeleVehicule & { marque?: string | null }
      return modeleWithMarque.marque ? modeleWithMarque.marque === selectedMarque : true
    })
  }, [modeles, selectedMarque])

  const { prestataireData } = adminUseQuery()

  useEffect(() => {
    if (!selectedMarque) {
      setValue("modele", "")
    }
  }, [selectedMarque, setValue])

  const handlePhotosChange: PhotosProps["handlePhotosChange"] = (files) => {
    if (!files) return
    const newPhotos: PhotoItem[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  const removePhoto: PhotosProps["removePhoto"] = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }



  const onSubmit = async (values: FormValues) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData()

      // --- 1. Basic Fields ---
      formData.append("titre", values.titre);
      formData.append("annee", values.annee.toString());
      formData.append("numero_immatriculation", values.numero_immatriculation);
      formData.append("numero_serie", values.numero_serie);
      formData.append("nombre_places", values.nombre_places.toString());
      formData.append("nombre_portes", values.nombre_portes.toString());
      formData.append("couleur", values.couleur);
      formData.append("kilometrage_actuel_km", values.kilometrage_actuel_km.toString());
      formData.append("volume_coffre_litres", values.volume_coffre_litres.toString());
      formData.append("adresse_localisation", values.adresse_localisation);
      formData.append("ville", values.ville);
      formData.append("zone", values.zone);
      formData.append("devise", values.devise);
      formData.append("est_certifie", values.est_certifie.toString());
      formData.append("est_disponible", values.est_disponible.toString());
      formData.append("description", values.description);
      formData.append("conditions_particulieres", values.conditions_particulieres || "");
      formData.append("proprietaire", values.proprietaire || "admin"); // Default to admin if empty but usually required
      formData.append("type_vehicule", values.type_vehicule || "TOURISME");

      // Foreign keys
      if (values.marque) formData.append("marque", values.marque);
      if (values.modele) formData.append("modele", values.modele);
      if (values.categorie) formData.append("categorie", values.categorie);
      if (values.transmission) formData.append("transmission", values.transmission);
      if (values.type_carburant) formData.append("type_carburant", values.type_carburant);
      if (values.statut) formData.append("statut", values.statut);

      // --- 2. Pricing (Urban/Default) ---
      formData.append("prix_jour", values.prix_jour.toString());
      if (values.prix_heure) formData.append("prix_heure", values.prix_heure.toString());
      if (values.prix_mois) formData.append("prix_mois", values.prix_mois.toString());
      if (values.prix_par_semaine) formData.append("prix_par_semaine", values.prix_par_semaine.toString());
      if (values.remise_par_heure) formData.append("remise_par_heure", values.remise_par_heure.toString());
      if (values.remise_par_jour) formData.append("remise_par_jour", values.remise_par_jour.toString());
      if (values.remise_par_mois) formData.append("remise_par_mois", values.remise_par_mois.toString());
      if (values.remise_longue_duree_pourcent) formData.append("remise_longue_duree_pourcent", values.remise_longue_duree_pourcent.toString());
      formData.append("montant_caution", values.montant_caution.toString());

      // --- 3. Pricing (Province) ---
      if (values.province_prix_jour) formData.append("province_prix_jour", values.province_prix_jour.toString());
      if (values.province_prix_heure) formData.append("province_prix_heure", values.province_prix_heure.toString());
      if (values.province_prix_mois) formData.append("province_prix_mois", values.province_prix_mois.toString());
      if (values.province_prix_par_semaine) formData.append("province_prix_par_semaine", values.province_prix_par_semaine.toString());
      if (values.province_remise_par_heure) formData.append("province_remise_par_heure", values.province_remise_par_heure.toString());
      if (values.province_remise_par_jour) formData.append("province_remise_par_jour", values.province_remise_par_jour.toString());
      if (values.province_remise_par_mois) formData.append("province_remise_par_mois", values.province_remise_par_mois.toString());
      if (values.province_remise_longue_duree_pourcent) formData.append("province_remise_longue_duree_pourcent", values.province_remise_longue_duree_pourcent.toString());

      // --- 4. Equipments ---
      if (values.equipements && values.equipements.length > 0) {
        values.equipements.forEach(item => {
          formData.append("equipements", item);
        });
      }

      // --- 5. Photos ---
      if (photos.length > 0) {
        photos.forEach((photo) => {
          formData.append("uploaded_photos", photo.file);
        });
      }

      await createVehiculeMutation.mutateAsync(formData as any) // Using any since hook type expects JSON

      toast({
        title: "Véhicule créé",
        description: "Le véhicule et ses photos ont été ajoutés avec succès.",
      })
      navigate("/admin/vehicles")

    } catch (error: any) {
      console.error("Erreur création véhicule:", error)

      let hasFieldError = false
      if (error.response && error.response.data) {
        const errorData = error.response.data

        Object.keys(errorData).forEach((key) => {
          if (key in values || ["titre", "marque", "modele", "annee", "numero_immatriculation", "prix_jour", "montant_caution"].includes(key)) {
            // Try to map error to field if possible
            const fieldName = key as keyof FormValues;
            setError(fieldName, {
              type: "server",
              message: Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]
            })
            hasFieldError = true
          }
        })
      }

      if (hasFieldError) {
        const errorKeys = Object.keys(error.response?.data || {}).filter(key =>
          key in values || ["titre", "marque", "modele", "annee", "numero_immatriculation", "prix_jour", "montant_caution"].includes(key)
        );

        toast({
          title: "Erreur de validation",
          description: (
            <div className="flex flex-col gap-1">
              <p>Des erreurs sont présentes sur les champs suivants :</p>
              <ul className="list-disc list-inside">
                {errorKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          ),
          variant: "destructive",
        })
      } else {
        const message = error.response?.data?.detail || (error instanceof Error ? error.message : "Une erreur est survenue lors de la création.")
        setSubmitError(message)
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadingSelect =
    marquesLoading || transmissionsLoading || fuelTypesLoading || statusLoading || modelesLoading || equipmentsLoading

  const mainInfoProps: MainInfoProps = {
    register,
    control,
    errors,
    marques: marques as SelectOption[],
    filteredModeles,
    loadingSelect,
    marquesLoading,
    modelesLoading,
    watch,
    setValue,
  }

  const identityProps: IdentityProps = {
    register,
    control,
    errors,
    watch,
    setValue,
    categories: categories as SelectOption[],
    transmissions: transmissions as SelectOption[],
    fuelTypes: fuelTypes as SelectOption[],
    statusList: statusList as SelectOption[],
    clients: [] as SelectOption[],
    proprietaire: prestataireData as User[],
    loadingSelect,
  }

  const sharedProps = { register, control, errors, watch, setValue }

  const onInvalid = (errors: any) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: (
          <div className="flex flex-col gap-1">
            <p>Veuillez corriger les champs suivants :</p>
            <ul className="list-disc list-inside">
              {errorFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        ),
      });
    }
  };

  return (
    <AdminPageShell title="Créer un véhicule" description="Ajoutez un nouveau véhicule à la plateforme.">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid gap-6">
        <VehiculeMainInfo {...mainInfoProps} />
        <VehiculeIdentitySection {...identityProps} />
        <VehiculeLocationSection {...sharedProps} />
        <VehiculePricingSection {...sharedProps} />
        <VehiculeFeaturesSection {...sharedProps} />
        <VehiculeOptionsSection {...sharedProps} />
        <VehiculeEquipmentsSection equipments={equipments} watch={watch} setValue={setValue} />
        <VehiculePhotosSection photos={photos} handlePhotosChange={handlePhotosChange} removePhoto={removePhoto} />

        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" className="px-6" disabled={isSubmitting || createVehiculeMutation.isPending}>
            {isSubmitting ? "Traitement en cours..." : "Créer véhicule"}
          </Button>
        </div>
      </form>
    </AdminPageShell>
  )
}

