import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProp } from '@react-navigation/native';

export default function CreateOptionsSheetContent({ handleClose }: { handleClose: () => void }) {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}>
      {/* Option 1: Create Group */}
      <TouchableOpacity 
        style={styles.option}
        onPress={() => {
          navigation.navigate('createGroup');
          handleClose();
        }}
        accessibilityLabel="Create Group - Organize or find groups for your night out"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="people-outline" size={24} color={palette.primary} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>Create Group</ThemedText>
          <ThemedText style={styles.description}>
            Organize or find groups for your night out
          </ThemedText>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Option 2: Plan Night Out */}
      <TouchableOpacity 
        style={styles.option}
        onPress={() => {
          navigation.navigate('planNightOutPlaceholder');
          handleClose();
        }}
        accessibilityLabel="Plan Night Out - Create an event and invite your friends"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={24} color={palette.primary} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>Plan Night Out</ThemedText>
          <ThemedText style={styles.description}>
            Create an event and invite your friends
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
