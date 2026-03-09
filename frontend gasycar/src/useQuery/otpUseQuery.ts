import { useMutation } from '@tanstack/react-query';
import { VerifyOtpData, ResendOtpData } from '@/types/otpTypes';
import { otpAPI } from '@/Actions/otpApi';

export const useOtp = () => {
  // Mutation pour vérifier l'OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpData) => otpAPI.verifyOtp(data),
  });

  // Mutation pour renvoyer l'OTP
  const resendOtpMutation = useMutation({
    mutationFn: (data: ResendOtpData) => otpAPI.resendOtp(data),
  });

  // Mutation pour vérifier l'OTP de réinitialisation
  const verifyPasswordResetOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpData) => otpAPI.verifyPasswordResetOtp(data),
  });

  return {
    verifyOtp: verifyOtpMutation,
    resendOtp: resendOtpMutation,
    verifyPasswordResetOtp: verifyPasswordResetOtpMutation,
  };
};