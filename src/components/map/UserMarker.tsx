import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';

interface UserMarkerProps {
  profileImage: string;
  isCurrentUser?: boolean;
  isOnline?: boolean;
  size?: number;
  blurAmount?: number;
}

/**
 * UserMarker component - Displays a user marker on the map
 * 
 * @param profileImage - URL of the user's profile image
 * @param isCurrentUser - Whether this marker represents the current user
 * @param isOnline - Whether the user is online (display status indicator)
 * @param size - The size of the marker (default: 44 for other users, 48 for current user)
 * @param blurAmount - The amount of blur to apply (only for non-current users)
 */
export const UserMarker = ({ 
  profileImage, 
  isCurrentUser = false, 
  isOnline = false,
  size,
  blurAmount = 30
}: UserMarkerProps) => {
  const markerSize = size || (isCurrentUser ? 48 : 44);
  
  // Current user gets a distinct marker style
  if (isCurrentUser) {
    return (
      <View style={[styles.currentUserMarker, { width: markerSize, height: markerSize }]}>
        <View style={styles.currentUserDot} />
        <View style={[styles.currentUserPulse, styles.pulse1]} />
        <View style={[styles.currentUserPulse, styles.pulse2]} />
      </View>
    );
  }
  
  // Other users get blurred profile image markers
  return (
    <View style={[styles.userMarker, { width: markerSize, height: markerSize }]}>
      <BlurView intensity={blurAmount} tint="dark" style={styles.blurContainer}>
        <Image 
          source={{ uri: profileImage }} 
          style={styles.userMarkerImage} 
          defaultSource={require('../../../assets/images/default-avatar.png')}
        />
      </BlurView>
      {/* Online indicator */}
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  userMarker: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#18181b',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    overflow: 'hidden',
  },
  userMarkerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#18181b',
  },
  currentUserMarker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentUserDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#a970ff',
    borderWidth: 2,
    borderColor: 'white',
  },
  currentUserPulse: {
    position: 'absolute',
    backgroundColor: 'rgba(169, 112, 255, 0.3)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(169, 112, 255, 0.5)',
  },
  pulse1: {
    width: 36,
    height: 36,
  },
  pulse2: {
    width: 48,
    height: 48,
  },
}); 