import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { DashboardContent } from './DashboardContent';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';

export function Dashboard() {
  const { user } = useAuth();
  const { checkStatus } = useOnboarding();
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.business) {
        setIsChecking(false);
        return;
      }

      // First check from user object (faster)
      if (user.business.onboarding_status) {
        setOnboardingStatus(user.business.onboarding_status);
        setIsChecking(false);

        // If not completed, verify with API
        if (user.business.onboarding_status !== 'completed') {
          const status = await checkStatus();
          if (status) {
            setOnboardingStatus(status.status);
          }
        }
      } else {
        // Fallback to API check
        const status = await checkStatus();
        if (status) {
          setOnboardingStatus(status.status);
        }
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground mt-3">Loading dashboard...</p>
      </div>
    );
  }

  // If onboarding is not completed, show onboarding page
  if (onboardingStatus === 'pending' || onboardingStatus === 'failed') {
    return <OnboardingPage />;
  }

  // If onboarding is in progress, show onboarding page (it will handle the status checking)
  if (onboardingStatus === 'in_progress') {
    return <OnboardingPage />;
  }

  // If onboarding is completed, show the dashboard
  return <DashboardContent />;
}
