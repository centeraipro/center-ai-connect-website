// Statistics Types
export interface ConversationStatistics {
  total: number;
  active: number;
  ended: number;
}

export interface ResponseTimeStatistics {
  average_seconds: number;
  median_seconds: number;
  min_seconds: number;
  max_seconds: number;
}

export interface MessageStatistics {
  total: number;
  by_sender_type: {
    customer: number;
    ai_agent: number;
    admin: number;
  };
}

// Query parameters
export interface StatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  channel?: 'whatsapp' | 'web_chat' | 'instagram' | 'facebook' | 'telegram' | 'sms' | 'email';
  status?: 'active' | 'ended';
  senderType?: 'customer' | 'ai_agent' | 'admin';
  messageType?: 'text' | 'image' | 'audio' | 'document' | 'video';
}

// Combined dashboard statistics
export interface DashboardStatistics {
  conversations: ConversationStatistics;
  responseTime: ResponseTimeStatistics;
  messages: MessageStatistics;
}
