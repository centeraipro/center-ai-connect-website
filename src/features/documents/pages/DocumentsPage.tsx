import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  FileText,
  File,
  PlayCircle,
  RefreshCw,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/site-header';
import { UploadFileDialog } from '../components/UploadFileDialog';
import { DeleteFileDialog } from '../components/DeleteFileDialog';
import { StoragePanel } from '../components/StoragePanel';
import { ProcessFileDialog } from '../components/ProcessFileDialog';
import { BatchProcessDialog } from '../components/BatchProcessDialog';
import { DocumentSearch } from '../components/DocumentSearch';
import { ProcessingStatusMonitor } from '../components/ProcessingStatusMonitor';
import { useGetFiles, useDownloadFile } from '../hooks/useDocuments';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { DocumentStatus, DocumentFile } from '../types/document.types';
import { format } from 'date-fns';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

const statusColors: Record<DocumentStatus, string> = {
  uploaded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  processing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  indexed: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    fileId: string;
    filename: string;
  }>({ open: false, fileId: '', filename: '' });

  // Global cleanup effect - forcefully remove overlays when dialog is closed
  useEffect(() => {
    if (!deleteDialog.open) {
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
  }, [deleteDialog.open]);

  const { data, isLoading } = useGetFiles(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  const downloadFile = useDownloadFile();

  const files = data?.files || [];
  const filteredFiles = files.filter((file) =>
    file.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentFiles = filteredFiles.slice(0, 3);
  
  const uploadedFiles = filteredFiles.filter(f => f.status === 'uploaded');
  const allSelected = uploadedFiles.length > 0 && uploadedFiles.every(f => selectedFiles.includes(parseInt(f.id)));
  
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(uploadedFiles.map(f => parseInt(f.id)));
    }
  };
  
  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleDownload = (file: DocumentFile) => {
    downloadFile.mutate({ id: file.id, filename: file.original_filename });
  };

  const handleDelete = (file: DocumentFile) => {
    setDeleteDialog({
      open: true,
      fileId: file.id,
      filename: file.original_filename,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold lg:text-3xl">Documents</h1>
                <p className="text-sm text-muted-foreground lg:text-base">
                  Manage and organize your business documents
                </p>
              </div>
              <div className="flex gap-2">
                <DocumentSearch />
                <BatchProcessDialog 
                  selectedFileIds={selectedFiles} 
                  onSuccess={() => setSelectedFiles([])} 
                />
                <UploadFileDialog />
              </div>
            </div>

            {/* Processing Status Monitor */}
            <ProcessingStatusMonitor />

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as DocumentStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="indexed">Indexed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <div>
                  <Skeleton className="mb-4 h-6 w-48" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="mb-4 h-6 w-32" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <File className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No documents found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery
                      ? 'No documents match your search criteria'
                      : 'Upload your first document to get started'}
                  </EmptyDescription>
                </EmptyHeader>
                {!searchQuery && (
                  <EmptyContent>
                    <UploadFileDialog />
                  </EmptyContent>
                )}
              </Empty>
            ) : (
              <>
                {/* Recently Modified */}
                {recentFiles.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-base font-medium lg:text-lg">
                      Recently Modified
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {recentFiles.map((file) => (
                        <Card key={file.id} className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {file.original_filename}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.file_size)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Files */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-medium lg:text-lg">All Files</h2>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>

                  {/* Mobile Cards */}
                  <div className="space-y-3 lg:hidden">
                    {filteredFiles.map((file) => (
                      <Card key={file.id} className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="mb-1 truncate text-sm font-medium">
                              {file.original_filename}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge
                                variant="outline"
                                className={statusColors[file.status]}
                              >
                                {file.status}
                              </Badge>
                              <span>{formatFileSize(file.file_size)}</span>
                              <span>•</span>
                              <span>{formatDate(file.uploaded_at)}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(file)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(file)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden overflow-hidden rounded-lg border lg:block">
                    <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
                      <div className="col-span-1 flex items-center">
                        <Checkbox 
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                          disabled={uploadedFiles.length === 0}
                        />
                      </div>
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1">Type</div>
                      <div className="col-span-1">Chunks</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-1"></div>
                    </div>
                    {filteredFiles.map((file) => {
                      const fileId = parseInt(file.id);
                      const isSelected = selectedFiles.includes(fileId);
                      const canSelect = file.status === 'uploaded';
                      
                      return (
                        <div
                          key={file.id}
                          className="grid grid-cols-12 gap-4 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50"
                        >
                          <div className="col-span-1 flex items-center">
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => toggleFileSelection(fileId)}
                              disabled={!canSelect}
                            />
                          </div>
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="truncate text-sm font-medium">
                              {file.original_filename}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <Badge
                              variant="outline"
                              className={statusColors[file.status]}
                            >
                              {file.status}
                            </Badge>
                          </div>
                          <div className="col-span-1 flex items-center">
                            {file.document_type && (
                              <Badge variant="outline" className="text-xs">
                                {file.document_type}
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-1 flex items-center text-sm text-muted-foreground">
                            {file.chunk_count || '-'}
                          </div>
                          <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                            {formatDate(file.uploaded_at)}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {file.status === 'uploaded' && (
                                  <ProcessFileDialog
                                    fileId={fileId}
                                    filename={file.original_filename}
                                    trigger={
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Process Document
                                      </DropdownMenuItem>
                                    }
                                  />
                                )}
                                {file.status === 'failed' && (
                                  <ProcessFileDialog
                                    fileId={fileId}
                                    filename={file.original_filename}
                                    trigger={
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reprocess
                                      </DropdownMenuItem>
                                    }
                                  />
                                )}
                                <DropdownMenuItem onClick={() => handleDownload(file)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(file)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
              </div>
            </div>

            {/* Storage Panel - Desktop Only */}
            <div className="hidden w-80 border-l bg-card p-6 xl:block">
              <StoragePanel />
            </div>
          </div>
        </SidebarInset>
      </div>

      <DeleteFileDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ ...deleteDialog, open })
        }
        fileId={deleteDialog.fileId}
        filename={deleteDialog.filename}
      />
    </SidebarProvider>
  );
}
