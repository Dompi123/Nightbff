import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyFriendsListScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>My Friends List</ThemedText>
        <ThemedText style={styles.placeholder}>This screen will show all your friends.</ThemedText>
        {/* Add actual friend list implementation later */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: palette.text,
  },
  placeholder: {
    fontSize: 16,
    color: palette.textSecondary,
    textAlign: 'center',
  },
}); 