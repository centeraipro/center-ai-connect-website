import { useState } from 'react';
import { Plus, Pencil, Trash2, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AddOrderDialog } from '../components/AddOrderDialog';
import { EditOrderDialog } from '../components/EditOrderDialog';
import { DeleteOrderDialog } from '../components/DeleteOrderDialog';
import type { Order, OrderStatus } from '../types/order.types';
import { AnimatePresence, motion } from 'framer-motion';

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready: { label: 'Listo', variant: 'default' },
  in_transit: { label: 'En Camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'default' },
  completed: { label: 'Completado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const orderTypeLabels = {
  delivery: 'Delivery',
  pickup: 'Recoger',
  dine_in: 'En Local',
};

export function OrdersPage() {
  const { user } = useAuth();
  const businessId = user?.business?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: orders, isLoading } = useOrders(businessId, currentPage, limit);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  // Statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === 'pending').length || 0,
    completed: orders?.filter((o) => o.status === 'completed').length || 0,
    cancelled: orders?.filter((o) => o.status === 'cancelled').length || 0,
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
            <SiteHeader />
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground mt-3">Loading orders...</p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                  <p className="text-muted-foreground">Gestiona los pedidos de tu negocio</p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Nuevo Pedido
                </Button>
              </div>

              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completed}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.cancelled}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lista de Pedidos</CardTitle>
                      <CardDescription>
                        {stats.total > 0
                          ? `Mostrando ${stats.total} pedido${stats.total !== 1 ? 's' : ''}`
                          : 'No hay pedidos registrados'}
                      </CardDescription>
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
                  </div>
                </CardHeader>
                <CardContent>
                  {orders && orders.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`orders-${currentPage}-${limit}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {orders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">#{order.id}</TableCell>
                                  <TableCell>Cliente #{order.customer_id}</TableCell>
                                  <TableCell>{orderTypeLabels[order.order_type]}</TableCell>
                                  <TableCell>
                                    <Badge variant={statusConfig[order.status].variant}>
                                      {statusConfig[order.status].label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-semibold">
                                    {formatCurrency(order.total_amount)}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {formatDate(order.created_at)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(order)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(order)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hay pedidos</h3>
                      <p className="text-muted-foreground mb-4">
                        Comienza creando tu primer pedido
                      </p>
                      <Button onClick={() => setAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Pedido
                      </Button>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {orders && orders.length >= limit && (
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
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>

      {/* Dialogs */}
      {businessId && (
        <>
          <AddOrderDialog
            businessId={businessId}
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
          />
          <EditOrderDialog
            order={selectedOrder}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <DeleteOrderDialog
            order={selectedOrder}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </SidebarProvider>
  );
}
