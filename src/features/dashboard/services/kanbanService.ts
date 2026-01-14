import type {
  KanbanBoard,
  Lead,
  MoveLeadRequest,
  UpdateLeadCustomFieldsRequest,
  AssignLeadRequest,
  CreateLeadRequest,
  CreateBoardRequest,
} from '../types/kanban.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const KANBAN_PREFIX = '/api/kanban';
const LEADS_PREFIX = '/api/leads';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const kanbanService = {
  // Board operations
  async createBoard(data: CreateBoardRequest): Promise<KanbanBoard> {
    const response = await fetch(`${API_BASE_URL}${KANBAN_PREFIX}/boards`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create board');
    }

    return response.json();
  },

  async getBoards(): Promise<KanbanBoard[]> {
    const response = await fetch(`${API_BASE_URL}${KANBAN_PREFIX}/boards`, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch boards');
    }

    return response.json();
  },

  async getBoard(boardId: number): Promise<KanbanBoard> {
    const response = await fetch(`${API_BASE_URL}${KANBAN_PREFIX}/boards/${boardId}`, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch board');
    }

    return response.json();
  },

  async deleteBoard(boardId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${KANBAN_PREFIX}/boards/${boardId}`, {
      method: 'DELETE',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete board');
    }
  },

  // Lead operations
  async createLead(data: CreateLeadRequest): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}${LEADS_PREFIX}`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create lead');
    }

    return response.json();
  },

  async moveLead(leadId: number, data: MoveLeadRequest): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}${LEADS_PREFIX}/${leadId}/move`, {
      method: 'PATCH',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to move lead');
    }

    return response.json();
  },

  async updateLeadCustomFields(
    leadId: number,
    data: UpdateLeadCustomFieldsRequest
  ): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}${LEADS_PREFIX}/${leadId}/custom-fields`, {
      method: 'PATCH',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update custom fields');
    }

    return response.json();
  },

  async assignLead(leadId: number, data: AssignLeadRequest): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}${LEADS_PREFIX}/${leadId}/assign`, {
      method: 'PATCH',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign lead');
    }

    return response.json();
  },

  async deleteLead(leadId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${LEADS_PREFIX}/${leadId}`, {
      method: 'DELETE',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete lead');
    }
  },
};
