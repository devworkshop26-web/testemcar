export interface VehicleSearchFilters {
  marque?: string;
  modele?: string;
  categorie?: string;
  ville?: string;
  min_price?: number;
  max_price?: number;
  start_date?: string;
  end_date?: string;
}

export interface VehicleSearchItem {
  id: string;
  titre: string;
  marque_nom: string;
  modele_label: string;
  categorie_nom: string;
  ville: string;
  prix_jour: number;
  devise: string;
  note_moyenne: number | null;
  nombre_favoris: number;
  nombre_locations: number;
  est_certifie: boolean;
  photo_principale: string | null;
  
  // Propriétés supplémentaires pour l'affichage détaillé
  annee: number;
  nombre_places: number;
  
  // Objets imbriqués (optionnels car peuvent ne pas être retournés par tous les endpoints)
  marque?: {
    id: string;
    nom: string;
  };
  modele?: {
    id: string;
    label: string;
  };
  transmission?: {
    id: string;
    label: string;
  };
  type_carburant?: {
    id: string;
    label: string;
  };
  photos?: Array<{
    id: string;
    image: string;
    is_primary: boolean;
  }>;
}
