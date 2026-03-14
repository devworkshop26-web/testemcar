import { InstanceAxis } from "@/helper/InstanceAxios";
import { VerifyOtpData, ResendOtpData, OtpResponse } from "@/types/otpTypes";

export const otpAPI = {
  // Vérifier un code OTP
  verifyOtp: (data: VerifyOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/accounts/verify-otp/", data),

  // Renvoyer un code OTP
  resendOtp: (data: ResendOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/accounts/resend-otp/", data),

  // Vérifier l'OTP de réinitialisation de mot de passe
  verifyPasswordResetOtp: (data: VerifyOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/accounts/verify-password-reset-otp/", data),
};