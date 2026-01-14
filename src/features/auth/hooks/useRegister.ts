import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from './useAuth';
import type { RegisterBusinessRequest } from '../types/auth.types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  const handleRegister = async (data: RegisterBusinessRequest, setAuthState = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.registerBusiness(data);
      // Only set user state if explicitly requested (not during checkout flow)
      if (setAuthState) {
        setUser(response.admin);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register: handleRegister, isLoading, error };
}
