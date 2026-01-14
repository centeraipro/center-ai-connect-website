import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import type { CreateAppointmentRequest, UpdateAppointmentRequest } from '../types/appointment.types';
import { toast } from 'sonner';

export function useAppointments(businessId: number) {
  return useQuery({
    queryKey: ['appointments', businessId],
    queryFn: () => appointmentService.getBusinessAppointments(businessId),
  });
}

export function useAppointmentsByDateRange(businessId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['appointments', businessId, 'date-range', startDate, endDate],
    queryFn: () => appointmentService.getAppointmentsByDateRange(businessId, startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useAppointment(id: number) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentService.createAppointment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.business_id] });
      toast.success('Appointment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create appointment');
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentRequest }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', appointment.business_id] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointment.id] });
      toast.success('Appointment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    },
  });
}
