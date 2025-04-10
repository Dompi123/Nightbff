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
  ExplorePlans: undefined;
  PlanDetail: { planId: string };
  GroupChat: { chatId: string }; // Example: Pass relevant ID
  HotspotList: undefined;
  InterestList: undefined;
  GenericDetail: { itemId: string };
  Paywall: undefined; // Paywall screen that can be accessed from anywhere
  PopularGroupDetail: { groupId: string }; // Add the new screen with required parameter
  // Add other modal or top-level screens here
};

// Type checking for React Navigation
// https://reactnavigation.org/docs/typescript/
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 