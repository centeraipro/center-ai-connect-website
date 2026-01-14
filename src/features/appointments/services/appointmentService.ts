import axios from 'axios';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, Customer, Service } from '../types/appointment.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const appointmentService = {
  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await axios.post(`${API_BASE_URL}/api/appointments`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAppointment(id: number): Promise<Appointment> {
    const response = await axios.get(`${API_BASE_URL}/api/appointments/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateAppointment(id: number, data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await axios.put(`${API_BASE_URL}/api/appointments/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteAppointment(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getBusinessAppointments(businessId: number): Promise<Appointment[]> {
    const response = await axios.get(`${API_BASE_URL}/api/appointments/business/${businessId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getCustomerAppointments(customerId: number): Promise<Appointment[]> {
    const response = await axios.get(`${API_BASE_URL}/api/appointments/customer/${customerId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAppointmentsByDateRange(
    businessId: number,
    startDate: string,
    endDate: string
  ): Promise<Appointment[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/appointments/business/${businessId}/date-range`,
      {
        params: { startDate, endDate },
        withCredentials: true,
      }
    );
    return response.data;
  },

  async searchCustomers(businessId: number, query: string, limit: number = 10): Promise<Customer[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/customers/business/${businessId}/search`,
      {
        params: { q: query, limit },
        withCredentials: true,
      }
    );
    return response.data;
  },

  async searchServices(businessId: number, query: string, limit: number = 10): Promise<Service[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/services/business/${businessId}/search`,
      {
        params: { q: query, limit },
        withCredentials: true,
      }
    );
    return response.data;
  },
};
