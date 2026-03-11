export interface VerifyOtpData {
  email: string;
  purpose: "email_verification" | "password_reset";
  code: string;
}

export interface ResendOtpData {
  email: string;
  purpose: "email_verification" | "password_reset";
}

export interface OtpResponse {
  message?: string;
  error?: string;
  verified?: boolean;
  success?: boolean;
  access_token?: string;
  refresh_token?: string;
  role?: string;
  email?: string;
  user_id?: string;
  reset_token?: string;
}

export interface OtpState {
  email: string;
  otp: string[];
  isLoading: boolean;
  error: string;
  countdown: number;
  canResend: boolean;
}