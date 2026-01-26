import React from 'react';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { SessionTimeoutModal } from './SessionTimeoutModal';

export const SessionManager: React.FC = () => {
  const { isIdle, handleContinue, handleLogout } = useIdleTimeout();

  return (
    <SessionTimeoutModal
      isOpen={isIdle}
      onContinue={handleContinue}
      onLogout={handleLogout}
    />
  );
};
