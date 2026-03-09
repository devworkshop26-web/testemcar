import { LucideIcon } from "lucide-react";
import { Baby, Car, DollarSign, FileText, ListChecks, MapPin, Music, Settings, Shield, Snowflake, Sun, Umbrella, Upload, Wifi } from "lucide-react";

// --- TYPES ---
export interface ImageFileState {
    file: File | null;
    previewUrl: string | null;
    isUploading: boolean;
    error: string | null;
}

export interface PhotoItem {
    id: string;
    file: File;
    previewUrl: string;
}

export interface VehicleFormData {
    // 1️⃣ Identité du véhicule
    titre: string;
    marque: string;
    modele: string;
    annee: number;
    numero_immatriculation: string;
    numero_serie: string;
    proprietaire: string;
    // 2️⃣ Typologie
    categorie: string;
    transmission: string;
    type_carburant: string;
    statut: string | null;
    type_vehicule: "UTILITAIRE" | "TOURISME";
    // 3️⃣ Localisation du véhicule
    adresse_localisation: string;
    ville: string;
    zone: string;
    // 3️⃣ Tarification & caution
    prix_jour: number;
    prix_heure?: number | null;
    limite_heures?: number | null;
    prix_mois?: number | null;
    prix_par_semaine?: number | null;
    remise_par_heure?: number | null;
    remise_par_jour?: number | null;
    remise_par_mois?: number | null;
    devise: string;
    remise_longue_duree_pourcent?: number | null;
    montant_caution?: number | null;

    // 4️⃣ Tarification Province (Optionnelle)
    province_prix_jour?: number | null;
    province_prix_heure?: number | null;
    province_prix_mois?: number | null;
    province_prix_par_semaine?: number | null;
    province_remise_par_heure?: number | null;
    province_remise_par_jour?: number | null;
    province_remise_par_mois?: number | null;
    province_remise_longue_duree_pourcent?: number | null;

    // 5️⃣ Caractéristiques
    nombre_places: number;
    nombre_portes: number;
    couleur: string;
    kilometrage_actuel_km: number;
    volume_coffre_litres: number | null;
    // 5️⃣ Équipements & options
    equipements: string[];
    // 7️⃣ Publication
    est_certifie?: boolean;
    est_disponible: boolean;
    description: string;
    conditions_particulieres: string;
    note_moyenne: string | null;
    nombre_locations: number;
    nombre_favoris: number;
}

export interface StepConfig {
    id: number;
    name: string;
    icon: LucideIcon;
    fields: (keyof VehicleFormData)[];
}

export interface Equipment {
    id: string;
    label: string;
    icon: LucideIcon;
}

// --- CONSTANTES ---
export const MAX_IMAGES = 5;

export const phase1Steps: StepConfig[] = [
    { id: 1, name: "Identité", icon: Car, fields: ['titre', 'marque', 'modele', 'annee', 'numero_immatriculation', 'numero_serie'] },
    { id: 2, name: "Localisation", icon: MapPin, fields: ['adresse_localisation', 'ville', 'zone'] },
    { id: 3, name: "Tarification", icon: DollarSign, fields: ['prix_jour', 'montant_caution', 'prix_heure', 'limite_heures', 'prix_mois', 'prix_par_semaine', 'remise_par_heure', 'remise_par_jour', 'remise_par_mois', 'devise', 'remise_longue_duree_pourcent'] },
];

export const phase2Steps: StepConfig[] = [
    { id: 4, name: "Caractéristiques", icon: Settings, fields: ['categorie', 'transmission', 'type_carburant', 'nombre_places', 'nombre_portes', 'couleur', 'kilometrage_actuel_km', 'volume_coffre_litres'] },
    { id: 5, name: "Photos", icon: Upload, fields: [] },
    { id: 6, name: "Équipements", icon: ListChecks, fields: ['equipements'] },
    { id: 7, name: "Publication", icon: FileText, fields: ['est_disponible', 'description', 'conditions_particulieres'] },
];

export const availableEquipment: Equipment[] = [
    { id: 'siege_bebe', label: 'Siège bébé', icon: Baby },
    { id: 'gps', label: 'GPS intégré', icon: MapPin },
    { id: 'bluetooth', label: 'Bluetooth', icon: Music },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'toit_ouvrant', label: 'Toit ouvrant', icon: Sun },
    { id: 'regulateur_vitesse', label: 'Régulateur de vitesse', icon: Settings },
    { id: 'siege_chauffant', label: 'Sièges chauffants', icon: Sun },
    { id: 'camera_recul', label: 'Caméra de recul', icon: Shield },
    { id: 'aide_stationnement', label: 'Aide au stationnement', icon: Shield },
    { id: 'chargeur_sans_fil', label: 'Chargeur sans fil', icon: Wifi },
    { id: 'pare_soleil', label: 'Pare-soleil', icon: Umbrella },
];

// Options pour les selects
export const brandOptions = [
    { value: "toyota", label: "Toyota" },
    { value: "hyundai", label: "Hyundai" },
    { value: "nissan", label: "Nissan" },
    { value: "renault", label: "Renault" },
    { value: "peugeot", label: "Peugeot" },
    { value: "mercedes", label: "Mercedes" },
    { value: "bmw", label: "BMW" },
    { value: "audi", label: "Audi" }
];

export const modelOptions = [
    { value: "land_cruiser", label: "Land Cruiser" },
    { value: "rav4", label: "RAV4" },
    { value: "tucson", label: "Tucson" },
    { value: "x-trail", label: "X-Trail" },
    { value: "clio", label: "Clio" },
    { value: "308", label: "308" },
    { value: "c-class", label: "Classe C" },
    { value: "x5", label: "X5" }
];

export const categoryOptions = [
    { value: "suv", label: "SUV / 4x4" },
    { value: "berline", label: "Berline" },
    { value: "compacte", label: "Compacte" },
    { value: "citadine", label: "Citadine" },
    { value: "utilitaire", label: "Utilitaire" },
    { value: "luxe", label: "Voiture de luxe" }
];

export const fuelTypeOptions = [
    { value: "diesel", label: "Diesel" },
    { value: "essence", label: "Essence" },
    { value: "electrique", label: "Électrique" },
    { value: "hybride", label: "Hybride" }
];

export const transmissionOptions = [
    { value: "manuelle", label: "Manuelle" },
    { value: "automatique", label: "Automatique" }
];

export const currencyOptions = [
    { value: "Ar", label: "Ariary (Ar)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "USD", label: "Dollar ($)" }
];