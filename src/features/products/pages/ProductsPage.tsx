import { useState } from 'react';
import { Package, Pencil, Trash2, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { AddProductDialog } from '../components/AddProductDialog';
import { EditProductDialog } from '../components/EditProductDialog';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Product } from '../types/product.types';
import { AnimatePresence, motion } from 'framer-motion';

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: products, isLoading } = useProducts(currentPage, limit);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products?.filter((product) => {
    const search = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
            <SiteHeader />
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground mt-3">Loading products...</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                  <p className="text-sm text-muted-foreground">Manage your product catalog</p>
                </div>
                <AddProductDialog />
              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Product Catalog</CardTitle>
                      <CardDescription>
                        {products?.length || 0} product{products?.length !== 1 ? 's' : ''} total
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
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
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!filteredProducts || filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? 'No products found' : 'No products yet'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? 'Try adjusting your search terms'
                          : 'Get started by adding your first product'}
                      </p>
                      {!searchQuery && <AddProductDialog />}
                    </div>
                  ) : (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`products-${currentPage}-${limit}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>SKU</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredProducts.map((product) => (
                                  <TableRow key={product.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        {product.image_url && (
                                          <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-md object-cover"
                                          />
                                        )}
                                        <div>
                                          <div className="font-medium">{product.name}</div>
                                          {product.description && (
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                              {product.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                                    <TableCell className="font-semibold">
                                      ${Number(product.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setEditProduct(product)}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setDeleteProduct(product)}
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
                      
                      {/* Pagination */}
                      {filteredProducts.length >= limit && (
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
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>

      <EditProductDialog
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
      />
      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
      />
    </SidebarProvider>
  );
}
