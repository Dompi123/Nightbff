// Placeholder for app/locationDetail/[locationName].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/theme/colors';

export default function LocationDetailScreen() {
  const params = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <Stack.Screen options={{ title: 'Location Details' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ThemedText style={{ fontSize: 18, textAlign: 'center' }}>Location Details Screen Placeholder</ThemedText>
        <ThemedText style={{ marginTop: 10, color: 'grey' }}>Params Received:</ThemedText>
        <ThemedText style={{ color: 'grey' }}>{JSON.stringify(params, null, 2)}</ThemedText>
      </View>
    </SafeAreaView>
  );
} 