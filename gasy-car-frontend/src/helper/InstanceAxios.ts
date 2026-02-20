import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://madagasycar.com/api";

/**
 * WS basé DIRECTEMENT sur l’API
 */
export const WS_BASE_URL = API_BASE_URL
  .replace(/^https?:\/\//, (match: string) =>
    match === "https://" ? "wss://" : "ws://"
  )
  .replace(/\/api$/, "");

export const resolveWsBaseUrl = (base: string) => {
  const fromEnv = String(base ?? "").trim();

  if (fromEnv) {
    const normalized = fromEnv.replace(/\/api\/?$/, "");
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      return normalized.replace(/^ws:\/\//, "wss://").replace(/^http:\/\//, "wss://");
    }

    return normalized
      .replace(/^https:\/\//, "wss://")
      .replace(/^http:\/\//, "ws://");
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}`;
  }

  return "";
};

export const accessTokenKey = "access_token";
export const refreshTokenKey = "refresh_token";

/**
 * Extension du type AxiosRequestConfig pour nos flags internes.
 */
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    _skipAuth?: boolean;    // ne pas ajouter Authorization
    _skipRefresh?: boolean; // ne pas tenter de refresh sur 401
  }
}

export const InstanceAxis = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper : détecter si une URL est un endpoint d’auth (login / refresh)
 */
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    url.includes("/users/login") ||
    url.includes("/users/token/refresh")
  );
};

// Intercepteur : ajoute le token (sauf pour login / refresh ou _skipAuth)
InstanceAxis.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(accessTokenKey) || localStorage.getItem("access");

    // ne JAMAIS mettre Authorization sur login / refresh ou si _skipAuth explicitement demandé
    if (!config._skipAuth && !isAuthEndpoint(config.url) && token) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur : gère les erreurs d'auth sans refresh automatique
InstanceAxis.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    // Pas de réponse => problème réseau, on ne tente pas de refresh
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Sur 401 (hors endpoints d'auth), on force la déconnexion locale.
    const isUnauthorized = status === 401;
    if (!isUnauthorized || isAuthEndpoint(originalRequest.url) || originalRequest._skipRefresh) {
      return Promise.reject(error);
    }

    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    return Promise.reject(error);
  }
);
