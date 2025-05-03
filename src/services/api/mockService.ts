import { CardData, Interest, Plan, UserLocation, MapRegion, NightlifeGroup, BffProfile, NearbyGroup, PopularGroupDetail, UserProfile, JoinedGroup, UpcomingPlan, UserProfileDetail, ExploreGroupCardData, ChatMessage, ChatConversation, FriendProfile } from '@/types/data'; // Import types from central file and new types

// Simulate network delay
const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

// Simulate occasional errors - REMOVED AS UNUSED
// const maybeThrowError = (probability: number = 0.1) => {
//   if (Math.random() < probability) {
//     throw new Error('Simulated network error!');
//   }
// };

// Common avatar URLs for reuse
const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
];

// --- Mock Data Definitions ---

const mockTrendingPlansData: CardData[] = [
  {
    id: 'plan_1',
    title: 'LA Club Craze',
    subtitle: 'FRI-SAT',
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    iconType: 'person',
    count: 10,
    location: 'LA',
    emoji: '🔥',
    userAvatars: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    userCount: 184
  },
  {
    id: 'plan_2',
    title: 'Vegas Sky Party',
    subtitle: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    iconType: 'person',
    count: 8,
    location: 'Vegas',
    emoji: '✨',
    userAvatars: [AVATAR_URLS[1], AVATAR_URLS[3], AVATAR_URLS[4]],
    userCount: 127
  },
  {
    id: 'plan_3',
    title: 'NYC Nightlife Tour',
    subtitle: 'NEXT MONTH',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    iconType: 'globe',
    count: 15,
    location: 'New York',
    emoji: '🗽',
    userAvatars: [AVATAR_URLS[2], AVATAR_URLS[0], AVATAR_URLS[3]],
    userCount: 95
  }
];

// New mock data for popular nightlife groups
const mockNightlifeGroups: NightlifeGroup[] = [
  {
    id: 'group_1',
    title: 'LA Club Crawl April Weekend',
    location: 'Los Angeles',
    locationFlag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    dateRange: 'Apr 12 - Apr 14',
    userAvatars: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    attendeeCount: 23
  },
  {
    id: 'group_2',
    title: 'Vegas Weekend Extravaganza',
    location: 'Las Vegas',
    locationFlag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    dateRange: 'Apr 19 - Apr 21',
    userAvatars: [AVATAR_URLS[3], AVATAR_URLS[4], AVATAR_URLS[0]],
    attendeeCount: 42
  },
  {
    id: 'group_3',
    title: 'Miami Beach Club Party',
    location: 'Miami',
    locationFlag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    dateRange: 'Apr 26 - Apr 28',
    userAvatars: [AVATAR_URLS[2], AVATAR_URLS[1], AVATAR_URLS[4]],
    attendeeCount: 18
  },
  {
    id: 'nearby_1',
    title: 'Downtown Explorers (Mock)',
    location: 'Downtown LA',
    locationFlag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    dateRange: 'Ongoing',
    userAvatars: [AVATAR_URLS[0], AVATAR_URLS[3]],
    attendeeCount: 25
  }
];

const mockHotspotsData: CardData[] = [
  {
    id: 'hotspot_1',
    title: 'Rooftop Bar Downtown',
    subtitle: 'THU-SUN',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    iconType: 'person',
    count: 23,
    location: 'Downtown',
    emoji: '🍹'
  },
  {
    id: 'hotspot_2',
    title: 'Underground Techno Rave',
    subtitle: 'NEXT SAT',
    imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    iconType: 'globe',
    count: 14,
    location: 'Warehouse District',
    emoji: '🔊'
  },
  {
    id: 'hotspot_3',
    title: 'Beach Club Paradise',
    subtitle: 'EVERY WEEKEND',
    imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    iconType: 'person',
    count: 42,
    location: 'Beachfront',
    emoji: '🏝️'
  }
];

const mockInterestsData: Interest[] = [
  {
    id: 'interest_1',
    title: 'DJ Nights',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'interest_2',
    title: 'Rooftop Parties',
    imageUrl: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'interest_3',
    title: 'Digital Nomad',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
  }
];

