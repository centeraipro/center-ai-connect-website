import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { OnboardingForm } from '../components/OnboardingForm';
import { OnboardingStatusChecker } from '../components/OnboardingStatusChecker';
import { PaymentRequired } from '../components/PaymentRequired';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
import type { AIAgentConfig, OnboardingStatusResponse } from '../types/onboarding.types';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { checkStatus, completeOnboarding, retryOnboarding, isLoading } = useOnboarding();
  const [currentStatus, setCurrentStatus] = useState<OnboardingStatusResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  // Check initial status when component mounts
  useEffect(() => {
    const checkInitialStatus = async () => {
      const status = await checkStatus();
      if (status) {
        setCurrentStatus(status);

        // If already completed, redirect to dashboard
        if (status.status === 'completed') {
          await refreshUser();
          navigate('/app', { replace: true });
        } else if (status.status === 'in_progress') {
          // If in progress, show status checker
          setShowForm(false);
          setIsProcessing(true);
        }
      }
    };

    checkInitialStatus();
  }, []);

  const handleFormSubmit = async (data: AIAgentConfig) => {
    // Fire and forget - show loader immediately
    setShowForm(false);
    setIsProcessing(true);

    // Submit in background, don't wait for response
    completeOnboarding({ ai_agent_config: data }).catch((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Onboarding error:', error);

      // Check if it's a payment required error
      if (errorMessage.includes('subscription') || errorMessage.includes('Payment Required')) {
        setShowPayment(true);
        setShowForm(false);
        setIsProcessing(false);
      }
    });
  };

  const handlePayNow = async () => {
    if (!user?.business) return;

    setIsCreatingCheckout(true);
    try {
      const success_url = `${window.location.origin}/payment-success`;
      const cancel_url = `${window.location.origin}/app`;

      const response = await paymentService.createCheckoutSession({
        business_id: user.business.id,
        plan: (user.business.subscription_plan || 'professional') as 'starter' | 'professional' | 'enterprise',
        success_url,
        cancel_url,
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error('Error al crear la sesión de pago');
      console.error('Payment error:', error);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleStatusChecked = async (status: OnboardingStatusResponse) => {
    setCurrentStatus(status);
    await refreshUser();
    navigate('/app', { replace: true });
  };

  const handleRetry = async () => {
    try {
      await retryOnboarding();
      toast.success('Reintentando configuración...');
      setIsProcessing(true);
    } catch (error) {
      toast.error('Error al reintentar la configuración');
      console.error('Retry error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full">
        {showPayment && (
          <PaymentRequired onPayNow={handlePayNow} isLoading={isCreatingCheckout} />
        )}

        {showForm && !showPayment && (
          <OnboardingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {!showForm && !showPayment && (
          <OnboardingStatusChecker
            onStatusChecked={handleStatusChecked}
            onRetry={handleRetry}
            checkStatus={checkStatus}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
}
