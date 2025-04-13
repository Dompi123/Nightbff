import React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function CreateOptionsModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            <View style={styles.handle} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => {
                console.log('Create a group pressed');
                handleClose();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={24} color={palette.text} />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.title}>Create a group</ThemedText>
                <ThemedText style={styles.description}>
                  Plan a future night out that others can join
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => {
                console.log('Add a Future Plan pressed');
                handleClose();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color={palette.text} />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.title}>Add a Future Plan</ThemedText>
                <ThemedText style={styles.description}>
                  Match with other party-goers for your night out
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: palette.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg + 20, // Extra padding at bottom for safe area
    marginBottom: 100, // Adjusted to ensure it clears the tab bar
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: palette.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: palette.textSecondary,
  },
}); 