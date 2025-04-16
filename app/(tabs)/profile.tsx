import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: profileError } = useUserProfile();
  const { data: joinedGroups } = useJoinedGroups();
  const { data: upcomingPlans, isLoading: isLoadingPlans, isError: isErrorPlans, error: plansError } = useUpcomingPlans();
  const insets = useSafeAreaInsets();

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
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
              accessibilityLabel="Notifications"
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
            onPress={() => router.push('/profile/edit')}
            accessibilityLabel="Edit user profile"
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            accessibilityLabel="View user profile"
            accessibilityRole="button"
          >
            <Ionicons name="person" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>View Profile</ThemedText>
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

        {/* Logout Button Section */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          accessibilityLabel="Log out of your account"
          accessibilityRole="button"
        >
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>

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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
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
    backgroundColor: palette.cardBackground,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
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
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.primary,
  },
  statLabel: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.cardBackground,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: spacing.sm,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    color: palette.primary,
    fontWeight: '600',
  },
  plansLoadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plansErrorContainer: {
    height: 200,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.cardBackground,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  emptyStateText: {
    textAlign: 'center',
    color: palette.textSecondary,
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  addButtonText: {
    color: palette.background,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  plansScroll: {
    paddingLeft: spacing.lg,
  },
  planCard: {
    width: 280,
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    marginRight: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planImage: {
    width: '100%',
    height: 150,
  },
  planInfo: {
    padding: spacing.md,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 12,
    color: palette.textSecondary,
  },
  groupsScroll: {
    paddingLeft: spacing.lg,
  },
  groupCard: {
    width: 200,
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    marginRight: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 6,
  },
  joinedText: {
    marginLeft: spacing.xs,
    fontSize: 10,
    fontWeight: 'bold',
    color: palette.primary,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: spacing.lg,
  },
  groupDate: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: palette.error || '#FF6347',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
