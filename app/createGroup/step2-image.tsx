import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';

// REMOVED screen-specific options (controlled by _layout.tsx)

export default function Step2ImageScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null); // State to hold selected image URI

  const handleImagePick = () => {
    // TODO: Implement actual image picking logic using Expo ImagePicker
    console.log('Image Upload Area Pressed');
    // Example: Simulate picking an image
    // setImageUri('https://via.placeholder.com/300');
  };

  const handleContinue = () => {
    // Pass imageUri or relevant data to the next step if needed
    router.push('/createGroup/step3-about');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.infoText}>
            Upload an image of the destination
          </Text>

          <TouchableOpacity
            style={styles.imagePlaceholderTouchable}
            onPress={handleImagePick}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholderContainer}>
                <Ionicons
                  name="image-outline"
                  size={60}
                  color={Colors.dark.icon} // Use theme icon color
                  style={styles.placeholderIcon}
                />
                <Text style={styles.placeholderText}>Tap to upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center', // Center content like placeholder
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: Spacing.xl, // More margin below info text
    textAlign: 'center',
  },
  imagePlaceholderTouchable: {
    width: '80%', // Make touchable area reasonably large
    aspectRatio: 1,
    marginBottom: Spacing.xl,
  },
  imagePlaceholderContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
    borderRadius: 15,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
  },
  placeholderIcon: {
    marginBottom: Spacing.md,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.dark.text,
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
  // Added disabled state style for consistency, though not used yet
  buttonDisabled: {
    backgroundColor: Colors.dark.secondary,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 