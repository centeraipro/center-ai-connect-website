import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import type { CreateOrderData, UpdateOrderData } from '../types/order.types';
import { toast } from '@/hooks/use-toast';

export function useOrders(businessId?: number, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['orders', businessId, page, limit],
    queryFn: () => orderService.getOrdersByBusiness(businessId!, page, limit),
    enabled: !!businessId,
  });
}

export function useOrder(orderId?: number) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getOrderById(orderId!),
    enabled: !!orderId,
  });
}

export function useCustomerOrders(customerId?: number) {
  return useQuery({
    queryKey: ['orders', 'customer', customerId],
    queryFn: () => orderService.getOrdersByCustomer(customerId!),
    enabled: !!customerId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Pedido creado',
        description: 'El pedido se ha creado exitosamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo crear el pedido.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: UpdateOrderData }) =>
      orderService.updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Pedido actualizado',
        description: 'El pedido se ha actualizado exitosamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el pedido.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Pedido eliminado',
        description: 'El pedido se ha eliminado exitosamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el pedido.',
        variant: 'destructive',
      });
    },
  });
}
