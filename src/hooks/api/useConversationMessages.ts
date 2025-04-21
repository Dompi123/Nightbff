import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversationMessages, sendMessage } from '@/services/api/mockService';
import { ChatMessage } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';

interface SendMessageParams {
  text: string;
  quotedMessageId?: string;
}

export const useConversationMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch messages for the conversation
  const {
    data: messages,
    isLoading,
    error,
    refetch
  } = useQuery<ChatMessage[]>({
    queryKey: ['conversationMessages', conversationId],
    queryFn: () => fetchConversationMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
  });
  
  // Send message mutation
  const mutation = useMutation<ChatMessage, Error, SendMessageParams>({
    mutationFn: ({ text, quotedMessageId }) => {
      // Use the logged-in user's ID, fallback to test user if not available
      const senderId = user?.id || 'user_001';
      // Adjust call to match placeholder signature (pass message object)
      // Note: senderId and quotedMessageId are not used by the current placeholder
      return sendMessage(conversationId, text);
    },
    onSuccess: (newMessage) => {
      // Update the conversation messages in the cache
      queryClient.setQueryData<ChatMessage[]>(
        ['conversationMessages', conversationId],
        (oldMessages = []) => [newMessage, ...oldMessages]
      );
      
      // Invalidate conversation list to update the last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  
  return {
    messages: messages || [],
    isLoading,
    error,
    refetch,
    sendMessage: mutation.mutate,
    isSending: mutation.isPending,
    sendError: mutation.error,
  };
}; 