import React from 'react';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

export const SessionManager: React.FC = () => {
  useIdleTimeout();
  return null;
};
