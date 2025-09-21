import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

// Mock notification data based on the reference image
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'friend_request',
    title: 'New Friend 👋',
    message: 'saeid just added you as a friend',
    timestamp: '24w',
    avatar: 'https://i.pravatar.cc/150?img=33',
    isUnread: true,
  },
  {
    id: '2',
    type: 'plan_request',
    title: 'New Plan Request 🎯',
    message: 'saeid has just requested to join your private plan',
    timestamp: '24w',
    avatar: 'https://i.pravatar.cc/150?img=33',
    isUnread: true,
  },
  {
    id: '3',
    type: 'friend_request',
    title: 'New Friend 👋',
    message: 'saeid just added you as a friend',
    timestamp: '24w',
    avatar: 'https://i.pravatar.cc/150?img=33',
    isUnread: false,
  },
];

export default function NotificationsScreen() {
  const renderNotification = (notification: typeof MOCK_NOTIFICATIONS[0]) => (
    <TouchableOpacity 
      key={notification.id}
      style={styles.notificationItem}
      accessibilityLabel={`${notification.title}: ${notification.message}`}
      accessibilityRole="button"
    >
      <Image 
        source={{ uri: notification.avatar }}
        style={styles.avatar}
      />
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <ThemedText style={styles.notificationTitle}>
            {notification.title}
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            {notification.timestamp}
          </ThemedText>
        </View>
        <ThemedText style={styles.notificationMessage}>
          {notification.message}
        </ThemedText>
      </View>
      {notification.isUnread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map(renderNotification)}
        
        {/* Empty state when no more notifications */}
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            You're all caught up! 🎉
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            We'll notify you when there's something new
          </ThemedText>
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
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 14,
    color: palette.textSecondary,
    marginLeft: spacing.sm,
  },
  notificationMessage: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});
