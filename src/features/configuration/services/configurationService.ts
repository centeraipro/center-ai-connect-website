import axios from 'axios';
import type { Business, QRCodeResponse, ConnectionStatus } from '../types/configuration.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const configurationService = {
  async getBusiness(slug: string): Promise<Business> {
    const response = await axios.get(`${API_BASE_URL}/api/businesses/${slug}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getQRCode(slug: string): Promise<QRCodeResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/businesses/${slug}/qr-code`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getConnectionStatus(slug: string): Promise<ConnectionStatus> {
    const response = await axios.get(`${API_BASE_URL}/api/businesses/${slug}/connection-status`, {
      withCredentials: true,
    });
    return response.data;
  },
};
