import { queryClient } from "@/lib/queryClient";
import { accessTokenKey, refreshTokenKey } from "./InstanceAxios";

export const deconnectionAction = (redirectTo: string | unknown = "/login") => {
  const safeRedirectTo = typeof redirectTo === "string" && redirectTo.trim()
    ? redirectTo
    : "/login";

  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("email_verification_token");
  localStorage.removeItem("last_activity_at");
  localStorage.removeItem("logout_reason");
  localStorage.removeItem("password_reset_email");
  localStorage.removeItem("password_reset_token");
  localStorage.removeItem("user_email");

  queryClient.clear();

  window.location.href = safeRedirectTo;
};

export const videLocalStorage = () => {
  localStorage.clear();
  queryClient.clear();
};

export function formatDate(dateString?: string) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}