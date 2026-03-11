import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { passwordAPI } from "@/Actions/authApi";
import {
  ChangePasswordPayload,
  PasswordResetPayload,
  PasswordResetRequestPayload,
} from "@/types/authType";

interface ApiResponse {
  message?: string;
  error?: string;
  detail?: string;
}

export const useRequestPasswordResetMutation = () => {
  return useMutation<ApiResponse, AxiosError, PasswordResetRequestPayload>({
    mutationFn: (payload: PasswordResetRequestPayload) =>
      passwordAPI.request_reset_otp(payload).then((res) => res.data),
  });
};

export const useConfirmPasswordResetMutation = () => {
  return useMutation<ApiResponse, AxiosError, PasswordResetPayload>({
    mutationFn: (payload: PasswordResetPayload) =>
      passwordAPI.reset_password(payload).then((res) => res.data),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<ApiResponse, AxiosError, ChangePasswordPayload>({
    mutationFn: (payload: ChangePasswordPayload) =>
      passwordAPI.change_password(payload).then((res) => res.data),
  });
};