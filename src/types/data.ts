// Centralized data type definitions

export interface CardData {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    iconType: 'globe' | 'person';
    count: number;
    location: string;
    emoji?: string;
    userAvatars?: string[]; // Array of avatar URLs for the avatar stack
    userCount?: number; // Total number of users (displayed in avatar stack)
}

export interface NightlifeGroup {
    id: string;
    title: string;
    location: string;
    imageUrl: string;
    locationFlag: string; // Emoji flag or icon code
    dateRange: string; // Formatted date range (e.g., "Apr 1 - Apr 10")
    userAvatars: string[]; // Array of avatar URLs for the avatar stack
    attendeeCount: number; // Number of users going
}

export interface Interest {
    id: string;
    title: string;
    imageUrl: string;
}

export interface Plan {
    id: string;
    title: string;
    location: string;
    imageUrl: string;
    description?: string; // Optional description
    host?: string; // Optional host info
    // ... other potential plan details
}

/**
 * User location data for map markers and nearby users
 */
export interface UserLocation {
    id: string;
    name: string;
    profileImage: string;
    location: {
        latitude: number;
        longitude: number;
    };
    distance: string; // Distance from current user (e.g., "2 mi")
    isOnline: boolean; // User online status
    country?: string; // Optional country identifier (for flag display)
    age?: number; // User age
    flag?: string; // Country flag emoji
}

// Region type for map view
export interface MapRegion {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

// New interface for the "BFFs you may like" section 
export interface BffProfile {
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    isOnline: boolean;
    countryFlag?: string; // Country flag emoji
}

// New interface for the "Nearby Groups" section
export interface NearbyGroup {
    id: string;
    imageUrl: string;
    flag: string;      // Country flag emoji
    location: string;  // City/Country name
    dateRange: string; // Formatted date range (e.g., "Aug 5 - Aug 15")
    title: string;     // Group title (e.g., "Halifax")
    userAvatars: string[]; // Array of avatar URLs for the avatar stack
    memberCount: number;   // Number shown as "X+ travelers"
}

/**
 * Detailed group information for the PopularGroupDetail screen
 */
export interface PopularGroupDetail {
    id: string;
    title: string;
    location: string;
    locationFlag: string;
    dateRange: string;
    heroImageUrl: string;
    description: string;
    userAvatars: string[];
    attendeeCount: number;
    interests: {
        id: string;
        name: string;
        icon: string;
    }[];
    venue: {
        id: string;
        name: string;
        imageUrl: string;
    };
    organizer: {
        id: string;
        name: string;
        avatarUrl: string;
        title: string;
    };
}

export interface UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    stats: {
        groups: number;
        plans: number;
        venuesVisited: number;
    };
}

export interface UpcomingPlan {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
    location: string;
}

export interface JoinedGroup {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
    dateRange: string;
    isJoined: boolean;
}

export interface ChatParticipant {
    id: string;
    name: string;
    avatarUrl?: string;
    isOnline?: boolean;
}

export interface ChatConversation {
    id: string;
    title: string;
    participants: ChatParticipant[];
    lastMessage?: {
        text: string;
        timestamp: string;
        senderId: string;
    };
    unreadCount?: number;
    isGroupChat: boolean;
    groupImageUrl?: string;
}

export interface QuotedMessage {
    id: string;
    senderName: string;
    text: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    text: string;
    timestamp: string; // ISO string format
    sender: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    quotedMessage?: QuotedMessage;
    isRead?: boolean;
    mediaUrl?: string; // For image/media messages
}

// You can add other shared data types here as the project grows
// export interface User { ... }
// export interface Venue { ... }

// Type checking for React Navigation
// https://reactnavigation.org/docs/typescript/
declare global {
  namespace ReactNavigation {
  }
}

// --- User Profile Detail --- ADDED for Phase 5
export interface UserProfileDetail {
  id: string;
  name: string;
  age: number;
  location: string; // e.g., "🇺🇸 UNITED STATES"
  countryFlag: string; // Just the emoji
  isVerified: boolean;
  profileImageUrls: string[]; // Can have multiple for carousel/swipe
  aboutMe: string;
  badges: string[]; // e.g., ["Pro", "Verified"]
  socials: { type: 'instagram' | 'tiktok'; isSet: boolean; link?: string }[];
  interests: string[]; // e.g., ["Adventure", "Nature", "Road Trip"]
  languages: string[]; // e.g., ["English", "Spanish"]
  // Add other fields as needed based on future requirements
}

// Feed Post Type (Example - Add if needed for Feed screen)
export interface FeedPost {
  id: string;
  user: { id: string; name: string; avatarUrl: string };
  timestamp: string; // ISO string
  text?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

// Added Interface for Explore Group Card Data
export interface ExploreGroupCardData {
  id: string;
  title: string;
  imageUrl: string;
  startDate: string; // Or Date object
  endDate: string; // Or Date object
  location: string;
  locationFlag: string;
  attendeeAvatars: string[];
  attendeeCount: number;
}

// --- NEW: Friend Profile Type ---
export interface FriendProfile {
  id: string;
  name: string;
  avatarUrl: string;
}
