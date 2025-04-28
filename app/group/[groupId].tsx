import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePopularGroupDetail } from '@/hooks/api/usePopularGroupDetail';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@/theme/spacing';
import { palette } from '@/theme/colors';

const PopularGroupDetailScreen = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const insets = useSafeAreaInsets();
  
  // Fetch group details using the custom hook
  const { data: group, isLoading, error } = usePopularGroupDetail(groupId);
  
  // Handle back navigation
  const handleBack = () => {
    router.back();
  };
  
  // Handle share (placeholder)
  const handleShare = () => {
    // Implement sharing logic (e.g., using Share API)
    // console.log('Share functionality placeholder');
  };
  
  // Handle join chat
  const handleJoinChat = () => {
    // Implement logic to join the chat or navigate to it
    // console.log('Join chat functionality placeholder');
    router.push(`/conversation/${groupId}`); // Assume chat ID is group ID for mock
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar style="light" />
      {/* Use Stack.Screen to configure the header dynamically */}
      <Stack.Screen 
        options={{
          title: group?.title || 'Group Details',
          // Add other header options if needed, like headerRight for a share button
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: group.heroImageUrl }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentWrapper}>
          <View style={styles.headerSection}>
            {/* Title is now in the header, remove from here? Optional */}
            {/* <ThemedText style={styles.title}>{group.title}</ThemedText> */}
            
            <View style={styles.locationRow}>
              <Text style={styles.flag}>{group.locationFlag}</Text>
              <ThemedText style={styles.location}>{group.location}</ThemedText>
            </View>
            
            <ThemedText style={styles.dateRange}>{group.dateRange}</ThemedText>
            
            <View style={styles.avatarSection}>
              <View style={styles.avatarStack}>
                {/* Ensure group.userAvatars exists before mapping */}
                {group.userAvatars?.slice(0, 3).map((avatar, index) => (
                  <Image 
                    key={`avatar-${index}`}
                    source={{ uri: avatar }} 
                    style={[styles.avatarImage, { marginLeft: index > 0 ? -15 : 0 }]} 
                  />
                ))}
              </View>
              <ThemedText style={styles.attendeeCount}>
                {group.attendeeCount} travelers
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.joinButton} 
            onPress={handleJoinChat}
            accessibilityLabel="Join Chat"
            accessibilityRole="button"
          >
            <ThemedText style={styles.joinButtonText}>Join Chat</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.sectionsContainer}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>About Trip</ThemedText>
              <View style={styles.sectionContentContainer}>
                <ThemedText style={styles.sectionContent}>
                  {group.description}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
              <View style={styles.sectionContentContainer}>
                <View style={styles.interestsContainer}>
                  {/* Ensure group.interests exists and has items before mapping */}
                  {group.interests?.map(interest => (
                    <View key={interest.id} style={styles.interestChip}>
                      <Text style={styles.interestIcon}>{interest.icon}</Text>
                      <ThemedText style={styles.interestName}>{interest.name}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Venues</ThemedText>
              <View style={styles.sectionContentContainer}>
                {/* Ensure group.venue exists before rendering */}
                {group.venue && (
                  <TouchableOpacity 
                    style={styles.venueCard}
                    accessibilityLabel={`View venue: ${group.venue?.name}`}
                    accessibilityRole="button"
                  >
                    <Image source={{ uri: group.venue?.imageUrl }} style={styles.venueImage} />
                    <ThemedText style={styles.venueName}>{group.venue?.name}</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Managed By</ThemedText>
              <View style={styles.sectionContentContainer}>
                 {/* Ensure group.organizer exists before rendering */}
                {group.organizer && (
                  <TouchableOpacity 
                    style={styles.organizerSection}
                    accessibilityLabel={`View organizer profile: ${group.organizer.name}, ${group.organizer.title}`}
                    accessibilityRole="button"
                  >
                    <Image source={{ uri: group.organizer.avatarUrl }} style={styles.organizerAvatar} />
                    <View style={styles.organizerInfo}>
                      <ThemedText style={styles.organizerName}>{group.organizer.name}</ThemedText>
                      <ThemedText style={styles.organizerTitle}>{group.organizer.title}</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#a970ff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.reportContainer}
            accessibilityLabel="Report Group"
            accessibilityRole="button"
          >
            <ThemedText style={styles.reportText}>Report Group</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Removed custom overlay buttons (Back and Share) */}
      {/* Stack navigator header will handle these */}

    </SafeAreaView>
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
    // Style might still be used for the error screen back button
    // Keep this style definition if it's used elsewhere, otherwise remove
    // Example: If error screen uses it, keep it:
     padding: spacing.md, // Example padding
     borderRadius: 8, // Example border radius
     backgroundColor: palette.primary, // Example background
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 50,
  },
  imageContainer: {
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  overlayButton: {
    // position: 'absolute',
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // justifyContent: 'center',
    // alignItems: 'center',
    // zIndex: 10, 
  },
  optionsButton: {
    // right: spacing.md,
  },
  contentWrapper: {
  },
  headerSection: {
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  flag: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  location: {
    fontSize: 16,
    color: '#ccc',
  },
  dateRange: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: spacing.md,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#151718',
  },
  attendeeCount: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: '#ccc',
  },
  joinButton: {
    backgroundColor: '#a970ff',
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionsContainer: {
    paddingHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.md,
  },
  sectionContentContainer: {
  },
  sectionContent: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  interestIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  interestName: {
    fontSize: 14,
    color: '#eee',
  },
  venueCard: {
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  venueName: {
    padding: spacing.sm,
    fontSize: 14,
    color: 'white',
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: spacing.md,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  organizerTitle: {
    fontSize: 13,
    color: '#aaa',
  },
  reportContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: spacing.md,
  },
  reportText: {
    color: '#FF6347',
    fontSize: 15,
  },
});

export default PopularGroupDetailScreen; 