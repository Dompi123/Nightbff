import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors'; // Assuming path is correct relative to app/

export default function CreateGroupLayout() {
  return (
    <Stack
      screenOptions={{
        // headerTitle: 'Create Group', // REMOVE default title
        headerStyle: {
          backgroundColor: Colors.dark.background, // Apply dark background to header
        },
        headerTintColor: Colors.dark.text, // Apply dark text color for title/buttons
        contentStyle: {
          backgroundColor: Colors.dark.background, // Apply dark background to screen content area
        },
      }}
    >
      <Stack.Screen
        name="index" // Corresponds to app/createGroup/index.tsx
        options={{ title: 'Group Name' }} // Set title for index
      />
      <Stack.Screen
        name="step2-image" // Corresponds to app/createGroup/step2-image.tsx
        options={{ title: 'Group Image' }} // Set title for step 2
      />
      <Stack.Screen
        name="step3-about" // Corresponds to app/createGroup/step3-about.tsx
        options={{ title: 'About Trip' }} // Set title for step 3
      />
      <Stack.Screen
        name="step4-date" // Corresponds to app/createGroup/step4-date.tsx
        options={{ title: 'Date' }}
      />
      <Stack.Screen
        name="step5-destination" // Corresponds to app/createGroup/step5-destination.tsx
        options={{ title: 'Destinations' }} // Set title for Step 5
      />
      <Stack.Screen
        name="step6-interests" // Corresponds to app/createGroup/step6-interests.tsx
        options={{ title: 'Interests' }} // Set title for Step 6
      />
      <Stack.Screen
        name="step7-preferences" // Corresponds to app/createGroup/step7-preferences.tsx
        options={{ title: 'Preferences' }} // Set title for Step 7
      />
      {/* Add Modal Screen */}
      <Stack.Screen
        name="add-destination-modal" // Matches filename
        options={{
          presentation: 'modal', // Present as modal
          headerShown: false, // Use custom header inside modal
        }}
      />
    </Stack>
  );
} 