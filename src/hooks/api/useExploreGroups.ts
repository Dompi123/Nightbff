import { useQuery } from '@tanstack/react-query';
import { fetchExploreGroups } from '@/services/api/mockService'; // Adjust path if needed
import { ExploreGroupCardData } from '@/types/data'; // Adjust path if needed

export const useExploreGroups = (filter?: string) => {
  return useQuery<ExploreGroupCardData[], Error>({
    queryKey: ['exploreGroups', filter || 'all'], // Query key includes the filter
    queryFn: () => fetchExploreGroups(filter),
    // Optional: Configure staleTime, cacheTime, etc.
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 