import { useQuery } from '@tanstack/react-query';
import { fetchJoinedGroups } from '@/services/api/mockService';
import { JoinedGroup } from '@/types/data';

export const useJoinedGroups = () => {
  return useQuery<JoinedGroup[]>({
    queryKey: ['joinedGroups'],
    queryFn: fetchJoinedGroups
  });
}; 