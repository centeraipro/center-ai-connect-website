import axios from 'axios';
import type { Service, CreateServiceDto, UpdateServiceDto } from '../types/service.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/services`;

export const serviceService = {
  async getBusinessServices(businessId: number, page: number = 1, limit: number = 20): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/business/${businessId}`, {
      params: { page, limit },
      withCredentials: true,
    });
    // Handle both array response (no pagination) and paginated response
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  async searchServices(businessId: number, query: string, limit: number = 20): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/business/${businessId}/search`, {
      params: { q: query, limit },
      withCredentials: true,
    });
    return response.data;
  },

  async getService(id: number): Promise<Service> {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createService(data: CreateServiceDto): Promise<Service> {
    const response = await axios.post(API_URL, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateService(id: number, data: UpdateServiceDto): Promise<Service> {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteService(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
  },
};
