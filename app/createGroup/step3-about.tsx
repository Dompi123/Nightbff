import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore from '@/stores/createGroupStore';

const MAX_DESC_LENGTH = 200;

export default function Step3AboutScreen() {
  const { aboutTrip, setAboutTrip } = useCreateGroupStore();
  const router = useRouter();

  const handleContinue = () => {
    if (aboutTrip.trim().length > 0) {
      router.push('/createGroup/step4-date');
    } else {
      alert('Please enter a description.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={140}
      >
        <View style={styles.content}>
          <Text style={styles.title}>About Trip</Text>
          <Text style={styles.infoText}>
            A short description about your trip
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Type something..."
            placeholderTextColor={Colors.dark.text}
            multiline={true}
            maxLength={MAX_DESC_LENGTH}
            value={aboutTrip}
            onChangeText={setAboutTrip}
            textAlignVertical="top"
          />
          <Text style={styles.charCountText}>
            {aboutTrip.length} / {MAX_DESC_LENGTH}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !aboutTrip.trim() && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!aboutTrip.trim()}
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
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: 16,
    width: '100%',
    minHeight: 100,
    marginBottom: Spacing.sm,
  },
  charCountText: {
    fontSize: 12,
    color: Colors.dark.text,
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
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