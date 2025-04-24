import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

  // Local state for picker visibility and target
  const [showPicker, setShowPicker] = useState(false);
  const [pickingDateFor, setPickingDateFor] = useState<'arrival' | 'departing' | null>(null);

  // Handler for date selection from picker
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    // On iOS, the picker stays open until dismissed programmatically after selection
    // On Android, it dismisses automatically. Hide logic needs to adapt.
    // Let's hide it immediately on Android after interaction, but keep it for iOS until done/cancel.
    if (Platform.OS !== 'ios') {
        setShowPicker(false);
    }


    if (event.type === 'set' && currentDate) { // 'set' means a date was selected
      if (pickingDateFor === 'arrival') {
        setArrivalDate(currentDate);
        // Clear departing date if it's before new arrival date
        if (departingDate && currentDate > departingDate) {
           setDepartingDate(null);
        }
      } else if (pickingDateFor === 'departing') {
        // Ensure departing date is not before arrival date
        if (arrivalDate && currentDate < arrivalDate) {
           Alert.alert("Invalid Date", "Departing date cannot be before arrival date.");
        } else {
           setDepartingDate(currentDate);
        }
      }
    }
    // Reset picker target regardless of 'set' or 'dismissed' event type
    // For iOS, only hide if the event type wasn't 'set' (i.e., was dismissed/cancelled)
    // Actually, let's simplify: hide on iOS only *after* setting state for a selected date.
    // If cancelled (event.type == 'dismissed'), iOS will handle hiding.
    // We need to hide it *after* state update completes in the 'set' case.
    // The original logic `setShowPicker(Platform.OS === 'ios');` might be confusing.
    // Let's try always hiding it after handling, unless it's iOS and event wasn't 'set'.
    if (Platform.OS === 'ios' && event.type !== 'set') {
      // Don't hide if iOS user cancelled - it hides itself.
    } else {
      setShowPicker(false); // Hide picker on Android always after interaction, or iOS after 'set'
    }
    setPickingDateFor(null); // Reset which date was being picked
  };

  const handleContinue = () => {
    if (arrivalDate && departingDate) {
      router.push('/createGroup/step5-destination');
    } else {
      Alert.alert('Missing Dates', 'Please select arrival and departing dates.');
    }
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
            onPress={() => { setPickingDateFor('arrival'); setShowPicker(true); }}
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
            onPress={() => {
                if (!arrivalDate) {
                    Alert.alert("Select Arrival First", "Please select the arrival date before the departing date.");
                    return;
                }
                setPickingDateFor('departing'); setShowPicker(true);
            }}
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

          {/* Conditionally render the DateTimePicker */}
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker" // for testing purposes
              value={
                pickingDateFor === 'arrival'
                  ? arrivalDate || new Date() // Default to today if no arrival date yet
                  : departingDate || arrivalDate || new Date() // Default to arrival or today if no departing date
              }
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={
                 // Can't pick arrival before today
                 // Can't pick departing before arrival date
                 pickingDateFor === 'departing' ? (arrivalDate || new Date()) : new Date()
              }
              // You might want to set maximumDate={...} as well
            />
          )}
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