// Conversation Types
export type ConversationChannel =
  | 'web_chat'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'sms'
  | 'email';

export type ConversationStatus = 'active' | 'ended';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_delivery' | 'completed' | 'cancelled';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  order_type: string;
  status: OrderStatus;
  subtotal: string;
  total_amount: string;
  delivery_address: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  total: string;
}

export interface Appointment {
  id: number;
  scheduled_start: string;
  scheduled_end: string;
  status: AppointmentStatus;
  customer_notes: string | null;
  internal_notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  business_id: number;
  customer_id: number | null;
  customer?: Customer | null;
  channel: ConversationChannel;
  channel_identifier: string;
  session_id: string | null;
  order_id: number | null;
  order?: Order | null;
  appointment_id: number | null;
  appointment?: Appointment | null;
  assigned_admin_id: number | null;
  ai_enabled: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ConversationsResponse {
  data: Conversation[];
  pagination: PaginationInfo;
}

export interface ConversationFilters {
  page?: number;
  limit?: number;
  search?: string;
  channel?: ConversationChannel;
  status?: ConversationStatus;
  ai_enabled?: boolean;
  customer_id?: number;
  has_order?: boolean;
  has_appointment?: boolean;
  date_from?: string;
  date_to?: string;
}

export type MessageSenderType = 'customer' | 'ai_agent' | 'admin';
export type MessageType = 'text' | 'image' | 'audio' | 'document' | 'video';

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: MessageSenderType;
  sender_id: number | null;
  content: string;
  message_type: MessageType;
  mime_type: string | null;
  file_name: string | null;
  media_url: string | null;
  caption: string | null;
  intent: string | null;
  entities: Record<string, any> | null;
  metadata: Record<string, any> | null;
  sent_at: string;
  created_at: string;
  updated_at: string;
}

export interface SendMessagePayload {
  conversation_id: number;
  sender_type: MessageSenderType;
  content: string;
  message_type?: MessageType;
  sender_id?: number;
  mime_type?: string;
  file_name?: string;
  media_url?: string;
  caption?: string;
  intent?: string;
  entities?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateConversationPayload {
  customer_id?: number;
  order_id?: number;
  appointment_id?: number;
}

export interface ToggleAIPayload {
  enabled: boolean;
}

export interface AssignAdminPayload {
  admin_id: number | null;
}

export interface SendAdminMessagePayload {
  message: string;
}
