import type {
  Conversation,
  ConversationsResponse,
  ConversationFilters,
  Message,
  SendMessagePayload,
  UpdateConversationPayload,
  ToggleAIPayload,
  AssignAdminPayload,
  SendAdminMessagePayload,
} from '../types/conversation.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const fetchOptions: RequestInit = {
  credentials: 'include', // Important: This sends cookies with the request
  headers: {
    'Content-Type': 'application/json',
  },
};

function buildQueryParams(filters: ConversationFilters): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  return params;
}

export const conversationService = {
  // Get conversations assigned to current user
  async getAssignedConversations(filters: ConversationFilters = {}): Promise<ConversationsResponse> {
    const url = new URL(`${API_BASE_URL}/conversations/assigned-to-me`);
    const params = buildQueryParams(filters);
    url.search = params.toString();

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error('Failed to fetch assigned conversations');
    }

    return response.json();
  },

  // Get all conversations for a business
  async getBusinessConversations(businessId: number, filters: ConversationFilters = {}): Promise<ConversationsResponse> {
    const url = new URL(`${API_BASE_URL}/conversations/business/${businessId}`);
    const params = buildQueryParams(filters);
    url.search = params.toString();

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error('Failed to fetch business conversations');
    }

    return response.json();
  },

  // Get specific conversation
  async getConversation(id: number): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    
    return response.json();
  },

  // Update conversation
  async updateConversation(id: number, payload: UpdateConversationPayload): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
      ...fetchOptions,
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update conversation');
    }
    
    return response.json();
  },

  // End conversation
  async endConversation(id: number): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/end`, {
      ...fetchOptions,
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to end conversation');
    }
    
    return response.json();
  },

  // Toggle AI
  async toggleAI(id: number, payload: ToggleAIPayload): Promise<{ message: string; conversation: Conversation }> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/toggle-ai`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle AI');
    }
    
    return response.json();
  },

  // Assign admin
  async assignAdmin(id: number, payload: AssignAdminPayload): Promise<{ message: string; conversation: Conversation }> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/assign-admin`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to assign admin');
    }
    
    return response.json();
  },

  // Send admin message
  async sendAdminMessage(id: number, payload: SendAdminMessagePayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}/admin-message`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  },

  // Get messages for conversation
  async getMessages(conversationId: number): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/messages/conversation/${conversationId}`,
      fetchOptions
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  },

  // Get latest messages
  async getLatestMessages(conversationId: number, limit: number = 10): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/messages/conversation/${conversationId}/latest?limit=${limit}`,
      fetchOptions
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch latest messages');
    }
    
    return response.json();
  },

  // Send message
  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },
};
