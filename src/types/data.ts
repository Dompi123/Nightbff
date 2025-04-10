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

// You can add other shared data types here as the project grows
// export interface User { ... }
// export interface Venue { ... } 