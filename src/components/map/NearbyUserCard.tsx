import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { UserLocation } from '../../types/data';
import { ThemedText } from '../../../components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

interface NearbyUserCardProps {
  user: UserLocation;
  onPress?: () => void;
}

export const NearbyUserCard = ({ user, onPress }: NearbyUserCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: user.profileImage }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <ThemedText style={styles.name}>{user.name}</ThemedText>
            <ThemedText style={styles.distance}>{user.distance}</ThemedText>
          </View>
        </LinearGradient>
        
        {user.flag && (
          <View style={styles.flagContainer}>
            <ThemedText style={styles.flag}>{user.flag}</ThemedText>
          </View>
        )}
        
        {user.isOnline && <View style={styles.onlineIndicator} />}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: '#27272a',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    height: '50%',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  contentContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  distance: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 2,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  flagContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  flag: {
    fontSize: 14,
  },
}); 