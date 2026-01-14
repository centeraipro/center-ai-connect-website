import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUpdateOrder } from '../hooks/useOrders';
import type { Order } from '../types/order.types';

const formSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'in_transit',
    'delivered',
    'completed',
    'cancelled',
  ]),
  delivery_address: z.string().optional(),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrderDialog({ order, open, onOpenChange }: EditOrderDialogProps) {
  const updateOrder = useUpdateOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'pending',
      delivery_address: '',
      customer_notes: '',
      internal_notes: '',
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status,
        delivery_address: order.delivery_address || '',
        customer_notes: order.customer_notes || '',
        internal_notes: order.internal_notes || '',
      });
    }
  }, [order, form]);

  const onSubmit = async (data: FormData) => {
    if (!order) return;

    try {
      await updateOrder.mutateAsync({
        orderId: order.id,
        data,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pedido #{order.id}</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del pedido.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="preparing">Preparando</SelectItem>
                      <SelectItem value="ready">Listo</SelectItem>
                      <SelectItem value="in_transit">En Camino</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {order.order_type === 'delivery' && (
              <FormField
                control={form.control}
                name="delivery_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Entrega</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Calle Principal 123, Apto 4B" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="customer_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas del Cliente</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Instrucciones especiales del cliente..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internal_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Internas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas para el personal..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateOrder.isPending}>
                {updateOrder.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
