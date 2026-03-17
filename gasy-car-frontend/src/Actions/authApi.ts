import { InstanceAxis } from "@/helper/InstanceAxios";
import {
  ChangePasswordPayload,
  CsrfToken,
  PasswordResetPayload,
  PasswordResetRequestPayload,
} from "@/types/authType";
import {
  AuthResponse,
  CreateUserData,
  LoginData,
  User,
} from "@/types/userType";

export type RegisterWithOtpResponse = {
  message: string;
  id: string;
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  code: string;
  purpose: "email_verification" | "password_reset";
};

export const authAPI = {
  getCsrfToken: (): Promise<{ data: CsrfToken }> =>
    InstanceAxis.get("/accounts/csrf/"),

  register: (
    userData: CreateUserData
  ): Promise<{ data: RegisterWithOtpResponse }> =>
    InstanceAxis.post("/users/register-with-otp/", userData),

  login: (credentials: LoginData): Promise<{ data: AuthResponse }> =>
    InstanceAxis.post("/users/login/", credentials),

  logout: (): Promise<{ data: { message: string } }> =>
    InstanceAxis.post("/users/logout/"),

  getCurrentUser: (): Promise<{ data: User }> =>
    InstanceAxis.get("/users/user-info/"),

  googleLogin: (
    googleToken: string
  ): Promise<{ data: AuthResponse & { is_new_user: boolean } }> =>
    InstanceAxis.post("/google-login/", { google_token: googleToken }),

  createPrestataire: (userData: CreateUserData): Promise<{ data: User }> =>
    InstanceAxis.post("/users/create_prestataire/", userData),

  createAdmin: (userData: CreateUserData): Promise<{ data: User }> =>
    InstanceAxis.post("/users/create_admin/", userData),

  refresh: (refresh: string): Promise<{ data: { refresh: string; access: string } }> =>
    InstanceAxis.post("/users/token/refresh/", { refresh }),

  verifyOtp: (payload: VerifyOtpPayload): Promise<{ data: { message: string; email: string; email_verified: boolean } }> =>
    InstanceAxis.post("/users/otp/verify/", payload),
};

export const registerApi = async (userData: CreateUserData) => {
  return await InstanceAxis.post("/accounts/users/", userData);
};

export const verifyEmailApi = async (email: string) => {
  return await InstanceAxis.post("/accounts/verify-email/", { email });
};

export const sendPasswordResetEmailApi = async (email: string) => {
  return await InstanceAxis.post("/accounts/send-password-reset-email/", { email });
};

export const passwordAPI = {
  request_reset_otp: async (payload: PasswordResetRequestPayload) => {
    return await InstanceAxis.post<{ message: string }>(
      "/users/otp/request/",
      {
        email: payload.email.trim().toLowerCase(),
        purpose: "password_reset",
      }
    );
  },

  reset_password: async (payload: PasswordResetPayload) => {
    return await InstanceAxis.post<{ message: string }>(
      "/users/password/reset/",
      {
        email: payload.email.trim().toLowerCase(),
        reset_token: String(payload.reset_token || payload.code || "").trim(),
        code: String(payload.code || payload.reset_token || "").trim(),
        new_password: payload.new_password,
        new_password_confirm: payload.new_password_confirm,
      }
    );
  },

  change_password: async (payload: ChangePasswordPayload) => {
    return await InstanceAxis.post<{ message: string }>(
      "/users/password/change/",
      payload,
    );
  },
};