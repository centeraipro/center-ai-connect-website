import { useState } from 'react';
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
import { useCreateOrder } from '../hooks/useOrders';
import type { OrderType } from '../types/order.types';

const formSchema = z.object({
  customer_id: z.number().min(1, 'Cliente requerido'),
  order_type: z.enum(['delivery', 'pickup', 'dine_in']),
  delivery_address: z.string().optional(),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
  product_id: z.number().min(1, 'Producto requerido'),
  quantity: z.number().min(1, 'Cantidad debe ser al menos 1'),
});

type FormData = z.infer<typeof formSchema>;

interface AddOrderDialogProps {
  businessId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddOrderDialog({ businessId, open, onOpenChange }: AddOrderDialogProps) {
  const createOrder = useCreateOrder();
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: 0,
      order_type: 'delivery',
      delivery_address: '',
      customer_notes: '',
      internal_notes: '',
      product_id: 0,
      quantity: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createOrder.mutateAsync({
        business_id: businessId,
        customer_id: data.customer_id,
        order_type: data.order_type,
        delivery_address: data.delivery_address,
        customer_notes: data.customer_notes,
        internal_notes: data.internal_notes,
        source: 'admin_panel',
        order_items: [
          {
            product_id: data.product_id,
            quantity: data.quantity,
          },
        ],
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Pedido</DialogTitle>
          <DialogDescription>
            Completa los detalles del pedido para crearlo en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID del Cliente</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pedido</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setOrderType(value as OrderType);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Recoger</SelectItem>
                      <SelectItem value="dine_in">En Local</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {orderType === 'delivery' && (
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
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID del Producto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? 'Creando...' : 'Crear Pedido'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
