export interface Product {
  id: number;
  business_id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_active?: boolean;
}