const mockExplorePlansData: Plan[] = [
  { 
    id: 'plan_detail_1', 
    title: 'LA Club Crawl', 
    location: 'Hollywood, Los Angeles', 
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Join us for an epic night out exploring the best clubs in Hollywood! We will start at 9pm and visit 3-4 of the hottest venues on the strip. Great for meeting new people and dancing the night away!',
    host: 'NightBFF Team'
  },
  { 
    id: 'plan_detail_2', 
    title: 'Downtown Rooftop Hop', 
    location: 'Downtown LA', 
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    description: 'Experience the best views of Downtown LA from exclusive rooftop bars. We will visit 3 premium locations with signature cocktails and amazing skyline views. Perfect for networking and capturing Instagram-worthy moments.',
    host: 'Sarah Johnson'
  },
  { 
    id: 'plan_detail_3', 
    title: 'Techno Underground', 
    location: 'Arts District, Los Angeles', 
    imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'For true electronic music lovers! We are hitting the best underground techno venues in the Arts District. Featuring both established and emerging DJs in intimate warehouse spaces with incredible sound systems.',
    host: 'Techno Collective'
  },
  { 
    id: 'plan_detail_4', 
    title: 'Venice Beach Sunset Party', 
    location: 'Venice Beach, CA', 
    imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Start with a beautiful sunset on Venice Beach, then join our exclusive beach party with bonfires, music, and dancing under the stars. Bring your beach vibes and good energy!',
    host: 'Beach Life Crew'
  },
  { 
    id: 'plan_detail_5', 
    title: 'Jazz & Cocktails Night', 
    location: 'West Hollywood', 
    imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'A sophisticated evening of classic jazz and craft cocktails at one of West Hollywood\'s most elegant speakeasies. Dress to impress and enjoy the smooth sounds of live performers.',
    host: 'Classic Nightlife'
  },
  { 
    id: 'plan_detail_6', 
    title: 'Neon Night Run', 
    location: 'Santa Monica', 
    imageUrl: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Join our unique 5K run along the beach at night, lit up with neon lights and glow-in-the-dark accessories. Finish with a beachfront party featuring DJs, food trucks, and plenty of photo ops.',
    host: 'Active Nights'
  },
  { 
    id: 'plan_detail_7', 
    title: 'Exclusive Album Release Party', 
    location: 'Hollywood Hills', 
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Be among the first to hear the newest tracks from rising star DJ Cosmic at this exclusive mansion party in the Hollywood Hills. Limited spots available!',
    host: 'Platinum Entertainment'
  },
  { 
    id: 'plan_detail_8', 
    title: 'New Year\'s Eve Extravaganza', 
    location: 'Beverly Hills', 
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Ring in the New Year with style at our annual black-tie event featuring multiple dance floors, open premium bars, gourmet catering, and a spectacular midnight countdown with champagne toast.',
    host: 'Elite Events'
  }
];

// Added Mock Data for Explore Groups
const mockExploreGroups: ExploreGroupCardData[] = [
  {
    id: 'group_1',
    title: 'Dubai Crazy Trip',
    imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    startDate: '2024-04-13',
    endDate: '2024-05-28',
    location: 'United Arab Emirates',
    locationFlag: '🇦🇪',
    attendeeAvatars: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    attendeeCount: 123,
  },
  {
    id: 'group_2',
    title: 'Barcelona Experiences',
    imageUrl: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    startDate: '2024-04-09',
    endDate: '2024-09-10',
    location: 'Spain',
    locationFlag: '🇪🇸',
    attendeeAvatars: [AVATAR_URLS[3], AVATAR_URLS[4], AVATAR_URLS[0]],
    attendeeCount: 189,
  },
  {
    id: 'group_3',
    title: 'Solotravelers Party - Rome',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    startDate: '2024-04-08',
    endDate: '2024-05-08',
    location: 'Italy',
    locationFlag: '🇮🇹',
    attendeeAvatars: [AVATAR_URLS[1], AVATAR_URLS[2], AVATAR_URLS[4]],
    attendeeCount: 95,
  },
  {
    id: 'group_4',
    title: 'NYC Rooftop Season Opener',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    location: 'New York',
    locationFlag: '🇺🇸',
    attendeeAvatars: [AVATAR_URLS[0], AVATAR_URLS[3]],
    attendeeCount: 77,
  },
  {
    id: 'group_5',
    title: 'London Pub Crawl Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    startDate: '2024-06-10',
    endDate: '2024-06-10',
    location: 'United Kingdom',
    locationFlag: '🇬🇧',
    attendeeAvatars: [AVATAR_URLS[1], AVATAR_URLS[4], AVATAR_URLS[2], AVATAR_URLS[0]],
    attendeeCount: 210,
  },
  {
    id: 'group_6',
    title: 'Berlin Techno Nights',
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    location: 'Germany',
    locationFlag: '🇩🇪',
    attendeeAvatars: [AVATAR_URLS[3], AVATAR_URLS[1]],
    attendeeCount: 55,
  },
];

// --- Mock User Database ---
interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Pre-populated user accounts for testing
const mockUsers: MockUser[] = [
  {
    id: 'user_001',
    name: 'Test User',
    email: 'test@test.com',
    password: 'password123'
  },
  {
    id: 'user_002',
    name: 'Demo User',
    email: 'demo@nightbff.com',
    password: 'demo123'
  }
];

