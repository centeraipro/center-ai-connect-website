import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { appointmentService } from '../services/appointmentService';
import type { Service } from '../types/appointment.types';

interface ServiceSelectProps {
  businessId: number;
  value?: number;
  onValueChange: (serviceId: number, duration?: number) => void;
  disabled?: boolean;
  initialService?: Service | null;
}

export function ServiceSelect({
  businessId,
  value,
  onValueChange,
  disabled,
  initialService,
}: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setServices((prev) => {
        if (prev.find((s) => s.id === initialService.id)) {
          return prev;
        }
        return [initialService, ...prev];
      });
    }
  }, [initialService]);

  useEffect(() => {
    const searchServices = async () => {
      if (search.length < 1) {
        setServices([]);
        return;
      }

      setLoading(true);
      try {
        const results = await appointmentService.searchServices(businessId, search, 10);
        setServices(results);
      } catch (error) {
        console.error('Failed to search services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchServices, 300);
    return () => clearTimeout(debounce);
  }, [search, businessId]);

  // Find selected service when value changes
  useEffect(() => {
    if (value && services.length > 0) {
      const service = services.find((s) => s.id === value);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [value, services]);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    onValueChange(service.id, service.duration_minutes);
    setSearch('');
    setOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedService ? (
            <span className="truncate">{selectedService.name}</span>
          ) : (
            <span className="text-muted-foreground">Search service...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start" side="bottom" sideOffset={5}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search services..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {!loading && search && services.length === 0 && (
              <CommandEmpty>No services found.</CommandEmpty>
            )}
            {!loading && !search && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                Start typing to search services
              </div>
            )}
            {!loading && services.length > 0 && (
              <CommandGroup>
                {services.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={`${service.id}-${service.name}`}
                    onSelect={() => handleSelect(service)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === service.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
