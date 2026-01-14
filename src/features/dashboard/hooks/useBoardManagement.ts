import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kanbanService } from '../services/kanbanService';
import type { CreateBoardRequest } from '../types/kanban.types';
import { toast } from '@/hooks/use-toast';

export function useBoardManagement() {
  const queryClient = useQueryClient();

  const createBoard = useMutation({
    mutationFn: (data: CreateBoardRequest) => kanbanService.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-boards'] });
      toast({
        title: 'Success',
        description: 'Board created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: (boardId: number) => kanbanService.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-boards'] });
      toast({
        title: 'Success',
        description: 'Board deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createBoard,
    deleteBoard,
  };
}
