import { useQuery } from '@tanstack/react-query';
import * as mockService from '@/services/api/mockService';
import { FeedPost } from '@/types/data';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * Hook to fetch feed posts for the Feed screen
 */
export const useFeedPosts = () => {
  return useQuery<FeedPost[], Error>({
    queryKey: ['feed', 'posts'],
    queryFn: mockService.fetchFeedPosts,
    staleTime: STALE_TIME,
  });
}; 