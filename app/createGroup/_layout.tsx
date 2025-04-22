import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors'; // Assuming path is correct relative to app/

export default function CreateGroupLayout() {
  return (
    <Stack
      screenOptions={{ // General styling for the stack
        // NO default headerTitle here
        headerStyle: {
          backgroundColor: Colors.dark.background, // Apply dark background to header
        },
        headerTintColor: Colors.dark.text, // Apply dark text color for title/buttons
        contentStyle: {
          backgroundColor: Colors.dark.background, // Apply dark background to screen content area
        },
        // headerBackTitleVisible: false, // Removed due to type error
      }}
    >
      {/* Define screens explicitly with their options */}
      <Stack.Screen
        name="index" // Corresponds to app/createGroup/index.tsx
        options={{
          title: 'Group Name', // Set title for the first step
        }}
      />
      <Stack.Screen
        name="step2-image" // Corresponds to app/createGroup/step2-image.tsx
        options={{
          title: 'Group Image', // Set title for the second step
        }}
      />
      {/* Future steps can be added here */}
    </Stack>
  );
} 