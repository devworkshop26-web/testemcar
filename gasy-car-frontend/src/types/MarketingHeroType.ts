// types/marketing.ts

export interface MarketingHero {
  id: string;
  name: string;
  titre: string;
  subtitle: string;
  description: string;
  start_date: string;      // format YYYY-MM-DD
  end_date: string;        // format YYYY-MM-DD
  price: string;           // Decimal envoyé comme string par l'API
  image: string;           // URL absolue (backend)
  link: string | null;
  btn_text: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}


// Pour le form côté front (avant transformation en FormData)
export interface MarketingHeroFormValues {
  name: string;
  titre: string;
  subtitle: string;
  description?: string;
  start_date: string;
  end_date: string;
  price: string;
  link: string ;
  btn_text: string;
  active: boolean;
  imageFile?: File | null; // pour la création
}
