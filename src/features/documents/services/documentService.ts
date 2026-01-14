import axios from 'axios';
import type {
  DocumentFile,
  DocumentStats,
  FileListResponse,
  UploadFileResponse,
  SearchResponse,
  DocumentStatus,
  DocumentType,
} from '../types/document.types';

const API_BASE_URL = 'http://localhost:3000/api';

export const documentService = {
  async uploadFiles(files: File[]): Promise<UploadFileResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post<UploadFileResponse>(
      `${API_BASE_URL}/documents/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getFiles(params?: {
    status?: DocumentStatus;
    limit?: number;
    offset?: number;
  }): Promise<FileListResponse> {
    const response = await axios.get<FileListResponse>(
      `${API_BASE_URL}/documents/files`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getFile(id: string): Promise<DocumentFile> {
    const response = await axios.get<DocumentFile>(
      `${API_BASE_URL}/documents/files/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },

  async deleteFile(id: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      `${API_BASE_URL}/documents/files/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },

  async downloadFile(id: string): Promise<Blob> {
    const response = await axios.get<Blob>(
      `${API_BASE_URL}/documents/files/${id}/download`,
      {
        responseType: 'blob',
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getStats(): Promise<DocumentStats> {
    const response = await axios.get<DocumentStats>(
      `${API_BASE_URL}/documents/stats`,
      { withCredentials: true }
    );
    return response.data;
  },

  async processFile(
    id: number,
    params?: {
      documentType?: DocumentType;
      chunkSize?: number;
      chunkOverlap?: number;
    }
  ): Promise<{ message: string; fileId: number }> {
    const response = await axios.post(
      `${API_BASE_URL}/documents/files/${id}/process`,
      params,
      { withCredentials: true }
    );
    return response.data;
  },

  async batchProcess(
    fileIds: number[],
    documentType?: DocumentType
  ): Promise<{ message: string; fileCount: number }> {
    const response = await axios.post(
      `${API_BASE_URL}/documents/batch-process`,
      { fileIds, documentType },
      { withCredentials: true }
    );
    return response.data;
  },

  async getFileStatus(id: number): Promise<DocumentFile> {
    const response = await axios.get<DocumentFile>(
      `${API_BASE_URL}/documents/files/${id}/status`,
      { withCredentials: true }
    );
    return response.data;
  },

  async searchDocuments(
    query: string,
    params?: {
      limit?: number;
      threshold?: number;
      documentType?: DocumentType;
    }
  ): Promise<SearchResponse> {
    const response = await axios.post<SearchResponse>(
      `${API_BASE_URL}/documents/search`,
      { query, ...params },
      { withCredentials: true }
    );
    return response.data;
  },

  async getBusinessActiveDocuments(
    businessId: number,
    documentType?: DocumentType
  ): Promise<any> {
    const response = await axios.get(
      `${API_BASE_URL}/documents/business/${businessId}/active`,
      {
        params: { documentType },
        withCredentials: true,
      }
    );
    return response.data;
  },
};
