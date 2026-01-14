export interface Service {
  id: number;
  business_id?: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceDto {
  business_id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  image_url?: string;
  is_active?: boolean;
}

export interface PaginatedServicesResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
}
