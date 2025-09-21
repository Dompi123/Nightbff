// app/chatRequests.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const ChatRequestsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No new chat requests.</Text>
        <Text style={styles.emptySubtext}>When a new person wants to chat, you'll see their request here.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});

export default ChatRequestsScreen;