// Mock Nearby Users Data (for map)
const mockNearbyUsersData: UserLocation[] = [
  {
    id: 'user1',
    name: 'Alex',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    location: {
      latitude: 44.652164, // North of center
      longitude: -63.577839,
    },
    distance: '0.2 mi',
    isOnline: true,
    age: 28,
    flag: '🇨🇦'
  },
  {
    id: 'user2',
    name: 'Taylor',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    location: {
      latitude: 44.647164, // Southwest of center
      longitude: -63.582039,
    },
    distance: '0.3 mi',
    isOnline: false,
    age: 24,
    flag: '🇺🇦'
  },
  {
    id: 'user3',
    name: 'Jordan',
    profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    location: {
      latitude: 44.655364, // Northeast of center
      longitude: -63.568639,
    },
    distance: '0.4 mi',
    isOnline: true,
    age: 32,
    flag: '🇨🇦'
  },
  {
    id: 'user4',
    name: 'Édwint',
    profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80',
    location: {
      latitude: 44.641864, // South of center
      longitude: -63.575139,
    },
    distance: '0.6 mi',
    isOnline: false,
    age: 26,
    flag: '🇨🇦'
  },
  {
    id: 'user5',
    name: 'Ruslana',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      latitude: 44.649064, // Northwest of center
      longitude: -63.590539,
    },
    distance: '0.7 mi',
    isOnline: true,
    age: 29,
    flag: '🇺🇦'
  },
  {
    id: 'user6',
    name: 'Nev',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
    location: {
      latitude: 44.641464, // Southeast of center
      longitude: -63.561239,
    },
    distance: '0.6 mi',
    isOnline: true,
    age: 31,
    flag: '🇨🇦'
  },
  {
    id: 'user7',
    name: 'Étienne',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    location: {
      latitude: 44.646064, // Close to center
      longitude: -63.576939,
    },
    distance: '0.3 mi',
    isOnline: true,
    age: 27,
    flag: '🇨🇦'
  },
  {
    id: 'user8',
    name: 'Aaron',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    location: {
      latitude: 44.648664, // Very close to center
      longitude: -63.573939,
    },
    distance: '0.2 mi',
    isOnline: true,
    age: 23,
    flag: '🇨🇦'
  }
];

// New mock data for "BFFs you may like" section
const mockBffs: BffProfile[] = [
  {
    id: 'bff_1',
    name: 'Ahmed',
    age: 30,
    avatarUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
    isOnline: true,
    countryFlag: '🇴🇲' // Oman
  },
  {
    id: 'bff_2',
    name: 'Emir',
    age: 25,
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    isOnline: true,
    countryFlag: '🇩🇪' // Germany
  },
  {
    id: 'bff_3',
    name: 'Hamza',
    age: 21,
    avatarUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    isOnline: true,
    countryFlag: '🇮🇹' // Italy
  },
  {
    id: 'bff_4',
    name: 'Sofia',
    age: 28,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    isOnline: false,
    countryFlag: '🇪🇸' // Spain
  },
  {
    id: 'bff_5',
    name: 'Justin',
    age: 32,
    avatarUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2034&q=80',
    isOnline: true,
    countryFlag: '🇨🇦' // Canada
  }
];

// New mock data for "Nearby Groups" section
const mockNearbyGroups: NearbyGroup[] = [
  {
    id: 'nearby_1',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    flag: '🇨🇦',
    location: 'Canada',
    dateRange: 'Aug 5 - Aug 15',
    title: 'Halifax',
    userAvatars: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    memberCount: 4
  }
];

