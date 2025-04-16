import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assuming ThemedText exists
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons are used
import { palette } from '@/theme/colors'; // Adjust path if theme structure differs
import { spacing } from '@/theme/spacing'; // Adjust path if theme structure differs

// Define simple props, make error optional for now
type ErrorViewProps = {
  error?: Error | null;
  onRetry?: () => void; // Add retry prop, even if not used initially
};

export default function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={palette.error} />
      <ThemedText style={styles.title}>Oops! Something went wrong.</ThemedText>
      {error?.message && (
        <ThemedText style={styles.message}>{error.message}</ThemedText>
      )}
      {/* Add a basic retry button visually, logic can be added later */}
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <ThemedText style={styles.retryText}>Try Again</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    // backgroundColor: palette.background, // Optional: match background
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: spacing.md,
    textAlign: 'center',
    color: palette.text, // Use theme text color
  },
  message: {
    fontSize: 14,
    color: palette.textSecondary, // Use theme secondary text color
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: palette.primary, // Use theme primary color
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  retryText: {
    color: '#FFFFFF', // Assuming white text on primary button
    fontWeight: 'bold',
  },
}); 