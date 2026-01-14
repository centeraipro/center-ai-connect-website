const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

interface CreateCheckoutSessionRequest {
  business_id: number;
  plan: 'starter' | 'professional' | 'enterprise';
  success_url: string;
  cancel_url: string;
}

interface CreateCheckoutSessionResponse {
  session_id: string;
  url: string;
}

export const paymentService = {
  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  },
};
