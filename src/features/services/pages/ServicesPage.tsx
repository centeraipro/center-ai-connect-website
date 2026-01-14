import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useBusinessServices, useSearchServices } from '../hooks/useServices';
import { AddServiceDialog } from '../components/AddServiceDialog';
import { EditServiceDialog } from '../components/EditServiceDialog';
import { DeleteServiceDialog } from '../components/DeleteServiceDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Search } from 'lucide-react';
import type { Service } from '../types/service.types';

export function ServicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use search endpoint if there's a search query, otherwise fetch all services
  const { data: allServices = [], isLoading: isLoadingAll } = useBusinessServices(
    user?.business?.id || 0,
    page,
    limit
  );

  const { data: searchResults = [], isLoading: isSearching } = useSearchServices(
    user?.business?.id || 0,
    debouncedSearch,
    100 // Higher limit for search results
  );

  const services = debouncedSearch ? searchResults : allServices;
  const isLoading = debouncedSearch ? isSearching : isLoadingAll;

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Services</CardTitle>
                      <CardDescription>Manage your business services</CardDescription>
                    </div>
                    <AddServiceDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search services..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
                          className="pl-9"
                          maxLength={100}
                        />
                      </div>
                      <Select value={limit.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 per page</SelectItem>
                          <SelectItem value="20">20 per page</SelectItem>
                          <SelectItem value="50">50 per page</SelectItem>
                          <SelectItem value="100">100 per page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground mt-3">Loading services...</p>
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchQuery ? 'No services found matching your search' : 'No services yet'}
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence mode="wait">
                              {services.map((service, index) => (
                                <motion.tr
                                  key={`${service.id}-${page}-${limit}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: index * 0.05,
                                    ease: 'easeOut',
                                  }}
                                  className="border-b"
                                >
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{service.name}</div>
                                      {service.description && (
                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                          {service.description}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{service.duration_minutes} min</TableCell>
                                  <TableCell>${typeof service.price === 'string' ? parseFloat(service.price).toFixed(2) : service.price.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                      {service.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditService(service)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteService(service)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {!isLoading && services.length > 0 && !debouncedSearch && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink>{page}</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setPage((p) => p + 1)}
                              className={
                                services.length < limit
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>

      <EditServiceDialog
        service={editService}
        open={!!editService}
        onOpenChange={(open) => !open && setEditService(null)}
      />
      <DeleteServiceDialog
        service={deleteService}
        open={!!deleteService}
        onOpenChange={(open) => !open && setDeleteService(null)}
      />
    </SidebarProvider>
  );
}
