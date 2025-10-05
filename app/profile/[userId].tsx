// View Profile screen with conditional action buttons and parallax layout
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { useUserProfileDetail } from '@/hooks/api/useUserProfileDetail';
import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.65; // Take up 65% of screen height

// Image Pagination Dots Component
const PaginationDots = ({ activeIndex, total }: { activeIndex: number; total: number }) => (
  <View style={styles.paginationContainer}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.paginationDot,
          index === activeIndex && styles.paginationDotActive,
        ]}
      />
    ))}
  </View>
);

// Badge Component
const Badge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Ionicons 
      name={label === 'Pro' ? 'star' : 'shield-checkmark'} 
      size={16} 
      color={palette.primary} 
      style={{ marginRight: spacing.xs }} 
    />
    <ThemedText style={styles.badgeText}>{label}</ThemedText>
  </View>
);

// Social Button Component
const SocialButton = ({ 
  type, 
  isSet, 
  username 
}: { 
  type: 'instagram' | 'tiktok'; 
  isSet: boolean;
  username?: string;
}) => (
  <TouchableOpacity style={styles.socialButton} disabled={!isSet}>
    <Ionicons 
      name={type === 'instagram' ? 'logo-instagram' : 'logo-tiktok'} 
      size={20} 
      color={isSet ? palette.text : palette.textSecondary} 
      style={{ marginRight: spacing.sm }} 
    />
    <ThemedText style={[styles.socialText, !isSet && styles.socialTextDisabled]}>
      {isSet ? (username || (type === 'instagram' ? 'Instagram' : 'TikTok')) : 'Not Set'}
    </ThemedText>
  </TouchableOpacity>
);

// Interest Chip Component
const InterestChip = ({ interest, icon }: { interest: string; icon?: string }) => (
  <View style={styles.interestChip}>
    {icon && <Text style={styles.interestIcon}>{icon}</Text>}
    <ThemedText style={styles.interestText}>{interest}</ThemedText>
  </View>
);

