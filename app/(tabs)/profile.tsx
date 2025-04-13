import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useJoinedGroups } from '@/hooks/api/useJoinedGroups';
import { useUpcomingPlans } from '@/hooks/api/useUpcomingPlans';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function ProfileScreen() {
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: joinedGroups } = useJoinedGroups();
  const { data: upcomingPlans } = useUpcomingPlans();
  const insets = useSafeAreaInsets();

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: profile?.avatarUrl }} style={styles.avatar} />
            <ThemedText style={styles.name}>{profile?.name}</ThemedText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={palette.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
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
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="person" size={20} color={palette.text} />
            <ThemedText style={styles.actionButtonText}>View Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Upcoming Plans Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Upcoming Plans</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllButton}>See all</ThemedText>
            </TouchableOpacity>
          </View>
          
          {upcomingPlans?.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Image 
                source={require('../../assets/images/default-avatar.png')} 
                style={styles.emptyStateImage} 
              />
              <ThemedText style={styles.emptyStateText}>
                You don't have any upcoming plans yet
              </ThemedText>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={24} color={palette.background} />
                <ThemedText style={styles.addButtonText}>Add New Plan</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* Render upcoming plans here */}
            </ScrollView>
          )}
        </View>

        {/* Groups Joined Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Groups you Joined</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllButton}>See all</ThemedText>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupsScroll}>
            {joinedGroups?.map(group => (
              <TouchableOpacity key={group.id} style={styles.groupCard}>
                <Image source={{ uri: group.imageUrl }} style={styles.groupImage} />
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
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllButton: {
    color: palette.primary,
    fontSize: 16,
  },
  emptyStateContainer: {
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    color: palette.textSecondary,
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: palette.primary,
    borderRadius: 25,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: palette.background,
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  groupsScroll: {
    marginTop: spacing.sm,
  },
  groupCard: {
    width: 280,
    height: 180,
    marginRight: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  groupInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  joinedText: {
    fontSize: 12,
    marginLeft: 4,
    color: palette.primary,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  groupDate: {
    fontSize: 14,
    color: palette.textSecondary,
  },
}); 

