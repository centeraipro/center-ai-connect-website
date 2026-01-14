import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversationService';
import type {
  ConversationFilters,
  UpdateConversationPayload,
  ToggleAIPayload,
  AssignAdminPayload,
  SendAdminMessagePayload,
} from '../types/conversation.types';
import { toast } from '@/hooks/use-toast';

export function useAssignedConversations(filters: ConversationFilters = {}) {
  return useQuery({
    queryKey: ['conversations', 'assigned', filters],
    queryFn: () => conversationService.getAssignedConversations(filters),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 10000, // Refetch every 10 seconds (reduced from constant refetching)
  });
}

export function useBusinessConversations(businessId: number | undefined, filters: ConversationFilters = {}) {
  return useQuery({
    queryKey: ['conversations', 'business', businessId, filters],
    queryFn: () => conversationService.getBusinessConversations(businessId!, filters),
    enabled: !!businessId,
    staleTime: 30000,
    refetchInterval: 10000,
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 5000, // Consider messages fresh for 5 seconds
    refetchInterval: 8000, // Reduced from 3 seconds to 8 seconds
    refetchOnWindowFocus: true, // Refetch when user focuses window
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateConversationPayload }) =>
      conversationService.updateConversation(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'assigned'] });
      toast({
        title: 'Success',
        description: 'Conversation updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update conversation',
        variant: 'destructive',
      });
    },
  });
}

export function useEndConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => conversationService.endConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'assigned'] });
      toast({
        title: 'Success',
        description: 'Conversation ended',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to end conversation',
        variant: 'destructive',
      });
    },
  });
}

export function useToggleAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ToggleAIPayload }) =>
      conversationService.toggleAI(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'assigned'] });
      toast({
        title: 'Success',
        description: 'AI settings updated',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update AI settings',
        variant: 'destructive',
      });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: number) =>
      conversationService.sendAdminMessage(conversationId, { message: '' }),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });
}
