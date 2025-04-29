import { Stack } from 'expo-router';
// Removed Colors import as header styling is removed

export default function CreateGroupLayout() {
  return (
    <Stack
      screenOptions={{ 
          headerShown: false // <<< ADD THIS TO HIDE NESTED HEADER
      }}
    >
      <Stack.Screen
        name="index" // Corresponds to app/createGroup/index.tsx
        // Removed options={{ title: 'Group Name' }}
      />
      <Stack.Screen
        name="step2-image" // Corresponds to app/createGroup/step2-image.tsx
        // Removed options={{ title: 'Group Image' }}
      />
      <Stack.Screen
        name="step3-about" // Corresponds to app/createGroup/step3-about.tsx
        // Removed options={{ title: 'About Trip' }}
      />
      <Stack.Screen
        name="step4-date" // Corresponds to app/createGroup/step4-date.tsx
        // Removed options={{ title: 'Date' }}
      />
      <Stack.Screen
        name="step5-destination" // Corresponds to app/createGroup/step5-destination.tsx
        // Removed options={{ title: 'Destinations' }}
      />
      <Stack.Screen
        name="step6-interests" // Corresponds to app/createGroup/step6-interests.tsx
        // Removed options={{ title: 'Interests' }}
      />
      <Stack.Screen
        name="step7-preferences" // Corresponds to app/createGroup/step7-preferences.tsx
        // Removed options={{ title: 'Preferences' }}
      />
      {/* Keep Modal Screen */}
      <Stack.Screen
        name="add-destination-modal" // Matches filename
        options={{
          presentation: 'modal', // Present as modal
          // Removed headerShown: false as parent stack is hidden anyway
        }}
      />
    </Stack>
  );
} 