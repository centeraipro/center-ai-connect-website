import axios from 'axios';
import type { Order, CreateOrderData, UpdateOrderData } from '../types/order.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const orderService = {
  async getOrdersByBusiness(businessId: number, page: number = 1, limit: number = 10): Promise<Order[]> {
    const response = await axios.get(`${API_BASE_URL}/orders/business/${businessId}`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data.data || response.data;
  },

  async getOrderById(orderId: number): Promise<Order> {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    const response = await axios.get(`${API_BASE_URL}/orders/customer/${customerId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateOrder(orderId: number, orderData: UpdateOrderData): Promise<Order> {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, orderData, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteOrder(orderId: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
      withCredentials: true,
    });
  },
};
