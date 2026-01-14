export interface Customer {
  id: number;
  business_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  business_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}
