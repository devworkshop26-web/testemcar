export interface VerifyOtpData {
  email: string;
  purpose: string;
  code: string;
}

export interface ResendOtpData {
  email: string;
  purpose: string;

}

export interface OtpResponse {
  message: string;
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  role?: string;
}

export interface OtpState {
  email: string;
  otp: string[];
  isLoading: boolean;
  error: string;
  countdown: number;
  canResend: boolean;
}