// Trip Card Component (for upcoming trips section)
const TripCard = ({ 
  destination, 
  dateRange, 
  flag 
}: { 
  destination: string; 
  dateRange: string; 
  flag: string;
}) => (
  <View style={styles.tripCard}>
    <View style={styles.tripFlagContainer}>
      <Text style={styles.tripFlag}>{flag}</Text>
    </View>
    <View style={styles.tripInfo}>
      <ThemedText style={styles.tripDestination}>{destination}</ThemedText>
      <ThemedText style={styles.tripDate}>{dateRange}</ThemedText>
    </View>
  </View>
);

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, error } = useUserProfileDetail(userId || '');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Determine if the current user is viewing their own profile
  const isOwnProfile = currentUser?.id === userId;

  // Debug logging
  console.log('[ProfileScreen] Current user ID:', currentUser?.id);
  console.log('[ProfileScreen] Profile user ID:', userId);
  console.log('[ProfileScreen] Is own profile:', isOwnProfile);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>Error loading profile.</ThemedText>
        <ThemedText>{error?.message || 'Profile data not found.'}</ThemedText>
      </View>
    );
  }

  const totalImages = profile.profileImageUrls.length;

  return (
    <View style={styles.container}>
      {/* Fixed Background Image Section */}
      <View style={styles.imageBackgroundContainer}>
        {totalImages > 0 && (
          <Image 
            source={{ uri: profile.profileImageUrls[currentImageIndex] }} 
            style={styles.backgroundImage} 
            resizeMode='cover'
          />
        )}
        
        {/* Dark gradient overlay at the bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />

        {/* User Info Overlay on Image */}
        <View style={styles.userInfoOverlay}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.nameText}>
              {profile.name}, {profile.age}
            </ThemedText>
            {profile.isVerified && (
              <Ionicons 
                name="checkmark-circle" 
                size={28} 
                color={palette.primary} 
                style={{ marginLeft: spacing.sm }} 
              />
            )}
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.flag}>{profile.countryFlag}</Text>
            <ThemedText style={styles.locationText}>{profile.location}</ThemedText>
          </View>

          {/* Pagination Dots (only show if multiple images) */}
          {totalImages > 1 && (
            <PaginationDots activeIndex={currentImageIndex} total={totalImages} />
          )}
        </View>

      </View>

      {/* Scrollable Content Section */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: IMAGE_HEIGHT - 40 } // Start the content to overlap with the image
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* White/Dark Content Card */}
        <View style={styles.contentCard}>
          
          {/* About Me Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>About Me</ThemedText>
            <ThemedText style={styles.aboutText}>{profile.aboutMe}</ThemedText>
          </View>

          {/* Badges Section */}
          {profile.badges.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Badges</ThemedText>
              <View style={styles.badgesContainer}>
                {profile.badges.map((badge, index) => (
                  <Badge key={index} label={badge} />
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons - Below About Me and Badges */}
          <View style={styles.actionButtonsContainer}>
            {isOwnProfile ? (
              <>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => router.push('/editProfile')}
                  accessibilityLabel="Edit profile"
                  accessibilityRole="button"
                >
                  <Ionicons name="pencil" size={20} color={palette.text} />
                  <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => router.push('/settings')}
                  accessibilityLabel="Settings"
                  accessibilityRole="button"
                >
                  <Ionicons name="settings-outline" size={20} color={palette.text} />
                  <ThemedText style={styles.actionButtonText}>Settings</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => console.log('Add Friend pressed')}
                  accessibilityLabel="Add friend"
                  accessibilityRole="button"
                >
                  <Ionicons name="person-add-outline" size={20} color={palette.text} />
                  <ThemedText style={styles.actionButtonText}>Add Friend</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => console.log('Message pressed')}
                  accessibilityLabel="Send message"
                  accessibilityRole="button"
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={palette.text} />
                  <ThemedText style={styles.actionButtonText}>Message</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Socials Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Socials</ThemedText>
            <View style={styles.socialsContainer}>
              {profile.socials.map((social, index) => (
                <SocialButton 
                  key={index} 
                  type={social.type} 
                  isSet={social.isSet}
                  username={social.isSet ? (social.type === 'instagram' ? 'monicatyo' : undefined) : undefined}
                />
              ))}
            </View>
          </View>

          {/* Interests Section */}
          {profile.interests.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <InterestChip 
                    key={index} 
                    interest={interest}
                    icon={getInterestIcon(interest)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Languages Section */}
          {profile.languages.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Languages</ThemedText>
              <View style={styles.interestsContainer}>
                {profile.languages.map((language, index) => (
                  <InterestChip key={index} interest={language} icon="aA" />
                ))}
              </View>
            </View>
          )}

          {/* Upcoming Trips Section (Mock data for design purposes) */}
          {isOwnProfile && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Upcoming Trips</ThemedText>
              </View>
              <View style={styles.tripsContainer}>
                <TripCard 
                  destination="Tokyo" 
                  dateRange="Feb 8 - May 31, 2026" 
                  flag="🇯🇵"
                />
                <TripCard 
                  destination="Tokyo" 
                  dateRange="Feb 8 - May 31, 2026" 
                  flag="🇯🇵"
                />
                <TripCard 
                  destination="Cebu" 
                  dateRange="Apr 10 - Apr 19, 2026" 
                  flag="🇵🇭"
                />
              </View>
            </View>
          )}

          {/* Travel Plans Section (if viewing own profile) */}
          {isOwnProfile && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Travel Plans</ThemedText>
                <TouchableOpacity onPress={() => console.log('See all plans')}>
                  <ThemedText style={styles.seeAllText}>See All</ThemedText>
                </TouchableOpacity>
              </View>
              <Text style={styles.placeholderText}>Your travel plans will appear here</Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Floating Back Button - Positioned last to be on top */}
      <TouchableOpacity 
        style={[styles.headerButton, { top: insets.top + spacing.sm, left: spacing.md }]}
        onPress={() => {
          console.log('[ProfileScreen] Back button pressed');
          navigation.goBack();
        }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// Helper function to map interests to icons
function getInterestIcon(interest: string): string {
  const iconMap: Record<string, string> = {
    'Nightlife': '🌃',
    'Dancing': '💃',
    'Music': '🎵',
    'Travel': '✈️',
    'Food & Drinks': '🍹',
    'Adventure': '🏔️',
    'Nature': '🌲',
    'Road Trip': '🚗',
    'Hiking': '🥾',
    'Backpacking': '🎒',
  };
  return iconMap[interest] || '🌟';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
    padding: spacing.lg,
  },
  
  // Fixed Image Background
  imageBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%', // Increased from 40% to 50% for better text visibility
  },
  
  // User Info Overlay on Image
  userInfoOverlay: {
    position: 'absolute',
    bottom: spacing.xl + spacing.lg, // 32 + 24 = 56px from bottom (very close to scroll card)
    left: spacing.lg,
    right: spacing.lg,
    paddingTop: spacing.md, // Add padding to container to prevent text clipping
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    overflow: 'visible', // Ensure text is not clipped
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36, // Explicit line height to prevent clipping
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false, // Android: Remove extra padding
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  flag: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  // Pagination Dots
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  // Header Button
  headerButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10, // For Android
  },
  
  // Scrollable Content
  scrollContent: {
    flex: 1,
    zIndex: 2,
  },
  scrollContentContainer: {
    paddingBottom: spacing.xxl * 2,
  },
  contentCard: {
    backgroundColor: palette.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.sm,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
  },
  
  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text,
    marginBottom: spacing.md,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: palette.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    color: palette.primary,
    fontWeight: '600',
  },
  
  // Badges
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.text,
  },
  
  // Socials
  socialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.text,
  },
  socialTextDisabled: {
    color: palette.textSecondary,
  },
  
  // Interests & Languages
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.xs,
  },
  interestIcon: {
    fontSize: 14,
  },
  interestText: {
    fontSize: 14,
    color: palette.text,
  },
  
  // Trips
  tripsContainer: {
    gap: spacing.md,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  tripFlagContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: palette.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tripFlag: {
    fontSize: 32,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.xs,
  },
  tripDate: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  
  // Placeholder
  placeholderText: {
    fontSize: 14,
    color: palette.textSecondary,
    fontStyle: 'italic',
  },
});
