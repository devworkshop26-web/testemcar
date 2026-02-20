import { useCallback, useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { accessTokenKey, refreshTokenKey } from '@/helper/InstanceAxios';

export const useIdleTimeout = (timeoutMs: number = 15 * 60 * 1000) => {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const performLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // La déconnexion côté API peut échouer si le token est déjà expiré.
    } finally {
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      navigate('/login', { replace: true });
    }
  }, [logout, navigate]);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    timeoutRef.current = setTimeout(() => {
      void performLogout();
    }, timeoutMs);
  }, [clearIdleTimer, performLogout, timeoutMs]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearIdleTimer();
      return;
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
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
};
