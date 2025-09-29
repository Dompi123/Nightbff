import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useJoinedGroups } from '@/hooks/api/useJoinedGroups';
import { useUpcomingPlans } from '@/hooks/api/useUpcomingPlans';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useMyFriends } from '@/hooks/api/useMyFriends';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: profileError } = useUserProfile();
  const { data: joinedGroups } = useJoinedGroups();
  const { data: upcomingPlans, isLoading: isLoadingPlans, isError: isErrorPlans, error: plansError } = useUpcomingPlans();
  const { data: friends, isLoading: isLoadingFriends, error: friendsError } = useMyFriends();

  const handleViewProfile = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    } else {
      console.error("No user ID found to view profile.");
      // Optionally show an alert to the user
    }
  };

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (isErrorProfile) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ErrorView error={profileError} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: profile?.avatarUrl }} 
              style={styles.avatar} 
              accessibilityLabel={`${profile?.name}'s profile picture`}
            />
            <ThemedText style={styles.name}>{profile?.name}</ThemedText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {
                console.log('🔔 Notification icon pressed - navigating to /notifications');
                router.push('/notifications');
              }}
              accessibilityLabel="View notifications"
              accessibilityRole="button"
            >
              <Ionicons name="notifications-outline" size={24} color={palette.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/settings')}
              accessibilityLabel="View settings"
              accessibilityRole="button"
            >
              <Ionicons name="settings-outline" size={24} color={palette.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{profile?.stats.groups}</ThemedText>
            <ThemedText style={styles.statLabel}>Groups</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{profile?.stats.plans}</ThemedText>
            <ThemedText style={styles.statLabel}>Plans</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{profile?.stats.venuesVisited}</ThemedText>
            <ThemedText style={styles.statLabel}>Visited</ThemedText>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/editProfile')}
            accessibilityLabel="Edit user profile"
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewProfile}
            accessibilityLabel="View user profile"
            accessibilityRole="button"
          >
            <Ionicons name="person" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>View My Public Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Upcoming Plans Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Upcoming Plans</ThemedText>
            <TouchableOpacity 
              onPress={() => router.push('/plans/upcoming')}
              accessibilityLabel="View all upcoming plans"
              accessibilityRole="button"
            >
              <ThemedText style={styles.seeAllButton}>See all</ThemedText>
            </TouchableOpacity>
          </View>
          
          {isLoadingPlans ? (
            <View style={styles.plansLoadingContainer}>
              <LoadingIndicator />
            </View>
          ) : isErrorPlans ? (
            <View style={styles.plansErrorContainer}>
              <ErrorView error={plansError} />
            </View>
          ) : upcomingPlans?.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Image 
                source={require('../../assets/images/default-avatar.png')} 
                style={styles.emptyStateImage} 
                accessibilityLabel="No upcoming plans illustration"
              />
              <ThemedText style={styles.emptyStateText}>
                You don't have any upcoming plans yet
              </ThemedText>
              <TouchableOpacity 
                style={styles.addButton}
                accessibilityLabel="Add new plan"
                accessibilityRole="button"
              >
                <Ionicons name="add" size={24} color={palette.background} />
                <ThemedText style={styles.addButtonText}>Add New Plan</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
              {upcomingPlans?.map(plan => (
                <TouchableOpacity 
                  key={plan.id} 
                  style={styles.planCard}
                  accessibilityLabel={`Upcoming plan: ${plan.title} at ${plan.location}`}
                  accessibilityRole="button"
                >
                  <Image 
                    source={{ uri: plan.imageUrl }} 
                    style={styles.planImage}
                    accessibilityLabel={`Image for ${plan.title}`}
                  />
                  <View style={styles.planInfo}>
                    <ThemedText style={styles.planTitle}>{plan.title}</ThemedText>
                    <View style={styles.planDetails}>
                      <View style={styles.planDetailItem}>
                        <Ionicons name="time-outline" size={16} color={palette.textSecondary} />
                        <ThemedText style={styles.planDetailText}>{plan.date}</ThemedText>
                      </View>
                      <View style={styles.planDetailItem}>
                        <Ionicons name="location-outline" size={16} color={palette.textSecondary} />
                        <ThemedText style={styles.planDetailText}>{plan.location}</ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Groups Joined Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Groups you Joined</ThemedText>
            <TouchableOpacity
              accessibilityLabel="View all joined groups"
              accessibilityRole="button"
            >
              <ThemedText style={styles.seeAllButton}>See all</ThemedText>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupsScroll}>
            {joinedGroups?.map(group => (
              <TouchableOpacity 
                key={group.id} 
                style={styles.groupCard}
                accessibilityLabel={`Joined group: ${group.name}`}
                accessibilityRole="button"
              >
                <Image 
                  source={{ uri: group.imageUrl }} 
                  style={styles.groupImage}
                  accessibilityLabel={`Image for ${group.name}`}
                />
                <View style={styles.groupInfo}>
                  <View style={styles.joinedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
                    <ThemedText style={styles.joinedText}>Joined</ThemedText>
                  </View>
                  <ThemedText style={styles.groupName}>{group.name}</ThemedText>
                  <ThemedText style={styles.groupDate}>{group.dateRange}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* My Friends Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Friends</ThemedText>
            <TouchableOpacity
              onPress={() => router.push('/myFriendsList' as Href)}
              accessibilityLabel="View all friends"
              accessibilityRole="button"
            >
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
            </TouchableOpacity>
          </View>

          {isLoadingFriends ? (
            <View style={styles.loadingContainerCentered}>
              <ActivityIndicator size="large" color={palette.text} />
            </View>
          ) : friendsError ? (
            <View style={styles.errorContainerCentered}>
              <ErrorView error={friendsError} />
            </View>
          ) : friends && friends.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="people-circle-outline" size={60} color={palette.textSecondary} style={styles.emptyStateIcon} />
              <ThemedText style={styles.emptyStateText}>No Friends Yet</ThemedText>
              <ThemedText style={styles.emptyStateSubText}>You haven't made any friends</ThemedText>
            </View>
          ) : (
            <FlatList
              data={friends}
              renderItem={({ item }) => <ThemedText style={{ color: 'white' }}>Friend: {item.name}</ThemedText>}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.friendsListContainer}
            />
          )}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
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
  loadingContainerCentered: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainerCentered: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    backgroundColor: palette.cardBackground,
    marginHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text,
  },
  statLabel: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
  actionButtonText: {
    marginLeft: spacing.xs,
    color: palette.text,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text,
  },
  seeAllButton: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  seeAllText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  plansLoadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plansErrorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  emptyStateIcon: {
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  addButtonText: {
    marginLeft: spacing.xs,
    color: palette.background,
    fontWeight: 'bold',
  },
  plansScroll: {
    // No specific styles needed here if cards handle their own margin/padding
  },
  planCard: {
    width: 280,
    marginRight: spacing.md,
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  planImage: {
    width: '100%',
    height: 120,
  },
  planInfo: {
    padding: spacing.md,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text,
    marginBottom: spacing.xs,
  },
  planDetails: {
    marginTop: spacing.sm,
  },
  planDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  planDetailText: {
    marginLeft: spacing.xs,
    color: palette.textSecondary,
    fontSize: 14,
  },
  groupsScroll: {
    // No specific styles needed here if cards handle their own margin/padding
  },
  groupCard: {
    width: 200,
    marginRight: spacing.md,
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: 100,
  },
  groupInfo: {
    padding: spacing.sm,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.background,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  joinedText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.text,
    marginBottom: 4,
  },
  groupDate: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  friendsListContainer: {
    paddingLeft: 0,
  },
});
