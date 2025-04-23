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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';

// REMOVED screen-specific options
// export const options = {
//   title: 'Group Name',
// };

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
          <Text style={styles.title}>Group Name</Text>
          <Text style={styles.infoText}>Enter group name to get started</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            placeholderTextColor={Colors.dark.text} // Kept dark text for placeholder
            value={groupName}
            onChangeText={setGroupName}
            maxLength={60}
            autoFocus
          />
          <View style={styles.charLimitContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={Colors.dark.text} // Using default text color for checkmark
              style={styles.charLimitIcon}
            />
            <Text style={styles.charLimitText}>No more than 60 characters</Text>
          </View>
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
    // alignItems: 'center', // Remove center alignment to allow items to align left
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.md,
    // textAlign: 'center', // Removed center alignment
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: Spacing.lg, // Increased margin below subtitle
    // textAlign: 'center', // Removed center alignment
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    borderRadius: 10, // Slightly increased border radius
    paddingVertical: Spacing.md, // Adjusted padding
    paddingHorizontal: Spacing.md,
    fontSize: 18,
    width: '100%',
    marginBottom: Spacing.md, // Increased margin below input
  },
  charLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: '100%', // Ensure container takes full width for alignSelf
  },
  charLimitIcon: {
    marginRight: Spacing.xs,
  },
  charLimitText: {
    fontSize: 12,
    color: Colors.dark.text,
    // alignSelf: 'flex-start', // Alignment handled by container
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    backgroundColor: Colors.dark.background,
  },
  button: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.dark.secondary,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 