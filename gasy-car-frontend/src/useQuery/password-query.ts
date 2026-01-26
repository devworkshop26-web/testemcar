import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { passwordAPI } from "@/Actions/authApi";
import { ChangePasswordPayload, PasswordResetRequestPayload,  } from "@/types/authType";

interface PasswordResetResponse {
  message?: string;
}

// export const usePasswordResetMutation = () => {
//   return useMutation<PasswordResetResponse, AxiosError, PasswordResetRequestPayload>({
//     mutationFn: (payload: PasswordResetRequestPayload) =>
//       passwordAPI.request_password_reset(payload).then((res) => res.data),
//   });
// };


export const usePasswordResetMutation = () => {
  return useMutation({
    mutationFn: (payload: PasswordResetRequestPayload) =>
      passwordAPI.reset_password(payload).then((res) => res.data),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      passwordAPI.change_password(payload).then((res) => res.data),
  });
};
