import { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetCustomers, useSearchCustomers } from '../hooks/useCustomers';
import { AddCustomerForm } from '../components/AddCustomerForm';
import { EditCustomerForm } from '../components/EditCustomerForm';
import { DeleteCustomerDialog } from '../components/DeleteCustomerDialog';
import type { Customer } from '../types/customer.types';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AnimatePresence, motion } from 'framer-motion';

export function CustomersPage() {
  const { user } = useAuth();
  const businessId = user?.business?.id;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use search endpoint when there's a search term, otherwise use regular get customers
  const { data: regularCustomers, isLoading: isLoadingRegular } = useGetCustomers(
    businessId,
    currentPage,
    limit
  );
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchCustomers(
    businessId,
    debouncedSearchTerm,
    limit
  );

  // Use search results if searching, otherwise use regular customers
  const customers = debouncedSearchTerm ? searchResults : regularCustomers;
  const isLoading = debouncedSearchTerm ? isLoadingSearch : isLoadingRegular;

  // Reset to page 1 when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Global cleanup effect - forcefully remove overlays when all modals are closed
  useEffect(() => {
    if (!addSheetOpen && !editSheetOpen && !deleteDialogOpen) {
      const cleanup = setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        // Remove ALL overlays and portals
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        overlays.forEach((overlay) => overlay.remove());
      }, 400);
      return () => clearTimeout(cleanup);
    }
  }, [addSheetOpen, editSheetOpen, deleteDialogOpen]);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditSheetOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
            <SiteHeader />
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-8">
                <h1 className="text-2xl font-bold">Customers</h1>
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                      value={limit.toString()}
                      onValueChange={(value) => {
                        setLimit(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setAddSheetOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="flex flex-col items-center justify-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                              <p className="text-sm text-muted-foreground mt-3">Loading customers...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : !customers || customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            {searchTerm ? 'No customers found' : 'No customers yet'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.tr
                            key={`customers-${currentPage}-${limit}-${searchTerm}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'contents' }}
                          >
                            {customers.map((customer) => (
                              <TableRow key={customer.id}>
                                <TableCell className="font-medium">
                                  {customer.first_name} {customer.last_name}
                                </TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>
                                  <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                                    {customer.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(customer)}
                                        className="text-destructive"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </motion.tr>
                        </AnimatePresence>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - only show when not searching */}
                {!debouncedSearchTerm && customers && customers.length >= limit && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive>{currentPage}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <Sheet
        open={addSheetOpen}
        onOpenChange={(open) => {
          setAddSheetOpen(open);
          if (!open) {
            // Force cleanup of any stray overlays and restore page interaction
            setTimeout(() => {
              document.body.style.pointerEvents = '';
              document.body.style.overflow = '';
              document.body.style.paddingRight = '';
              // Remove ALL overlays to ensure cleanup
              const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
              overlays.forEach((overlay) => overlay.remove());
            }, 350);
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Customer</SheetTitle>
            <SheetDescription>
              Create a new customer for your business.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            {businessId && (
              <AddCustomerForm
                businessId={businessId}
                onSuccess={() => {
                  setAddSheetOpen(false);
                  // Force cleanup after successful add
                  setTimeout(() => {
                    document.body.style.pointerEvents = '';
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
                    overlays.forEach((overlay) => overlay.remove());
                  }, 350);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={editSheetOpen}
        onOpenChange={(open) => {
          setEditSheetOpen(open);
          if (!open) {
            setSelectedCustomer(null);
            // Force cleanup of any stray overlays and restore page interaction
            setTimeout(() => {
              document.body.style.pointerEvents = '';
              document.body.style.overflow = '';
              document.body.style.paddingRight = '';
              // Remove ALL overlays to ensure cleanup
              const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
              overlays.forEach((overlay) => overlay.remove());
            }, 350);
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Customer</SheetTitle>
            <SheetDescription>
              Update customer information.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            {selectedCustomer && (
              <EditCustomerForm
                key={selectedCustomer.id}
                customer={selectedCustomer}
                onSuccess={() => {
                  setEditSheetOpen(false);
                  setSelectedCustomer(null);
                  // Force cleanup after successful edit
                  setTimeout(() => {
                    document.body.style.pointerEvents = '';
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
                    overlays.forEach((overlay) => overlay.remove());
                  }, 350);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <DeleteCustomerDialog
        customer={selectedCustomer}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setSelectedCustomer(null);
          }
        }}
      />
    </>
  );
}
