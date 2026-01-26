// types/vehicule.ts

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

export interface Vehicule {
  id: string;

  // Propriétaire
  proprietaire: string; // Objet User complet retourné par le backend
  proprietaire_data: User; // Objet User complet retourné par le backend

  // Identité
  titre: string;
  marque: string | null; // Objet Marque complet
  marque_data: Marque | null; // Objet Marque complet
  modele: string | null; // Objet ModeleVehicule complet
  modele_data: ModeleVehicule | null; // Objet ModeleVehicule complet
  annee: number;
  numero_immatriculation: string;
  numero_serie: string;

  // Catégorie / type
  categorie: string | null; // Objet Category complet
  categorie_data: Category | null; // Objet Category complet
  transmission: string | null; // Objet Transmission complet
  transmission_data: Transmission | null; // Objet Transmission complet
  type_carburant: string | null; // ID du type de carburant
  type_carburant_data: FuelType | null; // Objet FuelType complet
  statut: string | null; // ID de StatusVehicule
  statut_data: StatusVehicule | null; // ID de StatusVehicule
  equipements_details: VehicleEquipment[] | null;
  photos: PhotoVehicule[] | null;
  availabilities: VehicleAvailability[] | null;
  pricing_grid?: VehiclePricing[];
  type_vehicule: "UTILITAIRE" | "TOURISME";

  driver: string | null;
  driver_data: Driver | null;
  driver_name?: string; // from Card serializer

  // Added by Backend Serializer logic
  photo_principale?: string | null;

  // Caractéristiques principales
  nombre_places: number;
  nombre_portes: number;
  couleur: string;
  kilometrage_actuel_km: number;
  volume_coffre_litres: number | null;

  // Localisation
  adresse_localisation: string;
  ville: string;
  zone: string;

  // Tarification (Decimal -> string en JSON)
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

  // Tarification Province (Injecté par serializer)
  province_prix_jour: string | null;
  province_prix_heure: string | null;
  province_prix_mois: string | null;
  province_prix_par_semaine: string | null;
  province_remise_par_heure: string | null;
  province_remise_par_jour: string | null;
  province_remise_par_mois: string | null;
  province_remise_longue_duree_pourcent: string | null;

  // Statut & qualité
  est_certifie: boolean;
  est_disponible: boolean;

  // Réputation
  note_moyenne: string | null;
  nombre_locations: number;
  nombre_favoris: number;

  // Texte
  description: string;
  conditions_particulieres: string;
  equipements?: string[];

  created_at: string;
  updated_at: string;
}

// Payload pour création - Utilise des IDs (strings) pour les relations
export type CreateVehiculePayload = Partial<
  Omit<
    Vehicule,
    | "id"
    | "created_at"
    | "updated_at"
    | "proprietaire"
    | "marque"
    | "modele"
    | "categorie"
    | "transmission"
    | "type_carburant"
    | "equipements_details"
    | "photos"
  >
> & {
  // Champs obligatoires
  proprietaire: string; // ID du propriétaire (string)
  titre: string;
  annee: number;
  numero_immatriculation: string;
  numero_serie: string;
  type_vehicule: "UTILITAIRE" | "TOURISME";

  // Relations en tant qu'IDs (strings)
  marque?: string | null; // ID de la marque
  modele?: string | null; // ID du modèle
  categorie?: string | null; // ID de la catégorie
  transmission?: string | null; // ID de la transmission
  type_carburant?: string | null; // ID du type de carburant
  equipements?: string[]; // IDs des équipements
  driver?: string | null; // ID du chauffeur
};

// Payload pour update
export type UpdateVehiculePayload = Partial<CreateVehiculePayload>;


