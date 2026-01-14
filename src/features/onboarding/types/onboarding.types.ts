export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface OnboardingStatusResponse {
  status: OnboardingStatus;
  hasEvolutionInstance: boolean;
  hasN8nWorkflow: boolean;
  hasApiKey: boolean;
  error: string | null;
}

export type AgentGoal = 'MAKE_APPOINTMENTS' | 'SELL_PRODUCTS' | 'PROVIDE_INFORMATION';
export type AgentTone = 'friendly' | 'professional' | 'casual' | 'formal';

export interface AIAgentConfig {
  goal: AgentGoal;
  agentName: string;
  welcomeMessage: string;
  tone: AgentTone;
  language: string;
}

export interface CompleteOnboardingRequest {
  ai_agent_config: AIAgentConfig;
}

export interface CompleteOnboardingResponse {
  message: string;
  status: OnboardingStatus;
}