// Detailed data for specific popular group
const mockPopularGroupDetails: Record<string, PopularGroupDetail> = {
  'group_1': {
    id: 'group_1',
    title: 'LA Club Crawl April Weekend',
    location: 'Los Angeles',
    locationFlag: '🇺🇸',
    dateRange: 'Apr 12 - Apr 14',
    heroImageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Join us for an unforgettable weekend exploring the best nightlife Los Angeles has to offer! We\'ll be hitting multiple exclusive clubs each night, with VIP access and no cover charges.',
    userAvatars: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2], AVATAR_URLS[3], AVATAR_URLS[4]],
    attendeeCount: 23,
    interests: [
      { id: 'int_1', name: 'DJ Sets', icon: '🎧' },
      { id: 'int_2', name: 'Craft Cocktails', icon: '🍹' },
      { id: 'int_3', name: 'Live Bands', icon: '🎸' },
      { id: 'int_4', name: 'Dancing', icon: '💃' },
    ],
    venue: {
      id: 'venue_1',
      name: 'Shinjuku',
      imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    organizer: {
      id: 'org_1',
      name: 'Kyara',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      title: 'Group Organizer',
    },
  },
  'group_2': {
    id: 'group_2',
    title: 'Vegas Weekend Extravaganza',
    location: 'Las Vegas',
    locationFlag: '🇺🇸',
    dateRange: 'Apr 19 - Apr 21',
    heroImageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Experience the ultimate Vegas weekend! We\'ve arranged exclusive access to the most sought-after clubs and pool parties on the strip. This trip includes priority entry to marquee venues, table service at select locations, and group transportation between spots. Perfect for those looking to enjoy Vegas nightlife without the hassle of planning. Join fellow travelers for an unforgettable weekend of world-class DJs, dancing, and networking!',
    userAvatars: [AVATAR_URLS[3], AVATAR_URLS[4], AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    attendeeCount: 42,
    interests: [
      { id: 'int_2', name: 'Craft Cocktails', icon: '🍹' },
      { id: 'int_5', name: 'Pool Parties', icon: '🏊' },
      { id: 'int_6', name: 'VIP Experience', icon: '💎' },
      { id: 'int_7', name: 'Night Clubs', icon: '🔊' },
    ],
    venue: {
      id: 'venue_2',
      name: 'Strip District',
      imageUrl: 'https://images.unsplash.com/photo-1581350845039-694cfb3cc60a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    organizer: {
      id: 'org_2',
      name: 'Marcus',
      avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      title: 'Vegas Nightlife Expert',
    },
  },
  'group_3': {
    id: 'group_3',
    title: 'Miami Beach Club Party',
    location: 'Miami',
    locationFlag: '🇺🇸',
    dateRange: 'Apr 26 - Apr 28',
    heroImageUrl: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Discover Miami\'s vibrant nightlife scene with our local experts! This 3-day adventure covers the best clubs in South Beach and downtown. You\'ll enjoy skip-the-line access to premium venues, a sunset yacht party, and plenty of time to enjoy Miami\'s beautiful beaches during the day.',
    userAvatars: [AVATAR_URLS[2], AVATAR_URLS[1], AVATAR_URLS[4], AVATAR_URLS[0], AVATAR_URLS[3]],
    attendeeCount: 18,
    interests: [
      { id: 'int_8', name: 'Beach Parties', icon: '🏖️' },
      { id: 'int_9', name: 'Rooftop Bars', icon: '🏙️' },
      { id: 'int_7', name: 'Night Clubs', icon: '🔊' },
      { id: 'int_10', name: 'Latin Music', icon: '💃' },
    ],
    venue: {
      id: 'venue_3',
      name: 'South Beach',
      imageUrl: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    organizer: {
      id: 'org_3',
      name: 'Sofia',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
      title: 'Party Coordinator',
    },
  },
};

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Traveler',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
  stats: {
    groups: 1,
    plans: 0,
    venuesVisited: 1
  }
};

const mockJoinedGroups: JoinedGroup[] = [
  {
    id: '1',
    name: 'Croatia',
    imageUrl: 'https://images.unsplash.com/photo-1555990538-17392d5e576a',
    location: 'Dubrovnik',
    dateRange: 'Oct 2 - Dec 23',
    isJoined: true
  },
  {
    id: '2',
    name: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    location: 'Tokyo',
    dateRange: 'Jan 15 - Mar 30',
    isJoined: true
  }
];

const mockUpcomingPlans: UpcomingPlan[] = [];

