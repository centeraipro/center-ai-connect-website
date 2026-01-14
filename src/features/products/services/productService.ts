import axios from 'axios';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const productService = {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await axios.post(`${API_BASE_URL}/api/products`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getProducts(page: number = 1, limit: number = 10): Promise<Product[]> {
    const response = await axios.get(`${API_BASE_URL}/api/products`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data.data || response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getProductBySku(sku: string): Promise<Product> {
    const response = await axios.get(`${API_BASE_URL}/api/products/sku`, {
      params: { sku },
      withCredentials: true,
    });
    return response.data;
  },

  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
    const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
