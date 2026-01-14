import { useState, useMemo, useContext, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAssignedConversations, useBusinessConversations, useMessages } from "../hooks/useConversations";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { ConversationHeader } from "../components/ConversationHeader";
import { ConversationsDataTable } from "../components/ConversationsDataTable";
import { MessageSquare, ListFilter, Columns, User, Building2, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "@/features/auth/context/AuthContext";
import type { ConversationChannel, ConversationStatus, ConversationFilters } from "../types/conversation.types";
import { Badge } from "@/components/ui/badge";

type ViewMode = 'assigned' | 'all';
type ColumnKey = "customer" | "channel" | "status" | "order" | "appointment" | "ai_enabled" | "started_at";

const allColumns: ColumnKey[] = ["customer", "channel", "status", "order", "appointment", "ai_enabled", "started_at"];

export function ConversationsPage() {
  const authContext = useContext(AuthContext);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('assigned');
  const [filters, setFilters] = useState<ConversationFilters>({
    page: 1,
    limit: 20,
  });
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(new Set(allColumns));
  const [searchInput, setSearchInput] = useState<string>('');

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput || undefined,
        page: 1, // Reset to page 1 when searching
      }));
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch conversations based on view mode
  const { data: assignedData, isLoading: assignedLoading } = useAssignedConversations(
    viewMode === 'assigned' ? filters : { page: 1, limit: 1 }
  );
  const { data: businessData, isLoading: businessLoading } = useBusinessConversations(
    authContext?.user?.business?.id,
    viewMode === 'all' ? filters : { page: 1, limit: 1 }
  );

  const conversationsResponse = viewMode === 'assigned' ? assignedData : businessData;
  const conversationsLoading = viewMode === 'assigned' ? assignedLoading : businessLoading;
  const conversations = conversationsResponse?.data || [];
  const pagination = conversationsResponse?.pagination;

  const { data: messages = [], isLoading: messagesLoading, isFetching } = useMessages(selectedConversationId || 0);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const updateFilter = (key: keyof ConversationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset to page 1 when changing filters
    }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      page: 1,
      limit: filters.limit,
    });
  };

  const toggleColumn = (column: ColumnKey) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(key =>
      !['page', 'limit'].includes(key) && filters[key as keyof ConversationFilters] !== undefined
    ).length;
  }, [filters]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />

          <div className="flex flex-1 overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Conversations Table Sidebar */}
                <div className="w-96 border-r bg-background flex flex-col">
                  <div className="px-4 py-4 border-b">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversationId(null)}
                      className="mb-3"
                    >
                      ← Back to Conversations
                    </Button>
                  </div>

                  {/* Customer Info Card */}
                  {selectedConversation.customer && (
                    <div className="p-4 border-b">
                      <h3 className="font-semibold mb-3">Customer</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="font-medium">
                            {selectedConversation.customer.first_name} {selectedConversation.customer.last_name}
                          </p>
                          <p className="text-muted-foreground">{selectedConversation.customer.email}</p>
                          <p className="text-muted-foreground">{selectedConversation.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  {selectedConversation.order && (
                    <div className="p-4 border-b">
                      <h3 className="font-semibold mb-3">Order</h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-mono">{selectedConversation.order.order_number}</p>
                        <Badge className="text-xs capitalize">
                          {selectedConversation.order.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-muted-foreground">
                          Total: ${selectedConversation.order.total}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Appointment Info */}
                  {selectedConversation.appointment && (
                    <div className="p-4">
                      <h3 className="font-semibold mb-3">Appointment</h3>
                      <div className="space-y-2 text-sm">
                        <Badge className="text-xs capitalize">
                          {selectedConversation.appointment.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-muted-foreground">
                          {new Date(selectedConversation.appointment.scheduled_start).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 flex flex-col bg-background overflow-hidden">
                  <ConversationHeader conversation={selectedConversation} />
                  <div className="flex-1 flex flex-col min-h-0">
                    {messagesLoading && !isFetching ? (
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground mt-3">Loading messages...</p>
                      </div>
                    ) : (
                      <>
                        <MessageList messages={messages} />
                        <MessageInput
                          conversationId={selectedConversation.id}
                          disabled={!!selectedConversation.ended_at}
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden p-6">
                {/* Header with View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Conversations</h1>
                    {pagination && (
                      <Badge variant="secondary" className="text-sm">
                        {pagination.total} total
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'assigned' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('assigned')}
                      className="gap-2"
                    >
                      <User className="h-4 w-4" />
                      Assigned to Me
                    </Button>
                    <Button
                      variant={viewMode === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('all')}
                      className="gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      All Conversations
                    </Button>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Input
                      placeholder="Search by name, email, phone, or channel..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full"
                    />
                    {searchInput && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchInput('')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
                    <Select
                      value={filters.limit?.toString() || '20'}
                      onValueChange={(value) => updateFilter('limit', parseInt(value))}
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

                  {/* Channel Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <ListFilter className="h-4 w-4" />
                        Channel
                        {filters.channel && <Badge variant="secondary" className="ml-1">1</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Channel</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateFilter('channel', undefined)}>
                        All Channels
                      </DropdownMenuItem>
                      {(['whatsapp', 'instagram', 'facebook', 'telegram', 'sms', 'email', 'web_chat'] as ConversationChannel[]).map(channel => (
                        <DropdownMenuCheckboxItem
                          key={channel}
                          checked={filters.channel === channel}
                          onCheckedChange={(checked) => updateFilter('channel', checked ? channel : undefined)}
                          className="capitalize"
                        >
                          {channel.replace('_', ' ')}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                        {filters.status && <Badge variant="secondary" className="ml-1">1</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateFilter('status', undefined)}>
                        All Status
                      </DropdownMenuItem>
                      {(['active', 'ended'] as ConversationStatus[]).map(status => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={filters.status === status}
                          onCheckedChange={(checked) => updateFilter('status', checked ? status : undefined)}
                          className="capitalize"
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* AI Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        AI
                        {filters.ai_enabled !== undefined && <Badge variant="secondary" className="ml-1">1</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>AI Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateFilter('ai_enabled', undefined)}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.ai_enabled === true}
                        onCheckedChange={(checked) => updateFilter('ai_enabled', checked ? true : undefined)}
                      >
                        AI Enabled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.ai_enabled === false}
                        onCheckedChange={(checked) => updateFilter('ai_enabled', checked ? false : undefined)}
                      >
                        Manual
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Has Order Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Order
                        {filters.has_order !== undefined && <Badge variant="secondary" className="ml-1">1</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Has Order</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateFilter('has_order', undefined)}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.has_order === true}
                        onCheckedChange={(checked) => updateFilter('has_order', checked ? true : undefined)}
                      >
                        With Order
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.has_order === false}
                        onCheckedChange={(checked) => updateFilter('has_order', checked ? false : undefined)}
                      >
                        Without Order
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Has Appointment Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Appointment
                        {filters.has_appointment !== undefined && <Badge variant="secondary" className="ml-1">1</Badge>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Has Appointment</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateFilter('has_appointment', undefined)}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.has_appointment === true}
                        onCheckedChange={(checked) => updateFilter('has_appointment', checked ? true : undefined)}
                      >
                        With Appointment
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.has_appointment === false}
                        onCheckedChange={(checked) => updateFilter('has_appointment', checked ? false : undefined)}
                      >
                        Without Appointment
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Columns Visibility */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Columns className="h-4 w-4" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allColumns.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column}
                          className="capitalize"
                          checked={visibleColumns.has(column)}
                          onCheckedChange={() => toggleColumn(column)}
                        >
                          {column.replace('_', ' ')}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear Filters ({activeFiltersCount})
                    </Button>
                  )}
                </div>

                {/* Conversations Table */}
                {conversationsLoading ? (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground mt-3">Loading conversations...</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`conversations-${viewMode}-${filters.page}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-auto"
                      >
                        <ConversationsDataTable
                          conversations={conversations}
                          visibleColumns={visibleColumns}
                          onConversationClick={(conversation) => setSelectedConversationId(conversation.id)}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1} to{' '}
                          {Math.min((filters.page || 1) * (filters.limit || 20), pagination.total)} of{' '}
                          {pagination.total} results
                        </div>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => updateFilter('page', (filters.page || 1) - 1)}
                                className={
                                  !pagination.hasPreviousPage
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                              const page = i + 1;
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => updateFilter('page', page)}
                                    isActive={filters.page === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => updateFilter('page', (filters.page || 1) + 1)}
                                className={
                                  !pagination.hasNextPage
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