// MOCK USER DETAIL DATA
// Ensure this structure matches your UserProfileDetail interface EXACTLY
const mockUserProfiles: { [key: string]: UserProfileDetail } = {
  'bff_1': { // Example ID, ensure this matches IDs used on Homescreen
    id: 'bff_1',
    name: 'Chris',
    age: 32,
    location: 'United States',
    countryFlag: '🇺🇸',
    isVerified: true,
    profileImageUrls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'],
    aboutMe: 'I love to travel and wanna meet new friends along the way ✌️ Will be solo traveling for the next 6 months. Down to go anywhere!',
    badges: ['Pro', 'Verified'],
    socials: [{ type: 'instagram', isSet: false }, { type: 'tiktok', isSet: false }],
    interests: ['Adventure', 'Nature', 'Road Trip', 'Hiking', 'Backpacking'],
    languages: ['English'],
  },
  'bff_2': { // Add at least one more mock profile
     id: 'bff_2',
     name: 'Alex',
     age: 28,
     location: 'Canada',
     countryFlag: '🇨🇦',
     isVerified: false,
     profileImageUrls: ['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80'], // Used a nearby user avatar
     aboutMe: 'Exploring the city nightlife. Looking for recommendations!',
     badges: [],
     socials: [{ type: 'instagram', isSet: true }, { type: 'tiktok', isSet: false }],
     interests: ['Live Music', 'Clubs', 'Cocktails'],
     languages: ['English', 'French'],
  },
  'tsune_1': { // Added Tsune mock profile
    id: 'tsune_1',
    name: 'Tsune',
    age: 22,
    location: 'Japan',
    countryFlag: '🇯🇵',
    isVerified: true,
    profileImageUrls: ['https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'], // Placeholder image
    aboutMe: 'A Japanese studying in Shanghai. Would love to explore the world and looking for new friends',
    badges: ['Verified'],
    socials: [{ type: 'instagram', isSet: true }, { type: 'tiktok', isSet: true }],
    interests: ['Photography', 'City Exploration', 'Foodie'],
    languages: ['Japanese', 'English', 'Mandarin'],
  },
  'bff_3': {
    id: 'bff_3',
    name: 'Samira',
    age: 25,
    location: 'United Kingdom',
    countryFlag: '🇬🇧',
    isVerified: true,
    profileImageUrls: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'], // Placeholder image
    aboutMe: 'Loves techno music and finding hidden gems in the city.',
    badges: ['Verified', 'Music Lover'],
    socials: [{ type: 'instagram', isSet: true }, { type: 'tiktok', isSet: true }],
    interests: ['Techno', 'Travel', 'Photography', 'Hidden Bars'],
    languages: ['English', 'Spanish'],
  },
  'bff_4': {
    id: 'bff_4',
    name: 'Kenji',
    age: 29,
    location: 'Singapore',
    countryFlag: '🇸🇬',
    isVerified: false,
    profileImageUrls: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'], // Placeholder image
    aboutMe: 'Digital nomad exploring Southeast Asia. Always up for an adventure or a good coffee.',
    badges: ['Digital Nomad'],
    socials: [{ type: 'instagram', isSet: true }, { type: 'tiktok', isSet: false }],
    interests: ['Travel', 'Coffee', 'Startups', 'Hiking'],
    languages: ['English', 'Japanese'],
  },
  'bff_5': {
    id: 'bff_5',
    name: 'Aiko',
    age: 26,
    location: 'Japan',
    countryFlag: '🇯🇵',
    isVerified: false,
    profileImageUrls: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'], // Placeholder image
    aboutMe: 'Just moved here, looking for cool bars and music venues. Love photography!',
    badges: [],
    socials: [{ type: 'instagram', isSet: true }, { type: 'tiktok', isSet: false }],
    interests: ['Bars', 'Rooftops', 'Electronic Music', 'Photography'],
    languages: ['Japanese', 'English'],
  },
};

// --- Mock API Functions ---

export const fetchTrendingPlans = async (): Promise<CardData[]> => {
  await simulateDelay();
  return mockTrendingPlansData;
};

export const fetchHotspots = async (): Promise<CardData[]> => {
  await simulateDelay();
  return mockHotspotsData;
};

export const fetchInterests = async (): Promise<Interest[]> => {
  await simulateDelay();
  return mockInterestsData;
};

export const fetchExplorePlans = async (): Promise<Plan[]> => {
  await simulateDelay();
  return mockExplorePlansData;
};

export const fetchPlanDetails = async (planId: string): Promise<Plan | null> => {
  await simulateDelay();
  
  const plan = mockExplorePlansData.find(p => p.id === planId);
  return plan || null;
};

export const fetchNearbyUsers = async (region: MapRegion): Promise<UserLocation[]> => {
  await simulateDelay();
  
  // Generate mock user locations around the given region
  const mockUsers: UserLocation[] = [
    {
      id: 'user_nearby_1',
      name: 'Alex',
      profileImage: AVATAR_URLS[0],
      location: {
        latitude: region.latitude + (Math.random() * 0.01 - 0.005),
        longitude: region.longitude + (Math.random() * 0.01 - 0.005),
      },
      distance: '0.3 mi',
      isOnline: true,
      age: 28,
      flag: '🇺🇸'
    },
    {
      id: 'user_nearby_2',
      name: 'Sofia',
      profileImage: AVATAR_URLS[1],
      location: {
        latitude: region.latitude + (Math.random() * 0.01 - 0.005),
        longitude: region.longitude + (Math.random() * 0.01 - 0.005),
      },
      distance: '0.5 mi',
      isOnline: true,
      age: 25,
      flag: '🇪🇸'
    },
    {
      id: 'user_nearby_3',
      name: 'Marco',
      profileImage: AVATAR_URLS[2],
      location: {
        latitude: region.latitude + (Math.random() * 0.01 - 0.005),
        longitude: region.longitude + (Math.random() * 0.01 - 0.005),
      },
      distance: '0.8 mi',
      isOnline: false,
      age: 31,
      flag: '🇮🇹'
    }
  ];
  
  return mockUsers;
};

