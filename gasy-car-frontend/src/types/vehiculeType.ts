import { Category } from "./categoryType";
import { FuelType } from "./fuelType";
import { Marque } from "./marqueType";
import { ModeleVehicule } from "./ModeleVehiculeType";
import { StatusVehicule } from "./StatusVehiculeType";
import { Transmission } from "./transmissionType";
import { User } from "./userType";
import { VehicleEquipment } from "./VehicleEquipmentsType";
import { PhotoVehicule } from "./VehiculePhoto";
import { Driver } from "./driverType";
import { VehicleAvailability } from "../Actions/VehicleAvailabilityApi";
import { VehicleDocument } from "./vehicleDocumentsType";

export interface VehiclePricing {
  id: string;
  zone_type: "URBAIN" | "PROVINCE";
  prix_jour: string;
  prix_heure: string | null;
  prix_mois: string | null;
  prix_par_semaine: string | null;
  remise_par_heure: string | null;
  remise_par_jour: string | null;
  remise_par_mois: string | null;
  remise_longue_duree_pourcent: string | null;
}

export type VehicleWorkflowStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED";

export interface Vehicule {
  id: string;

  proprietaire: string;
  proprietaire_data: User;

  titre: string;
  marque: string | null;
  marque_data: Marque | null;
  modele: string | null;
  modele_data: ModeleVehicule | null;
  annee: number;
  numero_immatriculation: string;
  numero_serie: string;

  categorie: string | null;
  categorie_data: Category | null;
  transmission: string | null;
  transmission_data: Transmission | null;
  type_carburant: string | null;
  type_carburant_data: FuelType | null;
  statut: string | null;
  statut_data: StatusVehicule | null;

  equipements_details: VehicleEquipment[] | null;
  photos: PhotoVehicule[] | null;
  documents?: VehicleDocument[] | null;
  availabilities: VehicleAvailability[] | null;
  pricing_grid?: VehiclePricing[];

  type_vehicule: "UTILITAIRE" | "TOURISME";

  driver: string | null;
  driver_data: Driver | null;

  // Champs de carte / liste
  marque_nom?: string | null;
  modele_label?: string | null;
  transmission_nom?: string | null;
  type_carburant_nom?: string | null;
  driver_name?: string | null;
  driver_last_name?: string | null;
  driver_photo?: string | null;

  photo_principale?: string | null;

  nombre_places: number;
  nombre_portes: number;
  couleur: string;
  kilometrage_actuel_km: number;
  volume_coffre_litres: number | null;

  adresse_localisation: string;
  ville: string;
  zone: string;

  prix_jour: string;
  prix_heure: string | null;
  prix_mois: string | null;
  devise: string;
  montant_caution: string;
  remise_longue_duree_pourcent: string | null;

  prix_par_semaine: string | null;
  remise_par_heure: string | null;
  remise_par_jour: string | null;
  remise_par_mois: string | null;

  province_prix_jour: string | null;
  province_prix_heure: string | null;
  province_prix_mois: string | null;
  province_prix_par_semaine: string | null;
  province_remise_par_heure: string | null;
  province_remise_par_jour: string | null;
  province_remise_par_mois: string | null;
  province_remise_longue_duree_pourcent: string | null;

  est_certifie: boolean;
  est_sponsorise: boolean;
  est_coup_de_coeur: boolean;
  est_disponible: boolean;

  valide: boolean;
  workflow_status: VehicleWorkflowStatus;
  review_comment?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  submitted_at?: string | null;
  published_at?: string | null;

  documents_complete?: boolean;
  documents_validated?: boolean;
  is_publicly_visible?: boolean;

  note_moyenne: string | null;
  nombre_locations: number;
  nombre_favoris: number;

  description: string;
  conditions_particulieres: string;
  equipements?: string[];

  created_at: string;
  updated_at: string;
}

export type CreateVehiculePayload = Partial<
  Omit<
    Vehicule,
    | "id"
    | "created_at"
    | "updated_at"
    | "proprietaire_data"
    | "marque_data"
    | "modele_data"
    | "categorie_data"
    | "transmission_data"
    | "type_carburant_data"
    | "statut_data"
    | "equipements_details"
    | "photos"
    | "documents"
    | "availabilities"
    | "pricing_grid"
    | "driver_data"
    | "photo_principale"
  >
> & {
  proprietaire: string;
  titre: string;
  annee: number;
  numero_immatriculation: string;
  numero_serie: string;
  type_vehicule: "UTILITAIRE" | "TOURISME";

  marque?: string | null;
  modele?: string | null;
  categorie?: string | null;
  transmission?: string | null;
  type_carburant?: string | null;
  statut?: string | null;
  equipements?: string[];
  driver?: string | null;
};

export type UpdateVehiculePayload = Partial<CreateVehiculePayload>;

export type ReviewVehiclePayload = {
  action: "approve" | "reject";
  review_comment?: string;
};