export interface CsrfToken {
  csrfToken: string;
}

// types/auth.ts
export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  email: string;
  code: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}
