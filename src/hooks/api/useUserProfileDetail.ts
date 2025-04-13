import { useQuery } from '@tanstack/react-query';
import { fetchUserProfileDetail } from '@/services/api/mockService';
import { UserProfileDetail } from '@/types/data';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes, adjust as needed

export const useUserProfileDetail = (userId: string) => {
  return useQuery<UserProfileDetail, Error>({
    queryKey: ['userProfileDetail', userId],
    queryFn: () => fetchUserProfileDetail(userId),
    staleTime: STALE_TIME,
    enabled: !!userId, // Only fetch if userId is available
  });
}; 