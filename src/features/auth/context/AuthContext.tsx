import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Admin } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthState {
  user: Admin | null;
  businessSlug: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setUser: (user: Admin | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    businessSlug: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    authService
      .getCurrentUser()
      .then((userData) => {
        setAuthState({
          user: userData,
          businessSlug: userData.business?.slug || null,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  const setUser = (user: Admin | null) => {
    setAuthState({
      user,
      businessSlug: user?.business?.slug || null,
      isAuthenticated: !!user,
      isLoading: false,
    });
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      businessSlug: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setAuthState({
        user: userData,
        businessSlug: userData.business?.slug || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
