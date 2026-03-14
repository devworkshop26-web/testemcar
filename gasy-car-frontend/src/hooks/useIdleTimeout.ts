import { useCallback, useEffect, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios";

export const useIdleTimeout = (timeoutMs: number = 15 * 60 * 1000) => {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggingOutRef = useRef(false);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      await logout();
    } catch {
      // Si la déconnexion API échoue, on force quand même la sortie locale
    } finally {
      clearIdleTimer();
      clearTokens();
      isLoggingOutRef.current = false;
      navigate("/login?reason=inactive", { replace: true });
    }
  }, [clearIdleTimer, clearTokens, logout, navigate]);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();

    if (!isAuthenticated) return;

    timeoutRef.current = setTimeout(() => {
      void performLogout();
    }, timeoutMs);
  }, [clearIdleTimer, isAuthenticated, performLogout, timeoutMs]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearIdleTimer();
      return;
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const onUserActivity = () => {
      startIdleTimer();
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, onUserActivity, { passive: true });
    });

    startIdleTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onUserActivity);
      });
      clearIdleTimer();
    };
  }, [clearIdleTimer, isAuthenticated, startIdleTimer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        startIdleTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, startIdleTimer]);
};
