import { useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { accessTokenKey, refreshTokenKey } from '@/helper/InstanceAxios';

export const useIdleTimeout = (timeoutMs: number = 15 * 60 * 1000) => {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    timeoutRef.current = setTimeout(async () => {
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
    }, timeoutMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, logout, navigate, timeoutMs]);
};
