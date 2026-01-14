import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '../services/kanbanService';
import type {
  KanbanBoard,
  Lead,
  MoveLeadRequest,
  UpdateLeadCustomFieldsRequest,
  AssignLeadRequest,
  CreateLeadRequest,
} from '../types/kanban.types';

export function useKanbanBoards() {
  const { data: boards = [], isLoading, error, refetch } = useQuery({
    queryKey: ['kanban-boards'],
    queryFn: () => kanbanService.getBoards(),
  });

  return {
    boards,
    isLoading,
    error: error?.message || null,
    refresh: refetch,
  };
}

export function useKanbanBoard(boardId: number | null) {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await kanbanService.getBoard(boardId);
      setBoard(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch board';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Optimistic update helper
  const updateBoardOptimistically = (updater: (board: KanbanBoard) => KanbanBoard) => {
    if (board) {
      setBoard(updater(board));
    }
  };

  // Move lead with optimistic update
  const moveLead = async (leadId: number, data: MoveLeadRequest) => {
    if (!board) return;

    // Save current state for rollback
    const previousBoard = { ...board };

    try {
      // Optimistic update
      updateBoardOptimistically((currentBoard) => {
        const newColumns = currentBoard.columns.map((col) => ({
          ...col,
          leads: col.leads.filter((lead) => lead.id !== leadId),
        }));

        const targetColumn = newColumns.find((col) => col.id === data.targetColumnId);
        if (targetColumn) {
          const movedLead = previousBoard.columns
            .flatMap((col) => col.leads)
            .find((lead) => lead.id === leadId);

          if (movedLead) {
            targetColumn.leads.splice(data.position, 0, {
              ...movedLead,
              kanban_column_id: data.targetColumnId,
              position: data.position,
            });
          }
        }

        return { ...currentBoard, columns: newColumns };
      });

      // API call
      await kanbanService.moveLead(leadId, data);
    } catch (err) {
      // Rollback on error
      setBoard(previousBoard);
      throw err;
    }
  };

  // Create lead
  const createLead = async (data: CreateLeadRequest): Promise<Lead> => {
    try {
      const newLead = await kanbanService.createLead(data);
      await fetchBoard(); // Refresh board
      return newLead;
    } catch (err) {
      throw err;
    }
  };

  // Update custom fields
  const updateLeadCustomFields = async (
    leadId: number,
    data: UpdateLeadCustomFieldsRequest
  ): Promise<void> => {
    try {
      await kanbanService.updateLeadCustomFields(leadId, data);
      await fetchBoard(); // Refresh board
    } catch (err) {
      throw err;
    }
  };

  // Assign lead
  const assignLead = async (leadId: number, data: AssignLeadRequest): Promise<void> => {
    try {
      await kanbanService.assignLead(leadId, data);
      await fetchBoard(); // Refresh board
    } catch (err) {
      throw err;
    }
  };

  // Delete lead
  const deleteLead = async (leadId: number): Promise<void> => {
    try {
      await kanbanService.deleteLead(leadId);
      await fetchBoard(); // Refresh board
    } catch (err) {
      throw err;
    }
  };

  return {
    board,
    isLoading,
    error,
    refresh: fetchBoard,
    moveLead,
    createLead,
    updateLeadCustomFields,
    assignLead,
    deleteLead,
  };
}
