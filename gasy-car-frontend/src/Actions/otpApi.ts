import { InstanceAxis } from "@/helper/InstanceAxios";
import { VerifyOtpData, ResendOtpData, OtpResponse } from "@/types/otpTypes";

export const otpAPI = {
  // Vérifier un code OTP
  verifyOtp: (data: VerifyOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/users/otp/verify/", data),

  // Renvoyer un code OTP
  resendOtp: (data: ResendOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("users/otp/request/", data),

  // Vérifier l'OTP de réinitialisation de mot de passe
  verifyPasswordResetOtp: (data: VerifyOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/users/verify-password-reset-otp/", data),
};