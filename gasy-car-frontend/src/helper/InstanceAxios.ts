import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://madagasycar.com/api";

/**
 * WS basé DIRECTEMENT sur l’API
 */
export const WS_BASE_URL = API_BASE_URL
  .replace(/^https?:\/\//, (match: string) =>
    match === "https://" ? "wss://" : "ws://"
  )
  .replace(/\/api$/, "");

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
 * SYSTEME DE REFRESH ROBUSTE
 * - Empêche les refresh multiples
 * - File d’attente des requêtes en attente du refresh
 */

let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

// Gère les requêtes en file d’attente
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token && prom.config.headers) {
        prom.config.headers["Authorization"] = `Bearer ${token}`;
      }
      prom.resolve(InstanceAxis(prom.config));
    }
  });

  failedQueue = [];
};

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

// Intercepteur : gère les erreurs & refresh
InstanceAxis.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    // Pas de réponse => problème réseau, on ne tente pas de refresh
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 401 : token expiré potentiellement
    const isUnauthorized = status === 401;

    // Ne JAMAIS tenter de refresh :
    // - sur les endpoints d'auth eux-mêmes
    // - si un flag _skipRefresh est présent
    if (!isUnauthorized || isAuthEndpoint(originalRequest.url) || originalRequest._skipRefresh) {
      return Promise.reject(error);
    }

    // Empêcher boucle infinie
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // Si un refresh est déjà en cours → mettre la requête dans la file d'attente
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(refreshTokenKey) || localStorage.getItem("refresh");
      if (!refreshToken) throw new Error("No refresh token");

      // Utiliser axios "nu" pour le refresh (pas InstanceAxis pour éviter intercepteurs)
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/users/token/refresh/`,
        { refresh: refreshToken },
        {
          _skipAuth: true,
          _skipRefresh: true,
        }
      );

      const newAccess = (refreshResponse.data as any).access;
      const newRefresh = (refreshResponse.data as any).refresh;

      if (!newAccess) throw new Error("No access token in refresh response");

      // Sauvegarde tokens
      localStorage.setItem(accessTokenKey, newAccess);
      localStorage.setItem("access", newAccess);

      if (newRefresh) {
        localStorage.setItem(refreshTokenKey, newRefresh);
        localStorage.setItem("refresh", newRefresh);
      }


      // Rejouer toutes les requêtes en attente avec le nouveau token
      processQueue(null, newAccess);

      // Rejouer la requête originale
      if (!originalRequest.headers) originalRequest.headers = {} as AxiosRequestHeaders;
      originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

      return InstanceAxis(originalRequest);
    } catch (err) {
      // Propager l'erreur à toutes les requêtes en attente
      processQueue(err as AxiosError, null);

      // Nettoyer tokens et déconnecter
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
      // window.location.href = "/";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
