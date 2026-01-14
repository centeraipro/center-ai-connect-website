export interface Business {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  onboarding_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  subscription_status: string;
  subscription_plan: string | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  created_at: string;
  updated_at: string;
  ai_agent_config?: {
    [key: string]: any;
  } | null;
}

export interface QRCodeResponse {
  code: string;
  count: number;
  instanceName: string;
  pairingCode: string | null;
  qrCode: string;
}

export interface ConnectionStatus {
  instanceName: string;
  onboardingStatus: string;
  state: string; // Connection state (connecting, open, close)
}
