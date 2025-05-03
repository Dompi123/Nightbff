// Screen component for Step 5 of the Create Group flow: Adding destinations.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore, { Destination } from '@/stores/createGroupStore';

export default function Step5DestinationScreen() {
  const router = useRouter();
  const { destinations, addDestination, removeDestination } = useCreateGroupStore();

  const handleAddDestination = () => {
    router.push('/createGroup/add-destination-modal');
  };

  const handleContinue = () => {
    if (destinations.length > 0) {
      router.push('/createGroup/step6-interests');
    } else {
      alert('Please add at least one destination.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Destinations</Text>
          <Text style={styles.infoText}>You can add up to 10 destinations</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddDestination}
          >
            <View style={styles.addButtonContainer}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={Colors.dark.text}
                style={styles.addIcon}
              />
              <Text style={styles.addButtonText}>Add Destination</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.listContainer}>
            {destinations.map((dest) => (
              <View key={dest.id} style={styles.destinationItem}>
                <Text style={styles.destinationFlag}>{dest.flag}</Text>
                <View style={styles.destinationTextContainer}>
                  <Text style={styles.destinationName}>{dest.name}</Text>
                  <Text style={styles.destinationCountry}>{dest.country}</Text>
                </View>
                <TouchableOpacity
                  testID={`remove-destination-${dest.id}`}
                  style={styles.deleteButton}
                  onPress={() => removeDestination(dest.id)}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={Colors.dark.icon}
                  />
                </TouchableOpacity>
              </View>
            ))}
            {destinations.length === 0 && (
              <Text style={styles.emptyListText}>No destinations added yet.</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              destinations.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={destinations.length === 0}
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
  contentScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
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
  addButton: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    backgroundColor: Colors.dark.card,
  },
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  addIcon: {
    marginRight: Spacing.md,
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  listContainer: {
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  destinationFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  destinationTextContainer: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  destinationCountry: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: Spacing.xs,
  },
  emptyListText: {
    textAlign: 'center',
    color: Colors.dark.text,
    marginTop: Spacing.lg,
    fontStyle: 'italic',
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