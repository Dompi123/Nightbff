import { useQuery } from '@tanstack/react-query';
import * as mockService from '@/services/api/mockService';
import { CardData, Interest, Plan, UserLocation, MapRegion, NightlifeGroup, BffProfile, NearbyGroup } from '@/types/data'; // Add new types

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * Fetches trending nightlife plans.
 */
export const useTrendingPlans = () => {
  return useQuery<CardData[], Error>({
    queryKey: ['trendingPlans'],
    queryFn: mockService.fetchTrendingPlans,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches discoverable hotspots.
 */
export const useHotspots = () => {
  return useQuery<CardData[], Error>({
    queryKey: ['hotspots'],
    queryFn: mockService.fetchHotspots,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches popular nightlife groups.
 */
export const useNightlifeGroups = () => {
  return useQuery<NightlifeGroup[], Error>({
    queryKey: ['nightlifeGroups'],
    queryFn: mockService.fetchNightlifeGroups,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches explore interests.
 */
export const useInterests = () => {
  return useQuery<Interest[], Error>({
    queryKey: ['interests'],
    queryFn: mockService.fetchInterests,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches plans for the Explore screen
 */
export const usePlans = () => {
  return useQuery<Plan[], Error>({
    queryKey: ['explorePlans'],
    queryFn: mockService.fetchExplorePlans,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches details for a specific plan by ID
 */
export const usePlanDetails = (planId: string) => {
  return useQuery<Plan | null, Error>({
    queryKey: ['planDetails', planId],
    queryFn: () => mockService.fetchPlanDetails(planId),
    staleTime: STALE_TIME,
    // Only fetch when planId is available
    enabled: !!planId,
  });
};

/**
 * Fetches nearby users based on the current map region
 */
export const useNearbyUsers = (region: MapRegion | null) => {
  return useQuery<UserLocation[], Error>({
    queryKey: ['nearbyUsers', region],
    queryFn: () => mockService.fetchNearbyUsers(region || DEFAULT_REGION),
    staleTime: STALE_TIME / 2, // More frequent updates for location data
    // Only fetch when region is available
    enabled: !!region,
    // Add retry for location data which might be flaky
    retry: 2,
  });
};

/**
 * Fetches BFFs you may like for the home screen
 */
export const useBffsYouMayLike = () => {
  return useQuery<BffProfile[], Error>({
    queryKey: ['bffsYouMayLike'],
    queryFn: mockService.fetchBffsYouMayLike,
    staleTime: STALE_TIME,
  });
};

/**
 * Fetches a nearby group for the home screen
 */
export const useNearbyGroup = () => {
  return useQuery<NearbyGroup, Error>({
    queryKey: ['nearbyGroup'],
    queryFn: mockService.fetchNearbyGroup,
    staleTime: STALE_TIME,
  });
};

// Default region for Halifax downtown area
const DEFAULT_REGION: MapRegion = {
  latitude: 44.648764,
  longitude: -63.575239,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Add hooks for explorePlans and planDetails later in Phase 2 