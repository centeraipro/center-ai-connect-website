export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentSource = 'ai_agent' | 'manual' | 'customer_portal';

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

export interface Service {
  id: number;
  business_id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  business_id: number;
  customer: Customer;
  service: Service;
  scheduled_start: string;
  scheduled_end: string;
  customer_notes: string | null;
  internal_notes: string | null;
  status: AppointmentStatus;
  source: AppointmentSource;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  business_id: number;
  customer_id: number;
  service_id: number;
  scheduled_start: string;
  scheduled_end: string;
  customer_notes?: string;
  internal_notes?: string;
  source?: AppointmentSource;
}

export interface UpdateAppointmentRequest {
  scheduled_start?: string;
  scheduled_end?: string;
  status?: AppointmentStatus;
  customer_notes?: string;
  internal_notes?: string;
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
