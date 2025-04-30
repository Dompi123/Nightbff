import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '@/services/api/mockService';
import { ChatMessage } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext'; // Assuming useAuth provides current user info
import { Alert } from 'react-native';

interface UseSendMessageOptions {
    chatId: string;
}

// Define the shape of the mutation context for optimistic updates
interface MutationContext {
    previousMessages?: ChatMessage[];
}

// Define the variables passed to the mutate function
interface MutateVariables {
    text: string;
    // Add other potential variables like quotedMessageId if needed
}

/**
 * Custom hook to handle sending a message within a specific chat conversation.
 * Uses React Query's useMutation for handling the API call, loading states, 
 * error handling, and optimistic updates.
 *
 * @param options An object containing the chatId.
 * @param options.chatId The ID of the conversation to send the message to.
 * @returns The mutation object from useMutation, which includes:
 *  - mutate: Function to trigger the message sending process (takes { text } object).
 *  - isPending: Boolean indicating if the message is currently being sent.
 *  - isError: Boolean indicating if an error occurred.
 *  - error: The error object if an error occurred.
 *  - and other useMutation return properties...
 */
const useSendMessage = ({ chatId }: UseSendMessageOptions) => {
    const queryClient = useQueryClient();
    const { user } = useAuth(); // Get current user from AuthContext

    // Define the query key for this specific chat's messages
    const messagesQueryKey = ['conversationMessages', chatId];

    return useMutation<ChatMessage, Error, MutateVariables, MutationContext>({ // Explicit types
        mutationFn: ({ text }) => sendMessage(chatId, text), // Pass chatId from hook scope and text from variables
        
        onMutate: async ({ text }) => {
            await queryClient.cancelQueries({ queryKey: messagesQueryKey });

            const previousMessages = queryClient.getQueryData<ChatMessage[]>(messagesQueryKey);

            // Optimistically update to the new value
            if (previousMessages) {
                const optimisticMessage: ChatMessage = {
                    id: `temp-${Date.now()}`,
                    conversationId: chatId,
                    text: text,
                    timestamp: new Date().toISOString(),
                    sender: { 
                        id: user?.id || 'user_001', // Use authenticated user ID or fallback
                        name: user?.name || 'Me', // Use authenticated user name or fallback
                        avatarUrl: 'https://i.pravatar.cc/150?img=32' // Use fallback directly
                    },
                    isRead: true, // Optimistic read status
                    // Add other fields matching ChatMessage, e.g., isEdited: false
                    // Optionally add a status field: status: 'sending' 
                };
                // Add to the end for non-inverted list, but our list IS inverted
                // So we add to the BEGINNING for correct visual placement
                queryClient.setQueryData<ChatMessage[]>(messagesQueryKey, [optimisticMessage, ...previousMessages]);
            }

            // Return a context object with the snapshotted value
            return { previousMessages };
        },
        
        // Add onSuccess handler for manual cache update
        onSuccess: (newlySentMessage: ChatMessage) => {
          queryClient.setQueryData<ChatMessage[]>(messagesQueryKey, (oldData) => {
            if (!oldData) {
                return [newlySentMessage]; 
            }
            
            // Find the optimistic message (which should be at the start due to prepending)
            const optimisticMessageIndex = oldData.findIndex(msg => msg.id.startsWith('temp-'));
            
            if (optimisticMessageIndex > -1) {
               // Replace the temp message with the real one from the server/mock
               const updatedData = [...oldData];
               updatedData[optimisticMessageIndex] = newlySentMessage;
               return updatedData;
            } else {
               // If no optimistic message found (unexpected with current onMutate), 
               // decide on fallback: append, prepend, or maybe log error?
               // Let's prepend to match the optimistic update logic visually.
               return [newlySentMessage, ...oldData];
            }
          });
        },

        onError: (err, variables, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData<ChatMessage[]>(messagesQueryKey, context.previousMessages);
            }
            // Consider adding an alert here for the user
            Alert.alert('Send Error', `Failed to send message: ${err.message}`); 
        },
        
        onSettled: (data, error, variables, context) => {
            // Always refetch after error or success to ensure consistency
            // *** COMMENT OUT for mock service with manual update ***
            // queryClient.invalidateQueries({ queryKey: messagesQueryKey });
        },
    });
};

export default useSendMessage; 