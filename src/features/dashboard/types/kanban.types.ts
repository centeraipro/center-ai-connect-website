// Kanban Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface AssignedAdmin {
  id: number;
  name: string;
  email: string;
}

export interface Lead {
  id: number;
  position: number;
  score: number;
  priority: 'hot' | 'warm' | 'cold';
  customer: Customer;
  kanban_column_id: number;
  assigned_admin: AssignedAdmin | null;
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  id: number;
  name: string;
  order: number;
  color: string;
  leads: Lead[];
  kanban_board_id: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanBoard {
  id: number;
  name: string;
  is_active: boolean;
  business_id: number;
  columns: KanbanColumn[];
  created_at: string;
  updated_at: string;
}

// Request/Response types
export interface CreateBoardRequest {
  name: string;
  language?: 'en' | 'es' | 'pt';
}

export interface MoveLeadRequest {
  targetColumnId: number;
  position: number;
}

export interface UpdateLeadCustomFieldsRequest {
  [key: string]: unknown;
}

export interface AssignLeadRequest {
  adminId: number;
}

export interface CreateLeadRequest {
  customerId: number;
  columnId: number;
}

// Error types
export interface LeadLimitError {
  error: string;
  message: string;
  currentCount: number;
  limit: number;
  planName: string;
}
