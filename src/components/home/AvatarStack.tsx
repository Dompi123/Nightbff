import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarStackProps {
  avatars: string[];
  count: number;
  max?: number;
  size?: number;
  overlap?: number;
  countBgColor?: string;
  countTextColor?: string;
}

export const AvatarStack = ({
  avatars,
  count,
  max = 3,
  size = 32,
  overlap = 8,
  countBgColor = '#a970ff',
  countTextColor = '#fff',
}: AvatarStackProps) => {
  // Limit avatars shown to max
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = count > max ? count - max : 0;
  
  return (
    <View style={styles.container}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={`avatar-${index}`}
          style={[
            styles.avatarContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: index === 0 ? 0 : -overlap,
              zIndex: max - index, // Higher z-index for first avatars
            },
          ]}
        >
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        </View>
      ))}
      
      {remainingCount > 0 && (
        <View
          style={[
            styles.countContainer,
            {
              width: size + 8,
              height: size,
              borderRadius: size / 2,
              backgroundColor: countBgColor,
              marginLeft: -overlap,
            },
          ]}
        >
          <Text style={[styles.countText, { color: countTextColor }]}>
            {remainingCount}+
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#27272a',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  countContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#27272a',
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 