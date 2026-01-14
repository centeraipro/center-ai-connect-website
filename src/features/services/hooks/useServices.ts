import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/serviceService';
import type { CreateServiceDto, UpdateServiceDto } from '../types/service.types';
import { useToast } from '@/hooks/use-toast';

export function useBusinessServices(businessId: number, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['services', businessId, page, limit],
    queryFn: () => serviceService.getBusinessServices(businessId, page, limit),
    enabled: !!businessId,
  });
}

export function useSearchServices(businessId: number, query: string, limit: number = 20) {
  return useQuery({
    queryKey: ['services', 'search', businessId, query, limit],
    queryFn: () => serviceService.searchServices(businessId, query, limit),
    enabled: !!businessId && !!query,
  });
}

export function useService(id: number) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => serviceService.getService(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateServiceDto) => serviceService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create service',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceDto }) =>
      serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update service',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => serviceService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete service',
        variant: 'destructive',
      });
    },
  });
}
