// Channel types
export type Channel = 'whatsapp' | 'web_chat' | 'instagram' | 'facebook' | 'telegram' | 'sms' | 'email';

// Conversation status types
export type ConversationStatus = 'active' | 'ended';

// Sender types
export type SenderType = 'customer' | 'ai_agent' | 'admin';

// Message types
export type MessageType = 'text' | 'image' | 'audio' | 'document' | 'video';

// Granularity types
export type Granularity = 'day' | 'week' | 'month';

// Date filter parameters
export interface DateFilters {
  startDate?: string;
  endDate?: string;
}

// Conversations Total
export interface ConversationsTotalFilters extends DateFilters {
  channel?: Channel;
  status?: ConversationStatus;
}

export interface ConversationsTotalResponse {
  active: number;
  ended: number;
  total: number;
}

// Messages Total
export interface MessagesTotalFilters extends DateFilters {
  senderType?: SenderType;
  messageType?: MessageType;
}

export interface MessagesTotalResponse {
  bySenderType: {
    customer?: number;
    ai_agent?: number;
    admin?: number;
  };
  byMessageType: {
    text?: number;
    image?: number;
    audio?: number;
    document?: number;
    video?: number;
  };
  total: number;
}

// Conversations Timeline
export interface ConversationsTimelineFilters extends DateFilters {
  granularity: Granularity;
}

export interface TimelineDataPoint {
  date: string;
  count: number;
}

export type ConversationsTimelineResponse = TimelineDataPoint[];

// Response Time
export interface ResponseTimeFilters extends DateFilters {}

export interface ResponseTimeResponse {
  averageSeconds: number;
  medianSeconds: number;
  minSeconds: number;
  maxSeconds: number;
}

// Conversation Duration
export interface ConversationDurationFilters extends DateFilters {}

export interface ConversationDurationResponse {
  averageMinutes: number;
  medianMinutes: number;
  minMinutes: number;
  maxMinutes: number;
}

// Channels Distribution
export interface ChannelsDistributionFilters extends DateFilters {}

export interface ChannelDistributionItem {
  channel: string;
  conversationCount: number;
  messageCount: number;
  percentage: number;
}

export type ChannelsDistributionResponse = ChannelDistributionItem[];

// Customer Engagement
export interface CustomerEngagementFilters extends DateFilters {}

export interface CustomerEngagementResponse {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  returningCustomerRate: number;
}

// Orders Summary
export interface OrdersSummaryFilters extends DateFilters {}

export interface OrdersSummaryResponse {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  aiGeneratedOrders: number;
  aiGeneratedPercentage?: number;
  byStatus: {
    pending?: number;
    completed?: number;
    cancelled?: number;
  };
}

// Appointments Summary
export interface AppointmentsSummaryFilters extends DateFilters {}

export interface AppointmentsSummaryResponse {
  totalAppointments: number;
  aiGeneratedAppointments: number;
  aiGeneratedPercentage?: number;
  bookingRate: number;
  byStatus: {
    scheduled?: number;
    completed?: number;
    cancelled?: number;
  };
}

// Conversions
export interface ConversionsFilters extends DateFilters {}

export interface ConversionsResponse {
  conversationToOrder: number;
  conversationToAppointment: number;
  byChannel: {
    [key: string]: {
      conversationToOrder: number;
      conversationToAppointment: number;
    };
  };
}

// Peak Hours
export interface PeakHoursFilters extends DateFilters {}

export interface PeakHourDataPoint {
  hour: number;
  messageCount: number;
  conversationCount: number;
}

export type PeakHoursResponse = PeakHourDataPoint[];

// AI Performance
export interface AIPerformanceFilters extends DateFilters {}

export interface AIPerformanceResponse {
  totalMessages: number;
  aiHandledMessages: number;
  adminHandledMessages: number;
  aiHandledPercentage: number;
}
