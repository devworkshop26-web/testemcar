import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useIdleTimeout = (timeoutMs: number = 300000) => { // 5 minutes default
  const [isIdle, setIsIdle] = useState(false);
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutMs);
  }, [timeoutMs]);

  const handleActivity = useCallback(() => {
    if (!isIdle) {
      startTimer();
    }
  }, [isIdle, startTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial timer
    startTimer();

    // Event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isAuthenticated, handleActivity, startTimer]);

  const handleContinue = () => {
    setIsIdle(false);
    startTimer();
  };

  const handleLogout = async () => {
    setIsIdle(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await logout();
    navigate('/login');
  };

  return { isIdle, handleContinue, handleLogout };
};