export const fetchNightlifeGroups = async (): Promise<NightlifeGroup[]> => {
  await simulateDelay();
  return mockNightlifeGroups;
};

export const fetchBffsYouMayLike = async (): Promise<BffProfile[]> => {
  await simulateDelay();
  return mockBffs;
};

export const fetchNearbyGroup = async (): Promise<NearbyGroup> => {
  await simulateDelay();
  return mockNearbyGroups[0];
};

export const fetchPopularGroupDetail = async (groupId: string): Promise<PopularGroupDetail> => {
  // console.log(`[Mock API] Fetching popular group detail for ID: ${groupId}`);
  await simulateDelay();

  // Find the group in either mockNightlifeGroups or mockExploreGroups based on ID structure
  const groupBase = mockNightlifeGroups.find(g => g.id === groupId) || mockExploreGroups.find(g => g.id === groupId);

  if (!groupBase) {
    // console.error(`[Mock API] Error: Group with ID ${groupId} not found in mockNightlifeGroups or mockExploreGroups.`);
    throw new Error(`Group with ID ${groupId} not found`);
  }

  // Simulate fetching more details
  const details: PopularGroupDetail = {
    // Explicitly include all required properties from PopularGroupDetail type
    id: groupBase.id,
    title: groupBase.title,
    location: groupBase.location,
    locationFlag: groupBase.locationFlag,
    // Use optional chaining for potentially missing properties
    dateRange: (groupBase as NightlifeGroup)?.dateRange || 'Default Date Range',
    attendeeCount: groupBase.attendeeCount || 50,
    description: `This is a detailed description for ${groupBase.title}. Join us for exciting events and meet great people! We often explore local hotspots and enjoy the vibrant nightlife.`,
    interests: groupId === 'nearby_1' 
      ? [
          { id: 'int_nearby_1', name: 'Nightlife', icon: '🍹' },
          { id: 'int_nearby_2', name: 'Social', icon: '👥' },
          { id: 'int_nearby_3', name: 'Exploring', icon: '🗺️' }
        ] 
      : [ 
          { id: 'int_default_1', name: 'Nightlife', icon: '🎧' },
          { id: 'int_default_2', name: 'Social', icon: '🍻' },
        ],
    organizer: {
      id: 'user_org_1',
      name: 'Alex Manager',
      avatarUrl: AVATAR_URLS[4],
      title: 'Community Lead'
    },
    venue: {
      id: `venue_${groupId}`,
      name: groupBase.location, 
      imageUrl: groupBase.imageUrl // Keep venue image consistent for component
    },
    // Assign userAvatars based on the actual type of groupBase
    userAvatars: (groupBase as NightlifeGroup).userAvatars || (groupBase as ExploreGroupCardData).attendeeAvatars || [],
    // Correctly use heroImageUrl, falling back to base imageUrl
    heroImageUrl: (groupBase as any).heroImageUrl || groupBase.imageUrl 
    // Removed direct imageUrl property
  };

  // console.log(`[Mock API] Found details for group: ${groupId}`, details);
  return details;
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  await simulateDelay();
  return mockUserProfile;
};

export const fetchJoinedGroups = async (): Promise<JoinedGroup[]> => {
  await simulateDelay();
  return mockJoinedGroups;
};

export const fetchUpcomingPlans = async (): Promise<UpcomingPlan[]> => {
  await simulateDelay();
  return mockUpcomingPlans;
};

export const fetchUserProfileDetail = async (userId: string): Promise<UserProfileDetail> => {
  // console.log(`[Mock API] Attempting to fetch profile detail for userId: ${userId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

  const profile = mockUserProfiles[userId];

  if (profile) {
    // console.log(`[Mock API] Profile found for userId: ${userId}`);
    return Promise.resolve(profile);
  } else {
    // console.error(`[Mock API] Profile NOT FOUND for userId: ${userId}`);
    // It's often better to reject with an Error object
    return Promise.reject(new Error(`Mock profile not found for user ${userId}`));
  }
};

// Added fetch function for Explore Groups
export const fetchExploreGroups = async (filter?: string): Promise<ExploreGroupCardData[]> => {
  // console.log(`[Mock API] Fetching explore groups with filter: ${filter || 'none'}`);
  await simulateDelay();
  // Basic filter simulation (can be expanded)
  if (filter && filter !== 'trending' && filter !== 'new' && filter !== 'nearby') {
    return mockExploreGroups.filter(group => group.locationFlag === filter || group.location.toLowerCase().includes(filter.toLowerCase()));
  }
  // Return slightly shuffled list for 'trending' or 'new' for variety, or full list
  return [...mockExploreGroups].sort(() => Math.random() - 0.5);
};

