import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ModeleVehicule } from "@/types/ModeleVehiculeType"

export type FormValues = {
  titre: string
  marque: string
  modele: string
  annee: number
  numero_immatriculation: string
  numero_serie: string
  categorie: string
  transmission: string
  type_carburant: string
  statut: string
  type_vehicule: "UTILITAIRE" | "TOURISME"
  nombre_places: number
  nombre_portes: number
  couleur: string
  kilometrage_actuel_km: number
  volume_coffre_litres: number
  adresse_localisation: string
  ville: string
  zone: string
  prix_jour: number
  prix_heure: number
  prix_mois: number
  prix_par_semaine: number
  remise_par_heure: number
  remise_par_jour: number
  remise_par_mois: number
  devise: string
  montant_caution: number
  remise_longue_duree_pourcent: number
  valide: boolean
  est_certifie: boolean
  est_sponsorise: boolean
  est_coup_de_coeur: boolean
  est_disponible: boolean
  description: string
  conditions_particulieres: string
  equipements: string[]
  proprietaire: string

  // Comparité avec le provider : pricing province
  province_prix_jour?: number
  province_prix_heure?: number
  province_prix_mois?: number
  province_prix_par_semaine?: number
  province_remise_par_heure?: number
  province_remise_par_jour?: number
  province_remise_par_mois?: number
  province_remise_longue_duree_pourcent?: number
}

export type PhotoItem = {
  id: string
  file: File
  previewUrl: string
  isExisting?: boolean
}

export type SelectOption = {
  id: string
  label?: string | null
  nom?: string | null
  name?: string | null
  type?: string | null
}

export type EquipmentOption = {
  id: string
  nom?: string | null
  label?: string | null
  description?: string | null
  name?: string | null
}

export type FormSectionProps = {
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  errors: FieldErrors<FormValues>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}

export type MainInfoProps = FormSectionProps & {
  marques: SelectOption[]
  filteredModeles: ModeleVehicule[]
  loadingSelect: boolean
  marquesLoading: boolean
  modelesLoading: boolean
}

export type IdentityProps = FormSectionProps & {
  categories: SelectOption[]
  transmissions: SelectOption[]
  fuelTypes: SelectOption[]
  statusList: SelectOption[]
  clients: SelectOption[]
  proprietaire: any[]
  loadingSelect: boolean
}

export type PricingProps = FormSectionProps
export type LocationProps = FormSectionProps
export type FeaturesProps = FormSectionProps
export type OptionsProps = FormSectionProps

export type EquipmentsProps = Pick<FormSectionProps, "watch" | "setValue"> & {
  equipments: EquipmentOption[]
}

export type PhotosProps = {
  photos: PhotoItem[]
  handlePhotosChange: (files: FileList | null) => void
  removePhoto: (id: string) => void
}

