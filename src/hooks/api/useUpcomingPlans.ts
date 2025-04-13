import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingPlans } from '@/services/api/mockService';
import { UpcomingPlan } from '@/types/data';

export const useUpcomingPlans = () => {
  return useQuery<UpcomingPlan[]>({
    queryKey: ['upcomingPlans'],
    queryFn: fetchUpcomingPlans
  });
}; 