import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore from '@/stores/createGroupStore';

// Simple date formatter
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  // Basic format, consider using date-fns for more control
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function Step4DateScreen() {
  const router = useRouter();
  // Get state and actions from Zustand store
  const {
    arrivalDate,
    setArrivalDate,
    departingDate,
    setDepartingDate,
  } = useCreateGroupStore();

  const handleContinue = () => {
    // TODO: Add actual validation (e.g., departing >= arrival)
    if (arrivalDate && departingDate) {
      router.push('/createGroup/step5-destination');
    } else {
      alert('Please select arrival and departing dates.');
    }
  };

  const handlePressArrival = () => {
    console.log('Arrival Date pressed');
    // Set dummy date for testing
    setArrivalDate(new Date());
    // TODO: Open Arrival Date picker
  };

  const handlePressDeparting = () => {
    console.log('Departing Date pressed');
    // Set dummy date (+7 days) for testing
    setDepartingDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    // TODO: Open Departing Date picker
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Date</Text>
          <Text style={styles.infoText}>When is the trip date?</Text>

          {/* Arrival Date Input */}
          <TouchableOpacity
            style={styles.dateInputTouchable}
            onPress={handlePressArrival}
          >
            <View style={styles.dateInputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={Colors.dark.icon}
                style={styles.dateIcon}
              />
              {/* Display selected date or placeholder */}
              <Text style={arrivalDate ? styles.dateInputTextSelected : styles.dateInputText}>
                {arrivalDate ? formatDate(arrivalDate) : 'Arrival Date'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Departing Date Input */}
          <TouchableOpacity
            style={styles.dateInputTouchable}
            onPress={handlePressDeparting}
          >
            <View style={styles.dateInputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={Colors.dark.icon}
                style={styles.dateIcon}
              />
              {/* Display selected date or placeholder */}
              <Text style={departingDate ? styles.dateInputTextSelected : styles.dateInputText}>
                {departingDate ? formatDate(departingDate) : 'Departing Date'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              // Disable button if dates are not selected
              (!arrivalDate || !departingDate) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!arrivalDate || !departingDate}
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
    marginBottom: Spacing.xl,
  },
  dateInputTouchable: {
    marginBottom: Spacing.lg,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  dateIcon: {
    marginRight: Spacing.md,
  },
  dateInputText: {
    fontSize: 16,
    color: Colors.dark.text, // Keep placeholder text color same for now
    flex: 1,
  },
  dateInputTextSelected: { // Style for when a date is selected
    fontSize: 16,
    color: Colors.dark.text, // Make selected date text standard color
    flex: 1,
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
  buttonDisabled: { // Style for disabled button
    backgroundColor: Colors.dark.secondary,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 