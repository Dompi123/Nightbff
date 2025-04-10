import { CardData, Interest, Plan, UserLocation, MapRegion, NightlifeGroup, BffProfile, NearbyGroup, PopularGroupDetail } from '@/types/data'; // Import types from central file and new types

// Simulate network delay
const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

// Simulate occasional errors
const maybeThrowError = (probability: number = 0.1) => {
  if (Math.random() < probability) {
    throw new Error('Simulated network error!');
  }
};

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

// --- Mock API Functions ---

export const fetchTrendingPlans = async (): Promise<CardData[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockTrendingPlansData;
};

export const fetchHotspots = async (): Promise<CardData[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockHotspotsData;
};

export const fetchInterests = async (): Promise<Interest[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockInterestsData;
};

export const fetchExplorePlans = async (): Promise<Plan[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockExplorePlansData;
};

export const fetchPlanDetails = async (planId: string): Promise<Plan | null> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  
  const plan = mockExplorePlansData.find(p => p.id === planId);
  return plan || null;
};

export const fetchNearbyUsers = async (region: MapRegion): Promise<UserLocation[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  
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
  maybeThrowError(0.05); // 5% chance of error
  return mockNightlifeGroups;
};

export const fetchBffsYouMayLike = async (): Promise<BffProfile[]> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockBffs;
};

export const fetchNearbyGroup = async (): Promise<NearbyGroup> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error
  return mockNearbyGroups[0];
};

export const fetchPopularGroupDetail = async (groupId: string): Promise<PopularGroupDetail> => {
  await simulateDelay();
  maybeThrowError(0.05); // 5% chance of error

  const groupDetail = mockPopularGroupDetails[groupId];
  if (!groupDetail) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  return groupDetail;
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
  
  console.log(`[Mock API] Attempting login for user: ${email}`);
  
  // Find user in our mock database
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Simulate authentication logic
  if (!user) {
    console.log(`[Mock API] User not found: ${email}`);
    throw new Error('User not found. Please check your email or sign up.');
  }
  
  if (user.password !== password) {
    console.log(`[Mock API] Invalid password for: ${email}`);
    throw new Error('Invalid password. Please try again.');
  }
  
  // Authentication successful
  console.log(`[Mock API] Login successful for: ${email}`);
  
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
  
  console.log(`[Mock API] Attempting signup for: ${details.email}`);
  
  // Basic validation
  if (!details.name || !details.email || !details.password) {
    console.log('[Mock API] Signup failed: Missing required fields');
    throw new Error('All fields are required');
  }
  
  if (details.password.length < 6) {
    console.log('[Mock API] Signup failed: Password too short');
    throw new Error('Password must be at least 6 characters');
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => 
    u.email.toLowerCase() === details.email.toLowerCase()
  );
  
  if (existingUser) {
    console.log(`[Mock API] Signup failed: Email already in use - ${details.email}`);
    throw new Error('Email already in use. Please log in or use a different email.');
  }
  
  // Simulate a 10% chance of random server error
  maybeThrowError(0.1);
  
  // Create new user
  const newUser: MockUser = {
    id: `user_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    name: details.name,
    email: details.email,
    password: details.password
  };
  
  // In a real API, this would add the user to a database
  // Here we're just simulating success
  console.log(`[Mock API] Signup successful for: ${details.email}`);
  
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