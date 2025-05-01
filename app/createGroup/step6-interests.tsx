import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons'; // Keep if icons are added to chips later
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore from '@/stores/createGroupStore';

// Define interests based on provided list
const ALL_INTERESTS = [
  { id: 'adv', label: 'Adventure' },
  { id: 'apr', label: 'Au Pair' },
  { id: 'bpk', label: 'Backpacking' },
  { id: 'bch', label: 'Beach' },
  { id: 'bdt', label: 'Budget Travel' },
  { id: 'cmp', label: 'Camping' },
  { id: 'cru', label: 'Cruise' },
  { id: 'dnm', label: 'Digital Nomad' },
  { id: 'div', label: 'Diving' },
  { id: 'hik', label: 'Hiking' },
  { id: 'hst', label: 'Hostel' },
  { id: 'int', label: 'Interrail' },
  { id: 'liv', label: 'Living Abroad' },
  { id: 'lux', label: 'Luxury Travel' },
  { id: 'nat', label: 'Nature' },
  { id: 'nit', label: 'Night Life' },
  { id: 'rdt', label: 'Road Trip' },
  { id: 'ski', label: 'Skiing' },
  { id: 'sai', label: 'Sailing' },
  // Add others if needed based on final visual reference
];

// Limit defined in store, but keep local for display text if needed
const MAX_INTERESTS_DISPLAY = 5;

export default function Step6InterestsScreen() {
  const router = useRouter();
  // CHANGE TO individual selectors
  const selectedInterests = useCreateGroupStore(state => state.interests);
  const toggleInterest = useCreateGroupStore(state => state.toggleInterest);

  const handleContinue = () => {
    // TODO: Pass selectedInterests data if needed
    router.push('/createGroup/step7-preferences');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Interests</Text>
            <Text style={styles.infoText}>
              Add up to {MAX_INTERESTS_DISPLAY} trip interests
            </Text>
            <View style={styles.chipsContainer}>
              {ALL_INTERESTS.map((interest) => {
                // Check selection state from Zustand store
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <TouchableOpacity
                    key={interest.id}
                    style={styles.chipTouchable}
                    onPress={() => toggleInterest(interest.id)}
                  >
                    <View
                      style={[
                        styles.chipView,
                        isSelected && styles.chipViewSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {interest.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedInterests.length === 0 && styles.buttonDisabled, // Add disabled style
            ]}
            onPress={handleContinue}
            disabled={selectedInterests.length === 0} // Add disabled prop
          >
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
  },
  scrollContainer: {
    padding: Spacing.lg, // Padding for the whole scrollable area
  },
  content: {
    // Main content area within scroll view
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
    marginBottom: Spacing.xl,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center', // Center chips horizontally
    // Or use 'flex-start' and adjust margins
  },
  chipTouchable: {
    marginRight: Spacing.sm, // Spacing between chips horizontally
    marginBottom: Spacing.md, // Spacing between chips vertically
  },
  chipView: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20, // Rounded chip shape
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipViewSelected: {
    backgroundColor: Colors.dark.primary, // Use primary color for selected bg
    borderColor: Colors.dark.primary, // Use primary color for selected border
  },
  chipText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.dark.text, // Keep text color same or change if needed
    fontWeight: 'bold',
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
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: { // Add disabled style
    backgroundColor: Colors.dark.secondary,
    opacity: 0.7,
  },
}); 