import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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
import type { Customer } from '../types/appointment.types';

interface CustomerSelectProps {
  businessId: number;
  value?: number;
  onValueChange: (customerId: number) => void;
  disabled?: boolean;
  initialCustomer?: Customer | null;
}

export function CustomerSelect({
  businessId,
  value,
  onValueChange,
  disabled,
  initialCustomer,
}: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (initialCustomer) {
      setSelectedCustomer(initialCustomer);
      setCustomers((prev) => {
        if (prev.find((c) => c.id === initialCustomer.id)) {
          return prev;
        }
        return [initialCustomer, ...prev];
      });
    }
  }, [initialCustomer]);

  useEffect(() => {
    const searchCustomers = async () => {
      if (search.length < 1) {
        setCustomers([]);
        return;
      }

      setLoading(true);
      try {
        const results = await appointmentService.searchCustomers(businessId, search, 10);
        setCustomers(results);
      } catch (error) {
        console.error('Failed to search customers:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounce);
  }, [search, businessId]);

  // Find selected customer when value changes
  useEffect(() => {
    if (value && customers.length > 0) {
      const customer = customers.find((c) => c.id === value);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [value, customers]);

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    onValueChange(customer.id);
    setSearch('');
    setOpen(false);
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
          {selectedCustomer ? (
            <span className="truncate">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </span>
          ) : (
            <span className="text-muted-foreground">Search customer...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start" side="bottom" sideOffset={5}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by name, email, or phone..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {!loading && search && customers.length === 0 && (
              <CommandEmpty>No customers found.</CommandEmpty>
            )}
            {!loading && !search && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                Start typing to search customers
              </div>
            )}
            {!loading && customers.length > 0 && (
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.id}-${customer.first_name}-${customer.last_name}-${customer.email}`}
                    onSelect={() => handleSelect(customer)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === customer.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email} • {customer.phone}
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
