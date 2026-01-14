import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { onboardingService } from '../services/onboardingService';
import type {
  OnboardingStatusResponse,
  CompleteOnboardingRequest,
} from '../types/onboarding.types';

export function useOnboarding() {
  const { businessSlug } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async (): Promise<OnboardingStatusResponse | null> => {
    if (!businessSlug) {
      setError('No business found');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const status = await onboardingService.getOnboardingStatus(businessSlug);
      return status;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to check onboarding status';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (data: CompleteOnboardingRequest) => {
    if (!businessSlug) {
      throw new Error('No business found');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingService.completeOnboarding(businessSlug, data);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const retryOnboarding = async () => {
    if (!businessSlug) {
      throw new Error('No business found');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingService.retryOnboarding(businessSlug);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to retry onboarding';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkStatus,
    completeOnboarding,
    retryOnboarding,
    isLoading,
    error,
  };
}
