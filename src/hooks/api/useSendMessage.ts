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

const useSendMessage = ({ chatId }: UseSendMessageOptions) => {
    const queryClient = useQueryClient();
    const { user } = useAuth(); // Get current user from AuthContext

    // Define the query key for this specific chat's messages
    const messagesQueryKey = ['conversationMessages', chatId];

    return useMutation<ChatMessage, Error, MutateVariables, MutationContext>({ // Explicit types
        mutationFn: ({ text }) => sendMessage(chatId, text), // Pass chatId from hook scope and text from variables
        
        onMutate: async ({ text }) => {
            console.log('DEBUG: Optimistic Update Started');
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: messagesQueryKey });

            // Snapshot the previous value
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
                console.log('DEBUG: Optimistic Update Applied');
            }

            // Return a context object with the snapshotted value
            return { previousMessages };
        },
        
        // Add onSuccess handler for manual cache update
        onSuccess: (newlySentMessage: ChatMessage) => {
          console.log('DEBUG: Send Message Mock Success:', newlySentMessage);

          // --- MANUAL CACHE UPDATE --- 
          queryClient.setQueryData<ChatMessage[]>(messagesQueryKey, (oldData) => {
            if (!oldData) {
                console.log('DEBUG: Cache empty, initializing with new message');
                return [newlySentMessage]; 
            }
            
            // Find the optimistic message (which should be at the start due to prepending)
            const optimisticMessageIndex = oldData.findIndex(msg => msg.id.startsWith('temp-'));
            
            if (optimisticMessageIndex > -1) {
               // Replace the temp message with the real one from the server/mock
               const updatedData = [...oldData];
               updatedData[optimisticMessageIndex] = newlySentMessage;
               console.log(`DEBUG: Cache updated manually by replacing temp message at index ${optimisticMessageIndex}`);
               return updatedData;
            } else {
               // If no optimistic message found (unexpected with current onMutate), 
               // decide on fallback: append, prepend, or maybe log error?
               // Let's prepend to match the optimistic update logic visually.
               console.warn('DEBUG: Optimistic message not found in cache, prepending new message anyway.');
               return [newlySentMessage, ...oldData];
            }
          });
          // --- END MANUAL CACHE UPDATE ---
        },

        onError: (err, variables, context) => {
            console.error('DEBUG: Send Message Error:', err);
            // Rollback on error using the context from onMutate
            if (context?.previousMessages) {
                queryClient.setQueryData<ChatMessage[]>(messagesQueryKey, context.previousMessages);
                console.log('DEBUG: Optimistic Update Rolled Back');
            }
            // Consider adding an alert here for the user
            Alert.alert('Send Error', `Failed to send message: ${err.message}`); 
        },
        
        onSettled: () => {
            console.log('DEBUG: Mutation Settled. SKIPPING invalidation due to manual update.');
            // Always refetch after error or success to ensure consistency
            // *** COMMENT OUT for mock service with manual update ***
            // queryClient.invalidateQueries({ queryKey: messagesQueryKey });
        },
    });
};

export default useSendMessage; 