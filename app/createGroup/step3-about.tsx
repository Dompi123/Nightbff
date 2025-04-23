import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors'; // Use theme colors
import { Spacing } from '../../constants/Spacing'; // Use theme spacing

export default function Step3About() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.dark.background, // Use dark background
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg, // Add padding
      }}
    >
      <Text style={{ color: Colors.dark.text, fontSize: 18 }}>
        Step 3: About Trip (Placeholder)
      </Text>
    </View>
  );
} 