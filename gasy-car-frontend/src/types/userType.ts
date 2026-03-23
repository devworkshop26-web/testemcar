export interface User {
  id: string;
  email: string;
  username: string;
  role: "CLIENT" | "PRESTATAIRE" | "ADMIN" | "SUPPORT" | "CHAUFFEUR" | "MECANICIEN";
  phone_verified: boolean;
  last_login_at?: string;
  date_joined: string;

  first_name: string;
  last_name: string;
  phone: string;
  address?: string;

  image?: string;

  cin_number?: string;
  cin_photo_recto?: string;
  cin_photo_verso?: string;
  residence_certificate?: string;
  permis_conduire?: string;
  permis_conduire_recto?: string;
  permis_conduire_verso?: string;

  date_of_birth?: string;

  created_at: string;
  updated_at: string;
  is_active: boolean;

  is_company?: boolean;

  company_name?: string;
  nif?: string;
  stat?: string;
  rcs?: string;
  cif?: string;
  secondary_phone?: string;
  city?: string;
  company_address?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "CLIENT" | "PRESTATAIRE" | "ADMIN" | "SUPPORT" | "CHAUFFEUR" | "MECANICIEN";
  address?: string;
  cin_number?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface CsrfToken {
  csrfToken: string;
}

export type UserRole =
  | "PRESTATAIRE"
  | "CLIENT"
  | "SUPPORT"
  | "CHAUFFEUR"
  | "MECANICIEN"
  | "ADMIN";
