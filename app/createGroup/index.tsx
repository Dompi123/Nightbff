import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';

export default function CreateGroupNameScreen() {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (groupName.trim().length > 0) {
      // Use an Href object for navigation
      router.push({ pathname: '/createGroup/step2-image' });
    } else {
      alert('Please enter a group name.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.dark.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80} // Adjust as needed
      >
        <View style={styles.content}>
          <Text style={styles.infoText}>Enter group name below.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            placeholderTextColor={Colors.dark.text} // Use existing text color as placeholder for textMuted
            value={groupName}
            onChangeText={setGroupName}
            maxLength={60}
            autoFocus
          />
          <Text style={styles.charLimitText}>No more than 60 characters</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !groupName.trim() && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!groupName.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // Remove potentially conflicting light background color if previously set here
    // backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.text, // Update info text color for dark theme
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.border, // Update border color for dark theme
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 18,
    width: '100%',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.dark.card, // Update input background for dark theme
    color: Colors.dark.text, // Update input text color for dark theme
  },
  charLimitText: {
    fontSize: 12,
    color: Colors.dark.text, // Update char limit text color for dark theme
    alignSelf: 'flex-start',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border, // Update footer border for dark theme
    backgroundColor: Colors.dark.background, // Ensure footer matches background
  },
  button: {
    backgroundColor: Colors.dark.primary, // Update button background for dark theme
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.dark.secondary, // Update disabled button background for dark theme
  },
  buttonText: {
    color: Colors.dark.text, // Update button text color for dark theme
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 