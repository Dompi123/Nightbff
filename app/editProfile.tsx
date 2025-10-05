import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function EditProfileScreen() {
  const router = useRouter();

  // State for profile images
  const [mainImage, setMainImage] = useState<string | null>('https://i.pravatar.cc/300?img=8');
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [thirdImage, setThirdImage] = useState<string | null>(null);

  // State for form fields
  const [firstName, setFirstName] = useState('Ask');
  const [introduction, setIntroduction] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [genderPreference, setGenderPreference] = useState('Everyone');
  const [travelLifestyle, setTravelLifestyle] = useState('Backpacking');
  const [nationality, setNationality] = useState('Afghanistan');

  const handleUpdate = () => {
    console.log('Update pressed - saving profile changes');
    Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
  };

  // Image picker function
  const pickImage = async (): Promise<string | null> => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to select a profile picture!'
        );
        return null;
      }

      // Launch the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      // If user didn't cancel, return the image URI
      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  };

  const handleImagePicker = async (imageType: 'main' | 'second' | 'third') => {
    console.log(`${imageType} image picker pressed`);
    
    const uri = await pickImage();
    
    if (uri) {
      // Update the appropriate state based on image type
      switch (imageType) {
        case 'main':
          setMainImage(uri);
          break;
        case 'second':
          setSecondImage(uri);
          break;
        case 'third':
          setThirdImage(uri);
          break;
      }
      
      console.log(`${imageType} image updated:`, uri);
    }
  };

  const handleDatePicker = () => {
    console.log('Date picker pressed');
    Alert.alert('Date Picker', 'Date selection functionality coming soon!');
  };

  const handleDropdownPress = (field: string, currentValue: string) => {
    console.log(`${field} dropdown pressed, current value: ${currentValue}`);
    Alert.alert('Dropdown', `${field} selection functionality coming soon!`);
  };

  const handleMultiSelectPress = (field: string) => {
    console.log(`${field} multi-select pressed`);
    Alert.alert('Multi-Select', `${field} selection functionality coming soon!`);
  };

  const renderProfilePictures = () => (
    <View style={styles.profilePicturesSection}>
      <ThemedText style={styles.sectionTitle}>Profile Pictures</ThemedText>
      
      {/* Main Picture */}
      <TouchableOpacity 
        style={styles.mainPictureContainer}
        onPress={() => handleImagePicker('main')}
        accessibilityLabel="Select main profile picture"
        accessibilityRole="button"
      >
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            style={styles.mainPicture}
          />
        ) : (
          <View style={styles.addPictureButton}>
            <Ionicons name="add" size={60} color={palette.textSecondary} />
          </View>
        )}
        <View style={styles.mainPictureOverlay}>
          <ThemedText style={styles.mainPictureLabel}>Main Picture</ThemedText>
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={24} color={palette.text} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Additional Pictures */}
      <View style={styles.additionalPicturesRow}>
        <TouchableOpacity 
          style={styles.additionalPictureContainer}
          onPress={() => handleImagePicker('second')}
          accessibilityLabel="Select second profile picture"
          accessibilityRole="button"
        >
          {secondImage ? (
            <Image
              source={{ uri: secondImage }}
              style={styles.additionalPicture}
            />
          ) : (
            <View style={styles.addPictureButton}>
              <Ionicons name="add" size={40} color={palette.textSecondary} />
            </View>
          )}
          <View style={styles.additionalPictureOverlay}>
            <ThemedText style={styles.additionalPictureLabel}>2nd Pic</ThemedText>
            <View style={styles.smallCameraIconContainer}>
              <Ionicons name="camera" size={16} color={palette.text} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.additionalPictureContainer}
          onPress={() => handleImagePicker('third')}
          accessibilityLabel="Select third profile picture"
          accessibilityRole="button"
        >
          {thirdImage ? (
            <Image
              source={{ uri: thirdImage }}
              style={styles.additionalPicture}
            />
          ) : (
            <View style={styles.addPictureButton}>
              <Ionicons name="add" size={40} color={palette.textSecondary} />
            </View>
          )}
          <View style={styles.additionalPictureOverlay}>
            <ThemedText style={styles.additionalPictureLabel}>3rd Pic</ThemedText>
            <View style={styles.smallCameraIconContainer}>
              <Ionicons name="camera" size={16} color={palette.text} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        accessibilityLabel={`${label} input field`}
      />
    </View>
  );

  const renderDatePicker = () => (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.inputLabel}>Date of Birth</ThemedText>
      <TouchableOpacity 
        style={styles.datePickerButton}
        onPress={handleDatePicker}
        accessibilityLabel="Select date of birth"
        accessibilityRole="button"
      >
        <ThemedText style={[styles.datePickerText, !dateOfBirth && styles.placeholderText]}>
          {dateOfBirth || 'Select date'}
        </ThemedText>
        <Ionicons name="calendar-outline" size={20} color={palette.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderDropdown = (label: string, value: string, icon?: string, subtitle?: string) => (
    <View style={styles.inputContainer}>
      {subtitle && <ThemedText style={styles.inputSubtitle}>{subtitle}</ThemedText>}
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => handleDropdownPress(label, value)}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
      >
        <View style={styles.dropdownContent}>
          {icon && (
            <View style={styles.dropdownIconContainer}>
              <ThemedText style={styles.dropdownIcon}>{icon}</ThemedText>
            </View>
          )}
          <ThemedText style={styles.dropdownText}>{value}</ThemedText>
        </View>
        <Ionicons name="chevron-down" size={20} color={palette.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderMultiSelect = (label: string, placeholder: string) => (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TouchableOpacity 
        style={styles.multiSelectButton}
        onPress={() => handleMultiSelectPress(label)}
        accessibilityLabel={`Add ${label}`}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color={palette.textSecondary} />
        <ThemedText style={styles.placeholderText}>{placeholder}</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Pictures Section */}
        {renderProfilePictures()}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {renderTextInput('First Name', firstName, setFirstName, 'Enter your first name')}
          
          {renderTextInput(
            'Introduction', 
            introduction, 
            setIntroduction, 
            'Write something...', 
            true
          )}

          {renderDatePicker()}

          {renderDropdown(
            'Gender Preference',
            genderPreference,
            '👥',
            'Who do you want to meet?'
          )}

          {renderDropdown('Travel Lifestyle', travelLifestyle, '🎒')}

          {renderTextInput(
            'Instagram Username',
            instagramUsername,
            setInstagramUsername,
            'Instagram username'
          )}

          {renderTextInput(
            'TikTok Username',
            tiktokUsername,
            setTiktokUsername,
            'TikTok username'
          )}

          {renderDropdown('Nationality', nationality, '🇦🇫')}

          {renderMultiSelect('Languages', 'Tap here to add languages')}

          {renderMultiSelect('Interests', 'Tap here to add interests')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profilePicturesSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text,
    marginBottom: spacing.md,
  },
  mainPictureContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
  },
  mainPicture: {
    width: '100%',
    height: '100%',
  },
  additionalPicture: {
    width: '100%',
    height: '100%',
  },
  mainPictureOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mainPictureLabel: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cameraIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalPicturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  additionalPictureContainer: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    backgroundColor: palette.cardBackground,
    position: 'relative',
    overflow: 'hidden',
  },
  addPictureButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalPictureOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  additionalPictureLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '500',
  },
  smallCameraIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: palette.text,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  datePickerButton: {
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  datePickerText: {
    fontSize: 16,
    color: palette.text,
  },
  placeholderText: {
    color: palette.textSecondary,
  },
  dropdownButton: {
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIconContainer: {
    marginRight: spacing.sm,
  },
  dropdownIcon: {
    fontSize: 18,
  },
  dropdownText: {
    fontSize: 16,
    color: palette.text,
  },
  multiSelectButton: {
    backgroundColor: palette.cardBackground,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
});
