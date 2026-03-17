// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../useQuery';
import { User, UserRole } from '../types/userType'; 

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, login, register, logout } = useAuth();

  // Ensure we have the latest user data if a token exists
  useEffect(() => {
    if (!currentUser.data && !currentUser.isLoading && !currentUser.isError) {
        // Optional: Trigger refetch if needed, but react-query usually handles this 
        // based on the query key and enabled status in useAuth
    }
  }, [currentUser.data, currentUser.isLoading, currentUser.isError]);

  const user = currentUser.data || null;
  const role = (user?.role as UserRole) || null;
  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    role,
    isLoading: currentUser.isLoading,
    isAuthenticated,
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutateAsync,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};