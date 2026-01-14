export type DocumentStatus = 'uploaded' | 'processing' | 'indexed' | 'failed';
export type DocumentType = 'policy' | 'faq' | 'guide' | 'other';

export interface DocumentFile {
  id: string;
  business_id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  document_type?: DocumentType;
  uploaded_at: string;
  processed_at?: string;
  metadata?: Record<string, any>;
  error_message?: string;
  chunk_count?: number;
}

export interface DocumentStats {
  total: number;
  uploaded: number;
  processing: number;
  indexed: number;
  failed: number;
}

export interface FileListResponse {
  count: number;
  files: DocumentFile[];
}

export interface UploadFileResponse {
  message: string;
  files?: DocumentFile[];
}

export interface SearchResult {
  id: number;
  content: string;
  title: string;
  document_type: string;
  metadata: Record<string, any>;
  similarity: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}
