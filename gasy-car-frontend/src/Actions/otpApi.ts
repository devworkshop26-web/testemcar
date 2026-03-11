import { InstanceAxis } from "@/helper/InstanceAxios";
import { VerifyOtpData, ResendOtpData, OtpResponse } from "@/types/otpTypes";

export const otpAPI = {
  // Vérifier un code OTP
  verifyOtp: (data: VerifyOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/users/otp/verify/", {
      email: data.email.trim().toLowerCase(),
      code: String(data.code).trim(),
      purpose: data.purpose,
    }),

  // Renvoyer un code OTP
  resendOtp: (data: ResendOtpData): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/users/otp/request/", {
      email: data.email.trim().toLowerCase(),
      purpose: data.purpose,
    }),

  // Vérifier l'OTP de réinitialisation de mot de passe
  verifyPasswordResetOtp: (
    data: VerifyOtpData
  ): Promise<{ data: OtpResponse }> =>
    InstanceAxis.post("/users/otp/verify/", {
      email: data.email.trim().toLowerCase(),
      code: String(data.code).trim(),
      purpose: "password_reset",
    }),
};