import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; // Assuming Colors are in constants
import { Spacing } from '../../constants/Spacing'; // Assuming Spacing is in constants
import useCreateGroupStore, { Destination } from '@/stores/createGroupStore'; // Import store and Destination type

// Define Mock Destinations matching the Destination type (same as before)
const MOCK_AVAILABLE_DESTINATIONS: Destination[] = [
  { id: 'paris_fr', name: 'Paris', country: 'France', flag: '🇫🇷' },
  { id: 'tokyo_jp', name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { id: 'london_uk', name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { id: 'rome_it', name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { id: 'nyc_us', name: 'New York City', country: 'USA', flag: '🇺🇸' },
  { id: 'sydney_au', name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { id: 'cairo_eg', name: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
  { id: 'rio_br', name: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷' },
  { id: 'bangkok_th', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { id: 'barcelona_es', name: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
];

const MAX_DESTINATIONS = 10; // Define max destinations limit again

export default function AddDestinationModal() {
  const router = useRouter();
  // Get state and actions from Zustand store
  const { destinations, addDestination } = useCreateGroupStore();

  // Handler for selecting a destination from the list
  const handleSelectDestination = (destinationToAdd: Destination) => {
    if (destinations.length < MAX_DESTINATIONS && !destinations.some(d => d.id === destinationToAdd.id)) {
      addDestination(destinationToAdd); // Add to Zustand store
      router.back(); // Close the modal after selection
    } else if (destinations.some(d => d.id === destinationToAdd.id)) {
      Alert.alert("Already Added", `${destinationToAdd.name} is already in your list.`);
      // Don't close modal
    } else {
      Alert.alert("Limit Reached", `You can only add up to ${MAX_DESTINATIONS} destinations.`);
      // Don't close modal
    }
  };

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add Destination</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close-circle" size={30} color={Colors.dark.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.dark.icon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city or place"
          placeholderTextColor={Colors.dark.text}
          autoFocus={true} // Automatically focus input
          // Add onChangeText, value etc. later for search logic
        />
      </View>
      {/* Replace placeholder View with FlatList */}
      <FlatList
          data={MOCK_AVAILABLE_DESTINATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item: availableDest }) => {
            const isSelected = destinations.some(d => d.id === availableDest.id);
            const limitReached = destinations.length >= MAX_DESTINATIONS;
            const isDisabled = isSelected || (limitReached && !isSelected);

            return (
                <TouchableOpacity
                  style={[styles.optionRow, isDisabled && styles.optionRowDisabled]}
                  onPress={() => handleSelectDestination(availableDest)}
                  disabled={isDisabled}
                >
                  <Text style={styles.optionFlag}>{availableDest.flag}</Text>
                  <View style={styles.optionTextContainer}>
                      <Text style={styles.optionName}>{availableDest.name}</Text>
                      <Text style={styles.optionCountry}>{availableDest.country}</Text>
                  </View>
                  {isSelected && (
                     <Ionicons name="checkmark-circle" size={24} color={Colors.dark.primary} style={styles.checkmarkIcon} />
                  )}
                </TouchableOpacity>
            );
          }}
          style={styles.resultsList} // Use a specific style for the list itself
          // Optional: Add a separator between items
          // ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.sm : Spacing.lg, // Adjust top padding for platform
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 45, // Consistent height
    fontSize: 16,
    color: Colors.dark.text,
  },
  resultsList: {
    flex: 1, // Allow list to take remaining space
    // paddingHorizontal: Spacing.lg, // Apply padding if needed, maybe on rows instead
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  optionRowDisabled: {
    opacity: 0.5,
    // backgroundColor: Colors.dark.secondary, // Optional disabled background
  },
  optionFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  optionTextContainer: {
    flex: 1, // Allow text to take available space
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  optionCountry: {
    fontSize: 14,
    color: Colors.dark.text, // Use standard text color
  },
  checkmarkIcon: {
      marginLeft: Spacing.md, // Space it from the text
  }
  // Optional Separator Style
  // separator: {
  //   height: 1,
  //   backgroundColor: Colors.dark.border,
  //   marginHorizontal: Spacing.lg,
  // },
}); 