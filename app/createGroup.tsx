import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/theme/colors';

export default function CreateGroupScreen() {
  const params = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <Stack.Screen options={{ title: 'Create Group' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ThemedText style={{ fontSize: 18, textAlign: 'center' }}>Create Group Screen Placeholder</ThemedText>
        <ThemedText style={{ marginTop: 10, color: 'grey' }}>Params Received:</ThemedText>
        <ThemedText style={{ color: 'grey' }}>{JSON.stringify(params, null, 2)}</ThemedText>
      </View>
    </SafeAreaView>
  );
} 