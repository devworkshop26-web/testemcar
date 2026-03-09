import { InstanceAxis } from "@/helper/InstanceAxios";
import { ChangePasswordPayload, CsrfToken, PasswordResetPayload, PasswordResetRequestPayload } from "@/types/authType";
import {
  AuthResponse,
  CreateUserData,
  LoginData,
  User,
} from "@/types/userType";

export const authAPI = {
  // Récupérer le token CSRF
  getCsrfToken: (): Promise<{ data: CsrfToken }> =>
    InstanceAxis.get("/accounts/csrf/"),

  // Créer un compte (client par défaut)
  register: (userData: CreateUserData): Promise<{ data: User }> =>
    InstanceAxis.post("/users/register-with-otp/", userData),

  // Connexion
  login: (credentials: LoginData): Promise<{ data: AuthResponse }> =>
    InstanceAxis.post("/users/login/", credentials),

  // Déconnexion
  logout: (): Promise<{ data: { message: string } }> =>
    InstanceAxis.post("/users/logout/"),

  // Récupérer l'utilisateur connecté
  getCurrentUser: (): Promise<{ data: User }> =>
    InstanceAxis.get("/users/user-info/"),

  // Connection Google
  googleLogin: (
    googleToken: string
  ): Promise<{ data: AuthResponse & { is_new_user: boolean } }> =>
    InstanceAxis.post("/google-login/", { google_token: googleToken }),

  // Créer un prestataire (admin seulement)
  createPrestataire: (userData: CreateUserData): Promise<{ data: User }> =>
    InstanceAxis.post("/users/create_prestataire/", userData),

  // Créer un admin (superadmin seulement)
  createAdmin: (userData: CreateUserData): Promise<{ data: User }> =>
    InstanceAxis.post("/users/create_admin/", userData),

  // api for refresh token
  refresh: (refresh: string): Promise<{ data: { refresh: string,access:string } }> =>
    InstanceAxis.post("/users/token/refresh/",refresh),
};
 // Créer un user
export const registerApi = async (userData: CreateUserData)=>{
    return await InstanceAxis.post("/accounts/users/", userData)
}


export const verifyEmailApi = async(email: string) => {
  return await InstanceAxis.post('/accounts/verify-email/', { email });
}

export const sendPasswordResetEmailApi = async(email: string) => {
  return await InstanceAxis.post('/accounts/send-password-reset-email/', { email });
}


export const passwordAPI = {
  // POST /password/reset/
  reset_password: async (payload: PasswordResetRequestPayload) => {
    return await InstanceAxis.post<{ message: string }>(
      "/users/request-reset-password",
      payload,
    );
  },

  // POST /password/change/
  change_password: async (payload: ChangePasswordPayload) => {
    return await InstanceAxis.post<{ message: string }>(
      "/users/change/",
      payload,
    );
  },
};