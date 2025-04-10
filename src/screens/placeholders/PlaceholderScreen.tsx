import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface PlaceholderScreenProps {
  screenName: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ screenName }) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Placeholder: {screenName}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Generate placeholder components
export const LoginScreen = () => <PlaceholderScreen screenName="Login" />;
export const SignupScreen = () => <PlaceholderScreen screenName="Signup" />;
export const DiscoverMapScreen = () => <PlaceholderScreen screenName="Discover/Map" />;
export const CreateScreen = () => <PlaceholderScreen screenName="Create (+)" />;
export const ProfileScreen = () => <PlaceholderScreen screenName="Profile" />;
export const ExplorePlansScreen = () => <PlaceholderScreen screenName="Explore Plans" />;
export const PlanDetailScreen = () => <PlaceholderScreen screenName="Plan Detail" />;
export const GroupChatScreen = () => <PlaceholderScreen screenName="Group Chat" />;
export const HotspotListScreen = () => <PlaceholderScreen screenName="Hotspot List" />;
export const InterestListScreen = () => <PlaceholderScreen screenName="Interest List" />;
export const GenericDetailScreen = () => <PlaceholderScreen screenName="Generic Detail" />;

export default PlaceholderScreen; // Default export if needed 