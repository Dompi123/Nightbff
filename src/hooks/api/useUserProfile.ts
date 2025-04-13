import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/services/api/mockService';
import { UserProfile } from '@/types/data';

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  });
}; 