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
    </Stack>
  );
} 