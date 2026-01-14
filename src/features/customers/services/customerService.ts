import type { Customer, CreateCustomerData, UpdateCustomerData } from '../types/customer.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const customerService = {
  async getCustomers(businessId: number, page: number = 1, limit: number = 10): Promise<Customer[]> {
    const url = new URL(`${API_BASE_URL}/customers/business/${businessId}`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString(), fetchOptions);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    
    const result = await response.json();
    return result.data || result;
  },

  async getCustomer(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    
    return response.json();
  },

  async createCustomer(customerData: CreateCustomerData): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create customer' }));
      throw new Error(error.message || 'Failed to create customer');
    }
    
    return response.json();
  },

  async updateCustomer(id: number, customerData: UpdateCustomerData): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      ...fetchOptions,
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update customer' }));
      throw new Error(error.message || 'Failed to update customer');
    }
    
    return response.json();
  },

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      ...fetchOptions,
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
  },

  async searchCustomers(businessId: number, query: string, limit: number = 20): Promise<Customer[]> {
    const url = new URL(`${API_BASE_URL}/customers/business/${businessId}/search`);
    url.searchParams.append('q', query);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error('Failed to search customers');
    }

    const result = await response.json();
    return result.data || result;
  },
};
