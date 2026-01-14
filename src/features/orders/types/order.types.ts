export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  product_id: number;
  quantity: number;
  customizations?: Record<string, any>;
}

export interface Order {
  id: number;
  business_id: number;
  customer_id: number;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  business_id: number;
  customer_id: number;
  order_type: OrderType;
  delivery_address?: string;
  customer_notes?: string;
  internal_notes?: string;
  source?: string;
  order_items: OrderItem[];
}

export interface UpdateOrderData {
  status?: OrderStatus;
  delivery_address?: string;
  customer_notes?: string;
  internal_notes?: string;
}
