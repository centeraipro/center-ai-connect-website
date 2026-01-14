import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/documentService';
import { toast } from '@/hooks/use-toast';
import type { DocumentStatus, DocumentType } from '../types/document.types';

const QUERY_KEYS = {
  files: ['documents', 'files'] as const,
  stats: ['documents', 'stats'] as const,
  file: (id: string) => ['documents', 'file', id] as const,
};

export function useGetFiles(params?: {
  status?: DocumentStatus;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.files, params],
    queryFn: () => documentService.getFiles(params),
  });
}

export function useGetFile(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.file(id),
    queryFn: () => documentService.getFile(id),
    enabled: !!id,
  });
}

export function useGetStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => documentService.getStats(),
  });
}

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => documentService.uploadFiles(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload files',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete file',
        variant: 'destructive',
      });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
      const blob = await documentService.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to download file',
        variant: 'destructive',
      });
    },
  });
}

export function useProcessFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: number;
      params?: {
        documentType?: DocumentType;
        chunkSize?: number;
        chunkOverlap?: number;
      };
    }) => documentService.processFile(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files });
      toast({
        title: 'Success',
        description: 'File processing started',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process file',
        variant: 'destructive',
      });
    },
  });
}

export function useSearchDocuments() {
  return useMutation({
    mutationFn: ({
      query,
      params,
    }: {
      query: string;
      params?: {
        limit?: number;
        threshold?: number;
        documentType?: DocumentType;
      };
    }) => documentService.searchDocuments(query, params),
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Search failed',
        variant: 'destructive',
      });
    },
  });
}

export function useBatchProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileIds, documentType }: { fileIds: number[]; documentType?: DocumentType }) =>
      documentService.batchProcess(fileIds, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files });
      toast({
        title: 'Success',
        description: 'Batch processing started',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to start batch processing',
        variant: 'destructive',
      });
    },
  });
}

export function useFileStatus(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.file(id.toString()), 'status'],
    queryFn: () => documentService.getFileStatus(id),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
