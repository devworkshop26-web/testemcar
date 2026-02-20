import { useCallback, useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { accessTokenKey, refreshTokenKey } from '@/helper/InstanceAxios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://madagasycar.com/api';

export const useIdleTimeout = (timeoutMs: number = 15 * 60 * 1000) => {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }, []);

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
      clearTokens();
      navigate('/login', { replace: true });
    }
  }, [clearTokens, logout, navigate]);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    timeoutRef.current = setTimeout(() => {
      void performLogout();
    }, timeoutMs);
  }, [clearIdleTimer, performLogout, timeoutMs]);

  const logoutOnTabClose = useCallback(() => {
    const token = localStorage.getItem(accessTokenKey) || localStorage.getItem('access');

    if (token) {
      void fetch(`${API_BASE_URL}/users/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        keepalive: true,
      });
    }

    clearTokens();
  }, [clearTokens]);

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

    const onPageHide = () => {
      logoutOnTabClose();
    };

    window.addEventListener('pagehide', onPageHide);

    startIdleTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onUserActivity);
      });
      window.removeEventListener('pagehide', onPageHide);
      clearIdleTimer();
    };
  }, [clearIdleTimer, isAuthenticated, logoutOnTabClose, startIdleTimer]);
};
