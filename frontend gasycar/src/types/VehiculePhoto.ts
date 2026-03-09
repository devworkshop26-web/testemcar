

export type PhotoVehicule = {
  id: string;
  vehicle: string;
  image: string;
  caption: string;
  is_primary: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
};