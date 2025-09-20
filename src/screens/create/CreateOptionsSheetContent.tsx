import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function CreateOptionsSheetContent({ handleClose }: { handleClose: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}>
      {/* Option 1: Create a Party Plan */}
      <TouchableOpacity 
        style={styles.option}
        onPress={() => {
          handleClose();
          router.push('/createGroup');
        }}
        accessibilityLabel="Create a Party Plan - A group chat for your next night out"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={palette.primary} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>Create a Party Plan</ThemedText>
          <ThemedText style={styles.description}>
            A group chat for your next night out!
          </ThemedText>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Option 2: Add a Future Party Plan */}
      <TouchableOpacity 
        style={styles.option}
        onPress={() => {
          handleClose();
          console.log("Add a Future Party Plan pressed");
        }}
        accessibilityLabel="Add a Future Party Plan - Match with other travelers on your trip"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="airplane-outline" size={24} color={palette.primary} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>Add a Future Party Plan</ThemedText>
          <ThemedText style={styles.description}>
            Match with other travelers on your trip
          </ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: palette.text,
  },
  description: {
    fontSize: 14,
    color: palette.textSecondary || '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.xs,
  },
});
