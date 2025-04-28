import { useQuery } from '@tanstack/react-query';
import { fetchMyFriends } from '@/services/api/mockService'; // Assuming this is where the mock function lives
import { FriendProfile } from '@/types/data';

export const useMyFriends = () => {
  const { 
    data: friends,
    isLoading,
    isError,
    error,
  } = useQuery<FriendProfile[], Error>({
    queryKey: ['myFriends'], 
    queryFn: fetchMyFriends,
    // Add other options if needed (e.g., staleTime, cacheTime)
  });

  return {
    data: friends, 
    isLoading,
    isError,
    error,
  };
}; 