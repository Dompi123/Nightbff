import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/services/api/mockService';
import { UserProfile } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useQuery<UserProfile>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId
  });
}; 