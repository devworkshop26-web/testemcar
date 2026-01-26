import { queryClient } from "@/lib/queryClient";
import { accessTokenKey, refreshTokenKey } from "./InstanceAxios";

// ❗ PAS de useNavigate ici → fichier utilitaire
export const deconnectionAction = () => {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem("email_verification_token");

  // Vider le cache de TanStack Query
  queryClient.clear();

  window.location.href = "/";
};

export const videLocalStorage = () => {
  localStorage.clear();
  queryClient.clear();

}

export function formatDate(dateString?: string) {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;

}
