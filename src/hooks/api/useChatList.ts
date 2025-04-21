import { useQuery } from '@tanstack/react-query';
import { fetchChatList } from '@/services/api/mockService';
import { ChatConversation } from '@/types/data';

const useChatList = () => {
  return useQuery<ChatConversation[], Error>({ // Specify types
    queryKey: ['chats', 'list'], // Define query key
    queryFn: fetchChatList, // Call the service function
    // Add staleTime/gcTime if desired, defaults are fine for now
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

export default useChatList; 