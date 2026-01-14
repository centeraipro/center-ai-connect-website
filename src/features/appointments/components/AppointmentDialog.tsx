import { useEffect } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { Appointment, AppointmentStatus } from '../types/appointment.types';
import { CustomerSelect } from './CustomerSelect';
import { ServiceSelect } from './ServiceSelect';

// Custom animated DialogContent without default CSS animations
const AnimatedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      asChild
      onPointerDownOutside={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('[data-cmdk-root]')) {
          event.preventDefault();
        }
      }}
      {...props}
    >
      <motion.div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
          className
        )}
        style={{
          translateX: '-50%',
          translateY: '-50%'
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
            mass: 0.8
          }
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1]
          }
        }}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
AnimatedDialogContent.displayName = "AnimatedDialogContent";

const appointmentSchema = z.object({
  customer_id: z.number().min(1, 'Customer is required'),
  service_id: z.number().min(1, 'Service is required'),
  scheduled_date: z.date({ message: 'Date is required' }),
  scheduled_time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  businessId: number;
  onSubmit: (data: any) => void;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  businessId,
  onSubmit,
}: AppointmentDialogProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customer_id: 0,
      service_id: 0,
      scheduled_date: new Date(),
      scheduled_time: '09:00',
      duration: 60,
      status: 'scheduled',
      customer_notes: '',
      internal_notes: '',
    },
  });

  // Reset form when dialog opens or appointment changes
  useEffect(() => {
    if (open) {
      if (appointment) {
        form.reset({
          customer_id: appointment.customer.id,
          service_id: appointment.service.id,
          scheduled_date: new Date(appointment.scheduled_start),
          scheduled_time: format(new Date(appointment.scheduled_start), 'HH:mm'),
          duration: Math.round(
            (new Date(appointment.scheduled_end).getTime() - new Date(appointment.scheduled_start).getTime()) / 60000
          ),
          status: appointment.status,
          customer_notes: appointment.customer_notes || '',
          internal_notes: appointment.internal_notes || '',
        });
      } else {
        form.reset({
          customer_id: 0,
          service_id: 0,
          scheduled_date: new Date(),
          scheduled_time: '09:00',
          duration: 60,
          status: 'scheduled',
          customer_notes: '',
          internal_notes: '',
        });
      }
    }
  }, [open, appointment, form]);

  const handleSubmit = (values: AppointmentFormValues) => {
    const [hours, minutes] = values.scheduled_time.split(':').map(Number);
    const startDate = new Date(values.scheduled_date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + values.duration);

    const data = {
      business_id: businessId,
      customer_id: values.customer_id,
      service_id: values.service_id,
      scheduled_start: startDate.toISOString(),
      scheduled_end: endDate.toISOString(),
      status: values.status,
      customer_notes: values.customer_notes,
      internal_notes: values.internal_notes,
    };

    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'Create Appointment'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <CustomerSelect
                        businessId={businessId}
                        value={field.value}
                        onValueChange={field.onChange}
                        initialCustomer={appointment?.customer}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <ServiceSelect
                        businessId={businessId}
                        value={field.value}
                        initialService={appointment?.service}
                        onValueChange={(serviceId, duration) => {
                          field.onChange(serviceId);
                          if (duration) {
                            form.setValue('duration', duration);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={5}>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 48 }, (_, i) => {
                          const hour = Math.floor(i / 2);
                          const minute = i % 2 === 0 ? '00' : '30';
                          const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                          const ampm = hour < 12 ? 'AM' : 'PM';
                          return (
                            <SelectItem key={time} value={time}>
                              {displayHour}:{minute} {ampm}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="15"
                        className="pointer-events-auto"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customer_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Special requests from customer..." />
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
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Internal notes for staff..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {appointment ? 'Update' : 'Create'} Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </AnimatedDialogContent>
    </Dialog>
  );
}
