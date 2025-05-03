// Screen component for Step 7 of the Create Group flow: Setting group preferences (link, visibility).
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';
import useCreateGroupStore from '@/stores/createGroupStore';
import useCreateGroup from '@/hooks/api/useCreateGroup';

export default function Step7PreferencesScreen() {
  // Select only the state needed for UI rendering and direct updates
  const link = useCreateGroupStore(state => state.link);
  const visibility = useCreateGroupStore(state => state.visibility);
  const setLink = useCreateGroupStore(state => state.setLink);
  const setVisibility = useCreateGroupStore(state => state.setVisibility);

  const { mutate: createGroupMutation, isPending: isCreatingGroup } = useCreateGroup();

  const isProUser = false;

  // Get the full state inside the handler using getState()
  const handleCreatePlan = () => {
    // Destructure to exclude resetState if it exists, otherwise grab all
    const { resetState, ...groupSubmissionData } = useCreateGroupStore.getState(); 
    // Log the data being submitted
    console.log("Submitting data via getState:", groupSubmissionData);

    createGroupMutation(groupSubmissionData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Preferences</Text>
          <Text style={styles.infoText}>Set some preferences</Text>

          {/* Add Link Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.linkTitleRow}>
              <Text style={styles.sectionTitle}>Add Link</Text>
              {/* Example Pro Badge - Style as needed */}
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Pro Feature</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.linkInput,
                !isProUser && styles.inputDisabled
              ]}
              placeholder="https://example.com (Pro Only)"
              placeholderTextColor={Colors.dark.text}
              value={link}
              onChangeText={setLink}
              keyboardType="url"
              autoCapitalize="none"
              editable={isProUser}
            />
          </View>

          {/* Group Visibility Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Group Visibility</Text>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setVisibility('public')}
            >
              <Ionicons
                name={visibility === 'public' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={Colors.dark.primary}
                style={styles.radioIcon}
              />
              <Text style={styles.radioLabel}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setVisibility('private')}
            >
              <Ionicons
                name={visibility === 'private' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={Colors.dark.primary}
                style={styles.radioIcon}
              />
              <Text style={styles.radioLabel}>Private</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, isCreatingGroup && styles.buttonDisabled]}
            onPress={handleCreatePlan}
            disabled={isCreatingGroup}
          >
            {isCreatingGroup ? (
              <ActivityIndicator size="small" color={Colors.dark.text} />
            ) : (
              <Text style={styles.buttonText}>Create Plan</Text>
            )}
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
  sectionContainer: {
    marginBottom: Spacing.xl,
  },
  linkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  proBadge: {
    backgroundColor: Colors.dark.accent, // Example color
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.dark.background, // Text color contrasting with badge bg
  },
  linkInput: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: 16,
    width: '100%',
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.dark.secondary,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  radioIcon: {
    marginRight: Spacing.md,
  },
  radioLabel: {
    fontSize: 16,
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
  buttonDisabled: {
    backgroundColor: Colors.dark.secondary,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 