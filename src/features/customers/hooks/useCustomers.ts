import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import type { CreateCustomerData, UpdateCustomerData } from '../types/customer.types';
import { toast } from '@/hooks/use-toast';

export function useGetCustomers(businessId: number | undefined, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['customers', businessId, page, limit],
    queryFn: () => customerService.getCustomers(businessId!, page, limit),
    enabled: !!businessId,
  });
}

export function useSearchCustomers(businessId: number | undefined, query: string, limit: number = 20) {
  return useQuery({
    queryKey: ['customers', 'search', businessId, query, limit],
    queryFn: () => customerService.searchCustomers(businessId!, query, limit),
    enabled: !!businessId && query.length > 0,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerData }) =>
      customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
