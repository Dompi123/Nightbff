import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore from '@/stores/createGroupStore';

// REMOVED screen-specific options (controlled by _layout.tsx)

export default function Step2ImageScreen() {
  const router = useRouter();
  const { groupImageUri, setGroupImageUri } = useCreateGroupStore();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setGroupImageUri(selectedUri);
      }
    } catch (error) {
       console.error("ImagePicker Error: ", error);
       Alert.alert('Error', 'Could not pick image. Please try again.');
    }
  };

  const handleClearImage = () => {
    setGroupImageUri(null);
  };

  const handleContinue = () => {
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
            style={styles.imageContainerTouchable}
            onPress={handlePickImage}
            disabled={!!groupImageUri}
          >
            {groupImageUri ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: groupImageUri }}
                  style={styles.selectedImage}
                  contentFit="cover"
                  transition={300}
                />
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearImage}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={Colors.dark.text}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholderContainer}>
                <Ionicons
                  name="image-outline"
                  size={60}
                  color={Colors.dark.icon}
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
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  imageContainerTouchable: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: Spacing.xl,
    borderRadius: 15,
    overflow: 'hidden',
  },
  imageWrapper: {
    flex: 1,
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
  selectedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    marginBottom: Spacing.md,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  clearButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
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