import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversationMessages, sendMessage } from '@/services/api/mockService';
import { ChatMessage } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';

interface SendMessageParams {
  text: string;
  quotedMessageId?: string;
}

/**
 * Custom hook to manage messages within a specific conversation.
 * Handles fetching messages and sending new messages via mutations.
 *
 * @param conversationId The ID of the conversation to manage messages for.
 * @returns An object containing:
 *  - messages: An array of ChatMessage objects for the conversation.
 *  - isLoading: Boolean indicating if messages are currently being fetched.
 *  - error: Any error object encountered during fetching.
 *  - refetch: Function to manually trigger a refetch of messages.
 *  - sendMessage: Function to send a new message (takes { text, quotedMessageId } object).
 *  - isSending: Boolean indicating if a message is currently being sent.
 *  - sendError: Any error object encountered during sending.
 */
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