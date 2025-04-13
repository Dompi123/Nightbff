import type { NavigatorScreenParams } from '@react-navigation/native';

// Define interfaces for your data types if they aren't already defined elsewhere
// Example (Refine based on actual data needs):
export interface Plan {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  // ... other plan details
}

export interface Hotspot {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  // ... other hotspot details
}

export interface Interest {
  id: string;
  title: string;
  imageUrl: string;
}

// ============================
// Navigation Parameter Lists
// ============================

// Screens within the Auth stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Screens within the Main tab navigator
// Note: Adjust screen names if they differ in your (tabs) layout
export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Create: undefined;
  Chat: undefined;
  Map: undefined;
};

// Screens accessible from anywhere, potentially including nested navigators
// We nest the MainTabParamList here
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>; // Auth flow screens
  Main: NavigatorScreenParams<MainTabParamList>;  // Main app tabs
  '(tabs)': undefined; // Entry point for the main tabs

  // Existing Detail/Modal Screens
  ExplorePlans: undefined;
  PlanDetail: { planId: string };
  GroupChat: { chatId: string }; // Was Conversation, ensure consistency or update
  conversation: { chatId: string }; // Explicitly add conversation route if separate
  Paywall: undefined;
  PopularGroupDetail: { groupId: string };

  // --- Phase 5a Navigation Targets ---
  locationDetail: { locationName: string; };
  exploreGroups: undefined;
  bffProfileDetail: { userId: string; };
  // nearbyGroupsList: undefined; // Using exploreGroups route for now
  createGroup: undefined; // Target for Create Group button
  planNightOutPlaceholder: undefined;
  // Add other potential placeholders if needed later e.g. settings
  settingsPlaceholder: undefined;
  editProfilePlaceholder: undefined;
  // --- End Phase 5a Navigation Targets ---

  // Auth Screens (if needing direct navigation)
  Login: undefined;
  Signup: undefined;
};

// Type checking for React Navigation
// https://reactnavigation.org/docs/typescript/
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 