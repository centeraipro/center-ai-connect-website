import { useState } from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { CalendarView } from '../components/CalendarView';
import { AppointmentDialog } from '../components/AppointmentDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useAppointmentsByDateRange,
  useCreateAppointment,
  useUpdateAppointment,
} from '../hooks/useAppointments';
import type { CalendarView as CalendarViewType, Appointment } from '../types/appointment.types';

export function AppointmentsPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const businessId = user?.business?.id || 0;

  // Get date range based on view
  const getDateRange = () => {
    if (view === 'month') {
      return {
        start: format(startOfMonth(currentDate), "yyyy-MM-dd'T'00:00:00'Z'"),
        end: format(endOfMonth(currentDate), "yyyy-MM-dd'T'23:59:59'Z'"),
      };
    }
    // For week/day/agenda, get a wider range
    const start = new Date(currentDate);
    start.setDate(start.getDate() - 30);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 30);
    
    return {
      start: format(start, "yyyy-MM-dd'T'00:00:00'Z'"),
      end: format(end, "yyyy-MM-dd'T'23:59:59'Z'"),
    };
  };

  const dateRange = getDateRange();
  const { data: appointments = [], isLoading } = useAppointmentsByDateRange(
    businessId,
    dateRange.start,
    dateRange.end
  );

  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();

  const handlePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedAppointment(undefined);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (selectedAppointment) {
      updateMutation.mutate({ id: selectedAppointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getViewTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    if (view === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    return 'Agenda';
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex flex-col h-full overflow-hidden">
            <div className="border-b bg-background p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-semibold">{getViewTitle()}</h2>

                <div className="flex items-center gap-2">
                  <Select value={view} onValueChange={(v) => setView(v as CalendarViewType)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground mt-3">Loading appointments...</p>
                </div>
              ) : (
                <CalendarView
                  appointments={appointments}
                  currentDate={currentDate}
                  view={view}
                  onDateChange={setCurrentDate}
                  onAppointmentClick={handleAppointmentClick}
                />
              )}
            </div>
          </div>

          <AppointmentDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            appointment={selectedAppointment}
            businessId={businessId}
            onSubmit={handleSubmit}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
