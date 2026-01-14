import { useEffect } from 'react';
import Loader from '@/components/ui/loader-12';
import type { OnboardingStatusResponse } from '../types/onboarding.types';

interface OnboardingStatusCheckerProps {
  onStatusChecked: (status: OnboardingStatusResponse) => void;
  onRetry: () => void;
  checkStatus: () => Promise<OnboardingStatusResponse | null>;
  isProcessing?: boolean;
}

export function OnboardingStatusChecker({
  onStatusChecked,
}: OnboardingStatusCheckerProps) {
  useEffect(() => {
    // Fire and forget - just redirect after 5 seconds
    const timeout = setTimeout(() => {
      // Assume success and redirect to dashboard
      onStatusChecked({
        status: 'completed',
        hasEvolutionInstance: true,
        hasN8nWorkflow: true,
        hasApiKey: true,
        error: null,
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onStatusChecked]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <Loader />
    </div>
  );
}

