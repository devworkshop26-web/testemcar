import { useMutation } from "@tanstack/react-query";
import { VerifyOtpData, ResendOtpData } from "@/types/otpTypes";
import { otpAPI } from "@/Actions/otpApi";

export const useOtp = () => {
  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpData) => otpAPI.verifyOtp(data),
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: ResendOtpData) => otpAPI.resendOtp(data),
  });

  const verifyPasswordResetOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpData) => otpAPI.verifyPasswordResetOtp(data),
  });

  return {
    verifyOtp: verifyOtpMutation,
    resendOtp: resendOtpMutation,
    verifyPasswordResetOtp: verifyPasswordResetOtpMutation,
  };
};