// --- Mock Auth Functions ---

/**
 * Simulates a login API call
 * @param email User's email
 * @param password User's password
 * @returns Promise containing token and user data
 */
export const loginUser = async (email: string, password: string): Promise<{ 
  token: string; 
  user: { 
    id: string; 
    name: string; 
    email: string;
  } 
}> => {
  // Simulate network delay (500-1500ms)
  await simulateDelay(500 + Math.random() * 1000);
  
  // console.log(`[Mock API] Attempting login for user: ${email}`);
  
  // Find user in our mock database
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Simulate authentication logic
  if (!user) {
    // console.log(`[Mock API] User not found: ${email}`);
    throw new Error('User not found. Please check your email or sign up.');
  }
  
  if (user.password !== password) {
    // console.log(`[Mock API] Invalid password for: ${email}`);
    throw new Error('Invalid password. Please try again.');
  }
  
  // Authentication successful
  // console.log(`[Mock API] Login successful for: ${email}`);
  
  // Generate a mock JWT token (in a real app, this would be a proper JWT)
  const token = `mock-jwt-${user.id}-${Date.now()}`;
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

/**
 * Simulates a user registration API call
 * @param details User registration details
 * @returns Promise containing token and user data
 */
export const signupUser = async (details: { 
  name: string; 
  email: string; 
  password: string;
}): Promise<{ 
  token: string; 
  user: { 
    id: string; 
    name: string; 
    email: string; 
  } 
}> => {
  // Simulate network delay (800-2000ms)
  await simulateDelay(800 + Math.random() * 1200);
  
  // console.log(`[Mock API] Attempting signup for: ${details.email}`);
  
  // Basic validation
  if (!details.name || !details.email || !details.password) {
    // console.log('[Mock API] Signup failed: Missing required fields');
    throw new Error('All fields are required');
  }
  
  if (details.password.length < 6) {
    // console.log('[Mock API] Signup failed: Password too short');
    throw new Error('Password must be at least 6 characters');
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => 
    u.email.toLowerCase() === details.email.toLowerCase()
  );
  
  if (existingUser) {
    // console.log(`[Mock API] Signup failed: Email already in use - ${details.email}`);
    throw new Error('Email already in use. Please log in or use a different email.');
  }
  
  // Simulate a 10% chance of random server error
  // maybeThrowError(0.1);
  
  // Create new user
  const newUser: MockUser = {
    id: `user_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    name: details.name,
    email: details.email,
    password: details.password
  };
  
  // In a real API, this would add the user to a database
  // Here we're just simulating success
  // console.log(`[Mock API] Signup successful for: ${details.email}`);
  
  // Generate a mock JWT token
  const token = `mock-jwt-${newUser.id}-${Date.now()}`;
  
  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  };
};

// --- Placeholder Exports for Missing Functions ---

// Placeholder for unimplemented feature - Conversation Details
export const fetchConversationDetails = async (chatId: string): Promise<any> => {
  // console.warn(`Mock function fetchConversationDetails called with ${chatId}, not implemented.`);
  await simulateDelay(100); // Simulate delay
  return null; 
};

// Placeholder for unimplemented feature - Conversation Messages
// export const fetchConversationMessages = async (chatId: string): Promise<any[]> => {
//   console.warn(`Mock function fetchConversationMessages called with ${chatId}, not implemented.`);
//   await simulateDelay(100);
//   return []; // Return empty array for messages
// };

// Updated mock implementation for Conversation Messages
export const fetchConversationMessages = async (chatId: string): Promise<ChatMessage[]> => {
  // console.log(`DEBUG: mockService: fetchConversationMessages called for chatId: ${chatId}`);

  // Simulate network delay
  await simulateDelay(600); // Use provided delay

  // Define mock messages matching ChatMessage structure
  const mockMessages: ChatMessage[] = [
    {
      id: 'mockmsg1',
      conversationId: chatId,
      sender: { id: 'user2', name: 'Friend', avatarUrl: 'https://i.pravatar.cc/150?img=1' }, // Added avatar
      text: 'Hey there! From mockService.',
      timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
      isRead: true,
    },
    {
      id: 'mockmsg2',
      conversationId: chatId,
      sender: { id: 'user_001', name: 'Me', avatarUrl: 'https://i.pravatar.cc/150?img=32' }, // Use current user ID and avatar
      text: 'Hi! How are you? (From mockService)',
      timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
      isRead: true,
    },
    {
      id: 'mockmsg3',
      conversationId: chatId,
      sender: { id: 'user2', name: 'Friend', avatarUrl: 'https://i.pravatar.cc/150?img=1' }, // Added avatar
      text: 'Good, thanks! Weekend plans?',
      timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
      isRead: true,
    },
  ];

  // console.log(`DEBUG: mockService: Returning ${mockMessages.length} messages for chatId: ${chatId}`);
  return mockMessages; // Return the defined mock messages
};

// Placeholder for unimplemented feature - Send Message
// export const sendMessage = async (chatId: string, message: { text: string }): Promise<any> => {
//   console.warn(`Mock function sendMessage called for chat ${chatId} with text "${message.text}", not implemented.`);
//   await simulateDelay(50);
//   // Simulate returning the sent message or confirmation
//   return { id: Date.now().toString(), chatId, ...message, timestamp: new Date().toISOString() }; 
// };

// Enhanced mock implementation for Send Message
export const sendMessage = async (chatId: string, messageText: string): Promise<ChatMessage> => {
  // console.log(`DEBUG: mockService: sendMessage called for chat ${chatId} with text: "${messageText}"`);

  // Simulate network delay
  await simulateDelay(300);

  // Construct the new ChatMessage object
  // Ensure this structure matches the definition in @/types/data
  const newMessage: ChatMessage = {
    id: `sent_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Unique ID for sent message
    conversationId: chatId,
    text: messageText,
    timestamp: new Date().toISOString(),
    sender: { 
        id: 'user_001', // Assuming 'user_001' is the current user ID used in the screen
        name: 'Me', 
        avatarUrl: 'https://i.pravatar.cc/150?img=32' // Current user avatar from screen
    },
    isRead: true, // Assume sent messages are marked as read by sender immediately
    // Add other fields required by ChatMessage, ensure defaults are sensible
    // Example: isEdited: false,
  };

  // Simulate potential failure
  // maybeThrowError(0.1); // Uncomment to test error handling

  // console.log(`DEBUG: mockService: Returning new message: ${JSON.stringify(newMessage)}`);
  return newMessage;
};

// Placeholder for unimplemented feature - Feed Posts
export const fetchFeedPosts = async (): Promise<any[]> => {
  // console.warn(`Mock function fetchFeedPosts called, not implemented.`);
  await simulateDelay(200);
  return []; // Return empty array for posts
};

// Added mock function for fetching chat list
export const fetchChatList = async (): Promise<ChatConversation[]> => {
  // console.log(`DEBUG: mockService: fetchChatList called`);

  // Simulate network delay
  await simulateDelay(400); // Simulate delay

  // Re-define mock data here to be returned by the service
  const mockConversations: ChatConversation[] = [
    { 
        id: 'chat1', 
        title: 'Alice', 
        isGroupChat: false,
        participants: [{ id: 'user2', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?img=1' }],
        lastMessage: { text: 'See you there!', timestamp: '10:05 AM', senderId: 'user2' }, 
        unreadCount: 0 
    },
    { 
        id: 'chat2', 
        title: 'Work Group', 
        isGroupChat: true,
        groupImageUrl: 'https://i.pravatar.cc/150?img=5', 
        participants: [], 
        lastMessage: { text: 'Meeting confirmed for 2 PM.', timestamp: '9:45 AM', senderId: 'user3' }, 
        unreadCount: 3 
    },
    { 
        id: 'chat3', 
        title: 'Bob', 
        isGroupChat: false,
        participants: [{ id: 'user4', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?img=7' }],
        lastMessage: { text: 'Okay, sounds good!', timestamp: 'Yesterday', senderId: 'user4' }, 
        unreadCount: 1 
    },
  ];

  // Simulate potential error
  // maybeThrowError(0.1); // Uncomment to test error state

  // console.log(`DEBUG: mockService: Returning ${mockConversations.length} conversations`);
  return mockConversations;
};

// Add the new createGroup function here

export const createGroup = async (groupData: any): Promise<{ success: boolean, groupId?: string }> => {
  await simulateDelay(800);
  // console.log('Mock Creating Group with data:', groupData);
  // maybeThrowError(0.3); // Simulate error sometimes
  if (!groupData.groupName) {
    console.error('Mock Error: Group name is required.');
    throw new Error('Group name is required.');
  }
  // Simulate success
  const newGroupId = `group-${Date.now()}`;
  return { success: true, groupId: newGroupId };
};

// --- NEW: Fetch My Friends Mock --- 
export const fetchMyFriends = async (): Promise<FriendProfile[]> => {
  // console.log('DEBUG: mockService: fetchMyFriends called, returning empty list');
  await simulateDelay(600);
  // maybeThrowError(0.1);
  return []; // Return empty array for now
}; 