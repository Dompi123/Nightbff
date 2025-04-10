import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePopularGroupDetail } from '@/hooks/api/usePopularGroupDetail';
import { StatusBar } from 'expo-status-bar';

const PopularGroupDetailScreen = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  
  // Fetch group details using the custom hook
  const { data: group, isLoading, error } = usePopularGroupDetail(groupId);
  
  // Handle back navigation
  const handleBack = () => {
    router.back();
  };
  
  // Handle share (placeholder)
  const handleShare = () => {
    console.log('Share functionality placeholder');
  };
  
  // Handle join chat
  const handleJoinChat = () => {
    console.log('Join chat functionality placeholder');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a970ff" />
        <ThemedText style={styles.loadingText}>Loading group details...</ThemedText>
      </SafeAreaView>
    );
  }
  
  // Error state
  if (error || !group) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          {error ? `Error: ${error.message}` : 'Group not found'}
        </ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Navigation Controls */}
      <View style={styles.navControls}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Hero Image */}
      <Image 
        source={{ uri: group.heroImageUrl }} 
        style={styles.heroImage} 
        resizeMode="cover"
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Trip Title and Location */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>{group.title}</ThemedText>
          
          <View style={styles.locationRow}>
            <Text style={styles.flag}>{group.locationFlag}</Text>
            <ThemedText style={styles.location}>{group.location}</ThemedText>
          </View>
          
          <ThemedText style={styles.dateRange}>{group.dateRange}</ThemedText>
          
          {/* Avatar Stack */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarStack}>
              {group.userAvatars.slice(0, 3).map((avatar, index) => (
                <Image 
                  key={`avatar-${index}`}
                  source={{ uri: avatar }} 
                  style={[
                    styles.avatarImage,
                    { marginLeft: index > 0 ? -15 : 0 }
                  ]} 
                />
              ))}
            </View>
            <ThemedText style={styles.attendeeCount}>
              {group.attendeeCount} travelers
            </ThemedText>
          </View>
        </View>
        
        {/* Join Chat Button */}
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinChat}>
          <ThemedText style={styles.joinButtonText}>Join Chat</ThemedText>
        </TouchableOpacity>
        
        {/* Sections - Always Expanded */}
        <View style={styles.sectionsContainer}>
          {/* About Trip */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>About Trip</ThemedText>
            <View style={styles.sectionContentContainer}>
              <ThemedText style={styles.sectionContent}>
                {group.description}
              </ThemedText>
            </View>
          </View>
          
          {/* Interests */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
            <View style={styles.sectionContentContainer}>
              <View style={styles.interestsContainer}>
                {group.interests.map(interest => (
                  <View key={interest.id} style={styles.interestChip}>
                    <Text style={styles.interestIcon}>{interest.icon}</Text>
                    <ThemedText style={styles.interestName}>{interest.name}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          {/* Venues */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Venues</ThemedText>
            <View style={styles.sectionContentContainer}>
              <TouchableOpacity style={styles.venueCard}>
                <Image 
                  source={{ uri: group.venue.imageUrl }} 
                  style={styles.venueImage} 
                />
                <ThemedText style={styles.venueName}>{group.venue.name}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Managed By */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Managed By</ThemedText>
            <View style={styles.sectionContentContainer}>
              <TouchableOpacity style={styles.organizerSection}>
                <Image 
                  source={{ uri: group.organizer.avatarUrl }} 
                  style={styles.organizerAvatar} 
                />
                <View style={styles.organizerInfo}>
                  <ThemedText style={styles.organizerName}>{group.organizer.name}</ThemedText>
                  <ThemedText style={styles.organizerTitle}>{group.organizer.title}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#a970ff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Report Group */}
        <TouchableOpacity style={styles.reportContainer}>
          <ThemedText style={styles.reportText}>Report Group</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#a970ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flag: {
    fontSize: 18,
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    color: '#ccc',
  },
  dateRange: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#151718',
  },
  attendeeCount: {
    fontSize: 14,
    color: '#ccc',
  },
  joinButton: {
    backgroundColor: '#a970ff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ffffff',
  },
  sectionContentContainer: {
    padding: 12,
    borderRadius: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#bbb',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(169, 112, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  interestName: {
    fontSize: 14,
    color: '#a970ff',
  },
  venueCard: {
    marginVertical: 8,
  },
  venueImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  organizerTitle: {
    fontSize: 14,
    color: '#999',
  },
  reportContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 20,
  },
  reportText: {
    fontSize: 14,
    color: '#888',
  },
});

export default PopularGroupDetailScreen; 