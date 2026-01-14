export interface Business {
  id: number;
  slug: string;
  name: string;
  ai_agent_config: AgentConfig;
  onboarding_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  subscription_status: string;
  subscription_plan: string | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentConfig {
  goal: 'MAKE_APPOINTMENTS' | 'SELL_PRODUCTS' | 'PROVIDE_INFORMATION';
  agentName: string;
  welcomeMessage: string;
  tone: 'friendly' | 'professional' | 'casual' | 'formal';
  language: string;
}

export interface Admin {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_owner: boolean;
  is_active: boolean;
  role: 'admin' | 'super_admin';
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  business?: Business;
}

export type AuthRole = 'admin' | 'super_admin';

export interface RegisterBusinessRequest {
  business_slug: string;
  business_name: string;
  email: string;
  password: string;
  plan: 'starter' | 'professional' | 'enterprise';
  success_url?: string;
  cancel_url?: string;
}

export interface RegisterBusinessResponse {
  business: Business;
  admin: Admin;
  checkout_url: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends Admin {
  business: Business;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterAdminResponse extends Admin {}
