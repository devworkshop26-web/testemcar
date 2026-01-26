import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery"
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery"
import { transmissionsVehiculeUseQuery } from "@/useQuery/transmissionsUseQuery"
import { useFuelTypesQuery } from "@/useQuery/fueltypeUseQuery"
import { useStatusVehiculesQuery } from "@/useQuery/statusVehiculeUseQuery"
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery"
import { useVehiculeQuery, useUpdateVehiculeMutation } from "@/useQuery/vehiculeUseQuery"
import { useToast } from "@/components/ui/use-toast"
import { ModeleVehicule } from "@/types/ModeleVehiculeType"
import {
    FormValues,
    PhotoItem,
    SelectOption,
    IdentityProps,
    MainInfoProps,
} from "@/components/vehicule/types"
import { VehiculeMainInfo } from "@/components/vehicule/VehiculeMainInfo"
import { VehiculeIdentitySection } from "@/components/vehicule/VehiculeIdentitySection"
import { VehiculeLocationSection } from "@/components/vehicule/VehiculeLocationSection"
import { VehiculePricingSection } from "@/components/vehicule/VehiculePricingSection"
import { VehiculeFeaturesSection } from "@/components/vehicule/VehiculeFeaturesSection"
import { VehiculeOptionsSection } from "@/components/vehicule/VehiculeOptionsSection"
import { VehiculeEquipmentsSection } from "@/components/vehicule/VehiculeEquipmentsSection"
import { VehiculePhotosSection } from "@/components/vehicule/VehiculePhotosSection"
import { useAllVehicleEquipmentsQuery } from "@/useQuery/vehicleEquipmentsUseQuery"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function AdminEditVehiculePage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()

    const { data: vehicle, isLoading: vehicleLoading } = useVehiculeQuery(id)
    const updateVehiculeMutation = useUpdateVehiculeMutation()

    const { data: marques = [], isLoading: marquesLoading } = marquesVehiculeUseQuery()
    const { CategoryData: categories = [] } = categoryVehiculeUseQuery()
    const { data: transmissions = [], isLoading: transmissionsLoading } = transmissionsVehiculeUseQuery()
    const { data: fuelTypes = [], isLoading: fuelTypesLoading } = useFuelTypesQuery()
    const { data: statusList = [], isLoading: statusLoading } = useStatusVehiculesQuery()
    const { data: modeles = [], isLoading: modelesLoading } = useModelesVehiculeQuery()
    const { data: equipments = [], isLoading: equipmentsLoading } = useAllVehicleEquipmentsQuery()

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
        reset,
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

    // Pre-fill form
    useEffect(() => {
        if (vehicle) {
            reset({
                titre: vehicle.titre || "",
                marque: vehicle.marque_data?.id || vehicle.marque || "",
                modele: vehicle.modele_data?.id || vehicle.modele || "",
                annee: vehicle.annee || new Date().getFullYear(),
                numero_immatriculation: vehicle.numero_immatriculation || "",
                numero_serie: vehicle.numero_serie || "",
                categorie: vehicle.categorie_data?.id || vehicle.categorie || "",
                transmission: vehicle.transmission_data?.id || vehicle.transmission || "",
                type_carburant: vehicle.type_carburant_data?.id || vehicle.type_carburant || "",
                statut: vehicle.statut_data?.id || vehicle.statut || "",
                type_vehicule: vehicle.type_vehicule || "TOURISME",
                nombre_places: vehicle.nombre_places || 4,
                nombre_portes: vehicle.nombre_portes || 4,
                couleur: vehicle.couleur || "",
                kilometrage_actuel_km: vehicle.kilometrage_actuel_km || 0,
                volume_coffre_litres: vehicle.volume_coffre_litres || 0,
                adresse_localisation: vehicle.adresse_localisation || "",
                ville: vehicle.ville || "",
                zone: vehicle.zone || "",

                // Urban Pricing
                prix_jour: parseFloat(vehicle.prix_jour) || 0,
                prix_heure: vehicle.prix_heure ? parseFloat(vehicle.prix_heure) : 0,
                prix_mois: vehicle.prix_mois ? parseFloat(vehicle.prix_mois) : 0,
                prix_par_semaine: vehicle.prix_par_semaine ? parseFloat(vehicle.prix_par_semaine) : 0,
                remise_par_heure: vehicle.remise_par_heure ? parseFloat(vehicle.remise_par_heure) : 0,
                remise_par_jour: vehicle.remise_par_jour ? parseFloat(vehicle.remise_par_jour) : 0,
                remise_par_mois: vehicle.remise_par_mois ? parseFloat(vehicle.remise_par_mois) : 0,
                remise_longue_duree_pourcent: vehicle.remise_longue_duree_pourcent ? parseFloat(vehicle.remise_longue_duree_pourcent) : 0,

                // Province Pricing (Flattened fields)
                province_prix_jour: vehicle.province_prix_jour ? parseFloat(vehicle.province_prix_jour) : undefined,
                province_prix_heure: vehicle.province_prix_heure ? parseFloat(vehicle.province_prix_heure) : undefined,
                province_prix_mois: vehicle.province_prix_mois ? parseFloat(vehicle.province_prix_mois) : undefined,
                province_prix_par_semaine: vehicle.province_prix_par_semaine ? parseFloat(vehicle.province_prix_par_semaine) : undefined,
                province_remise_par_heure: vehicle.province_remise_par_heure ? parseFloat(vehicle.province_remise_par_heure) : undefined,
                province_remise_par_jour: vehicle.province_remise_par_jour ? parseFloat(vehicle.province_remise_par_jour) : undefined,
                province_remise_par_mois: vehicle.province_remise_par_mois ? parseFloat(vehicle.province_remise_par_mois) : undefined,
                province_remise_longue_duree_pourcent: vehicle.province_remise_longue_duree_pourcent ? parseFloat(vehicle.province_remise_longue_duree_pourcent) : undefined,

                devise: vehicle.devise || "MGA",
                montant_caution: vehicle.montant_caution ? parseFloat(vehicle.montant_caution) : 0,
                est_certifie: vehicle.est_certifie,
                est_disponible: vehicle.est_disponible,
                description: vehicle.description || "",
                conditions_particulieres: vehicle.conditions_particulieres || "",
                equipements: vehicle.equipements || [],
                proprietaire: vehicle.proprietaire || "",
            })

            if (vehicle.photos?.length) {
                setPhotos(
                    vehicle.photos.map((p: any) => ({
                        id: p.id,
                        previewUrl: p.image,
                        file: null as any, // Existing photos don't have a File object
                        isExisting: true
                    }))
                )
            }
        }
    }, [vehicle, reset])

    // Watchers
    const marqueValue = watch("marque")
    const filteredModeles = useMemo(() => {
        return modeles.filter((m: ModeleVehicule) => m.marque === marqueValue)
    }, [modeles, marqueValue])

    const handlePhotosChange = (files: FileList | null) => {
        if (!files) return
        const newPhotos = Array.from(files).map((file) => ({
            id: URL.createObjectURL(file), // Temporary ID
            file,
            previewUrl: URL.createObjectURL(file),
            isExisting: false
        }))
        setPhotos((prev) => [...prev, ...newPhotos])
    }

    const removePhoto = (id: string, isExisting: boolean = false) => {
        setPhotos((prev) => prev.filter((p) => p.id !== id))
        // Note: For existing photos, we'll need to handle deletion logic if the API supports it separately or if we send a list of 'kept' photos.
        // The current Single API logic usually sends 'uploaded_photos' (new) and potentially 'existing_photos' ids to keep.
    }

    const onSubmit = async (values: FormValues) => {
        if (isSubmitting || !id) return
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const formData = new FormData()

            // --- 1. Basic Fields ---
            formData.append("titre", values.titre)
            formData.append("annee", values.annee.toString())
            formData.append("numero_immatriculation", values.numero_immatriculation)
            formData.append("numero_serie", values.numero_serie)
            formData.append("nombre_places", values.nombre_places.toString())
            formData.append("nombre_portes", values.nombre_portes.toString())
            formData.append("couleur", values.couleur)
            formData.append("kilometrage_actuel_km", values.kilometrage_actuel_km.toString())
            formData.append("volume_coffre_litres", values.volume_coffre_litres.toString())
            formData.append("adresse_localisation", values.adresse_localisation)
            formData.append("ville", values.ville)
            formData.append("zone", values.zone)
            formData.append("devise", values.devise)
            formData.append("est_certifie", values.est_certifie.toString())
            formData.append("est_disponible", values.est_disponible.toString())
            formData.append("description", values.description)
            formData.append("conditions_particulieres", values.conditions_particulieres || "")
            formData.append("proprietaire", values.proprietaire || "admin")
            formData.append("type_vehicule", values.type_vehicule || "TOURISME")

            // Simple Fields if present
            const simpleFields = ['marque', 'modele', 'categorie', 'transmission', 'type_carburant', 'statut']
            simpleFields.forEach(field => {
                if (values[field as keyof FormValues]) {
                    formData.append(field, values[field as keyof FormValues] as string)
                }
            })

            // --- 2. Pricing (Urban/Default) ---
            formData.append("prix_jour", values.prix_jour.toString())
            // Optional number fields check
            const numberFields = ['prix_heure', 'prix_mois', 'prix_par_semaine', 'remise_par_heure', 'remise_par_jour', 'remise_par_mois', 'remise_longue_duree_pourcent']
            numberFields.forEach(field => {
                if (values[field as keyof FormValues]) {
                    formData.append(field, (values[field as keyof FormValues] as number).toString())
                }
            })
            formData.append("montant_caution", values.montant_caution.toString())

            // --- 3. Pricing (Province) ---
            const provinceFields = ['province_prix_jour', 'province_prix_heure', 'province_prix_mois', 'province_prix_par_semaine',
                'province_remise_par_heure', 'province_remise_par_jour', 'province_remise_par_mois', 'province_remise_longue_duree_pourcent']
            provinceFields.forEach(field => {
                if (values[field as keyof FormValues]) {
                    formData.append(field, (values[field as keyof FormValues] as number).toString())
                }
            })

            // --- 4. Equipments ---
            if (values.equipements && values.equipements.length > 0) {
                values.equipements.forEach(item => {
                    formData.append("equipements", item)
                })
            }

            // --- 5. Photos ---
            // 1️⃣ photos existantes à conserver (Send IDs)
            photos
                .filter((p) => p.isExisting)
                .forEach((p) => {
                    formData.append("existing_photos", p.id)
                })

            // 2️⃣ nouvelles photos -> uploaded_photos
            photos
                .filter((p) => !p.isExisting && p.file)
                .forEach((p) => {
                    formData.append("uploaded_photos", p.file)
                })

            await updateVehiculeMutation.mutateAsync({ id, payload: formData })

            toast({
                title: "Véhicule mis à jour",
                description: "Les modifications ont été enregistrées avec succès.",
            })
            navigate("/admin/vehicles")
        } catch (error: any) {
            console.error("Erreur modification véhicule:", error)
            const message = error.response?.data?.detail || (error instanceof Error ? error.message : "Une erreur est survenue.")
            setSubmitError(message)
            toast({
                title: "Erreur",
                description: message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (vehicleLoading) {
        return (
            <AdminPageShell title="Modification du véhicule" description="Chargement...">
                <div className="flex justify-center items-center h-64">
                    <Skeleton className="h-full w-full rounded-md" />
                </div>
            </AdminPageShell>
        )
    }

    // Define Lists for components
    const IdentityLists: IdentityProps = {
        register, control, errors, watch, setValue,
        categories: categories.map(c => ({ id: c.id, nom: c.nom, label: c.nom })),
        transmissions: transmissions.map(t => ({ id: t.id, nom: t.nom, label: t.nom })),
        fuelTypes: fuelTypes.map(f => ({ id: f.id, nom: f.nom, label: f.nom })),
        statusList: statusList.map(s => ({ id: s.id, nom: s.nom, label: s.nom })),
        clients: [], // Not used for now
        proprietaire: [], // Add owner list if necessary
        loadingSelect: marquesLoading || categories.length === 0, // Simplified loading check
    }

    const MainInfoLists: MainInfoProps = {
        ...IdentityLists,
        marques: marques.map(m => ({ id: m.id, nom: m.nom, label: m.nom })), // Redundant but Types require it
        filteredModeles,
        loadingSelect: modelesLoading,
        marquesLoading,
        modelesLoading
    }

    // Equipment Options
    const equipmentOptions = equipments.map(e => ({
        id: e.id,
        nom: e.label,
        label: e.label,
        description: e.description
    }))

    return (
        <AdminPageShell title="Modification du véhicule" description="Modifier les informations du véhicule.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">

                {submitError && (
                    <Alert variant="destructive">
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6">
                    {/* 1. Main Info */}
                    <VehiculeMainInfo {...MainInfoLists} />

                    {/* 2. Identity */}
                    <VehiculeIdentitySection {...IdentityLists} />

                    {/* 3. Photos */}
                    <VehiculePhotosSection
                        photos={photos}
                        handlePhotosChange={handlePhotosChange}
                        removePhoto={(id) => removePhoto(id, true)}
                    />

                    {/* 4. Pricing (Updated with Tabs in component) */}
                    <VehiculePricingSection register={register} control={control} errors={errors} watch={watch} setValue={setValue} />

                    {/* 5. Location */}
                    <VehiculeLocationSection register={register} control={control} errors={errors} watch={watch} setValue={setValue} />

                    {/* 6. Equipments */}
                    <VehiculeEquipmentsSection
                        watch={watch}
                        setValue={setValue}
                        equipments={equipmentOptions}
                    />

                    {/* 7. Features & Options */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <VehiculeFeaturesSection register={register} control={control} errors={errors} watch={watch} setValue={setValue} />
                        <VehiculeOptionsSection register={register} control={control} errors={errors} watch={watch} setValue={setValue} />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-4 z-10 md:pl-64">
                    <Button type="button" variant="outline" onClick={() => navigate("/admin/vehicles")}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer les modifications"
                        )}
                    </Button>
                </div>
            </form>
        </AdminPageShell>
    )
}
