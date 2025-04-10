import { useQuery } from '@tanstack/react-query';
import * as mockService from '@/services/api/mockService';
import { PopularGroupDetail } from '@/types/data';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * Fetches detailed data for a specific popular group by ID
 * @param groupId - The ID of the group to fetch details for
 */
export const usePopularGroupDetail = (groupId: string) => {
  return useQuery<PopularGroupDetail, Error>({
    queryKey: ['popularGroupDetail', groupId],
    queryFn: () => mockService.fetchPopularGroupDetail(groupId),
    staleTime: STALE_TIME,
    // Only fetch when groupId is available
    enabled: !!groupId,
  });
}; 