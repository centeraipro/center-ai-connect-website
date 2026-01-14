import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Appointment, CalendarView } from '../types/appointment.types';

interface CalendarViewProps {
  appointments: Appointment[];
  currentDate: Date;
  view: CalendarView;
  onDateChange: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  confirmed: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  in_progress: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  completed: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
  cancelled: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  no_show: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
};

export function CalendarView({
  appointments,
  currentDate,
  view,
  onDateChange,
  onAppointmentClick,
}: CalendarViewProps) {
  if (view === 'month') {
    return <MonthView {...{ appointments, currentDate, onDateChange, onAppointmentClick }} />;
  }

  if (view === 'week') {
    return <WeekView {...{ appointments, currentDate, onDateChange, onAppointmentClick }} />;
  }

  if (view === 'day') {
    return <DayView {...{ appointments, currentDate, onDateChange, onAppointmentClick }} />;
  }

  return <AgendaView {...{ appointments, currentDate, onDateChange, onAppointmentClick }} />;
}

function MonthView({ appointments, currentDate, onDateChange, onAppointmentClick }: Omit<CalendarViewProps, 'view'>) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => 
      isSameDay(parseISO(apt.scheduled_start), date)
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-muted/50 p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border flex-1 overflow-auto">
        {days.map((day, idx) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={cn(
                'bg-background min-h-[120px] p-2 transition-colors',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground'
              )}
            >
              <div className={cn(
                'text-sm font-medium mb-2',
                isToday && 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground'
              )}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={cn(
                      'w-full text-left px-2 py-1 rounded text-xs border transition-all hover:scale-[1.02]',
                      statusColors[apt.status]
                    )}
                  >
                    <div className="font-medium truncate">
                      {format(parseISO(apt.scheduled_start), 'HH:mm')} {apt.customer.first_name}
                    </div>
                    <div className="truncate opacity-75">
                      {apt.service.name}
                    </div>
                  </button>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ appointments, currentDate, onDateChange, onAppointmentClick }: Omit<CalendarViewProps, 'view'>) {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAppointmentsForDayHour = (date: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptStart = parseISO(apt.scheduled_start);
      return isSameDay(aptStart, date) && aptStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-8 gap-px bg-border min-w-[800px]">
        <div className="bg-muted/50 sticky left-0 z-10" />
        {days.map((day) => (
          <div key={day.toISOString()} className="bg-muted/50 p-2 text-center">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={cn(
              'text-lg',
              isSameDay(day, new Date()) && 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {hours.map((hour) => (
          <>
            <div key={`hour-${hour}`} className="bg-muted/30 p-2 text-right text-sm text-muted-foreground sticky left-0 z-10">
              {format(new Date().setHours(hour, 0), 'HH:mm')}
            </div>
            {days.map((day) => {
              const dayHourApts = getAppointmentsForDayHour(day, hour);
              return (
                <div key={`${day}-${hour}`} className="bg-background min-h-[60px] p-1">
                  {dayHourApts.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={cn(
                        'w-full text-left px-2 py-1 rounded text-xs mb-1 border transition-all hover:scale-[1.02]',
                        statusColors[apt.status]
                      )}
                    >
                      <div className="font-medium truncate">
                        {apt.customer.first_name} {apt.customer.last_name}
                      </div>
                      <div className="truncate opacity-75">
                        {apt.service.name}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

function DayView({ appointments, currentDate, onDateChange, onAppointmentClick }: Omit<CalendarViewProps, 'view'>) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAppointmentsForHour = (hour: number) => {
    return appointments.filter((apt) => {
      const aptStart = parseISO(apt.scheduled_start);
      return isSameDay(aptStart, currentDate) && aptStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {hours.map((hour) => {
          const hourApts = getAppointmentsForHour(hour);
          return (
            <div key={hour} className="flex border-b border-border">
              <div className="w-20 p-4 text-sm text-muted-foreground text-right">
                {format(new Date().setHours(hour, 0), 'HH:mm')}
              </div>
              <div className="flex-1 p-2 min-h-[80px]">
                {hourApts.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg mb-2 border transition-all hover:scale-[1.01]',
                      statusColors[apt.status]
                    )}
                  >
                    <div className="font-medium">
                      {format(parseISO(apt.scheduled_start), 'HH:mm')} - {format(parseISO(apt.scheduled_end), 'HH:mm')}
                    </div>
                    <div className="text-sm mt-1">
                      {apt.customer.first_name} {apt.customer.last_name}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      {apt.service.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({ appointments, currentDate, onDateChange, onAppointmentClick }: Omit<CalendarViewProps, 'view'>) {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-2">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No appointments scheduled
          </div>
        ) : (
          sortedAppointments.map((apt) => (
            <button
              key={apt.id}
              onClick={() => onAppointmentClick(apt)}
              className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={statusColors[apt.status]}>
                      {apt.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(apt.scheduled_start), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="font-medium text-lg">
                    {apt.customer.first_name} {apt.customer.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {apt.service.name} • {format(parseISO(apt.scheduled_start), 'HH:mm')} - {format(parseISO(apt.scheduled_end), 'HH:mm')}
                  </div>
                  {apt.customer_notes && (
                    <p className="text-sm text-muted-foreground mt-2">{apt.customer_notes}</p>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
