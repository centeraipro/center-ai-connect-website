import type {
  OnboardingStatusResponse,
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
} from '../types/onboarding.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/businesses';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const onboardingService = {
  async getOnboardingStatus(slug: string): Promise<OnboardingStatusResponse> {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}/${slug}/onboarding-status`,
      {
        method: 'GET',
        ...fetchOptions,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch onboarding status');
    }

    return response.json();
  },

  async completeOnboarding(
    slug: string,
    data: CompleteOnboardingRequest
  ): Promise<CompleteOnboardingResponse> {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}/${slug}/complete-onboarding`,
      {
        method: 'POST',
        ...fetchOptions,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete onboarding');
    }

    return response.json();
  },

  async retryOnboarding(slug: string): Promise<CompleteOnboardingResponse> {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}/${slug}/retry-onboarding`,
      {
        method: 'POST',
        ...fetchOptions,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retry onboarding');
    }

    return response.json();
  },
};
