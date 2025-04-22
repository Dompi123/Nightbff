import { View, Text, StyleSheet } from 'react-native';
// import { Stack } from 'expo-router'; // Remove Stack import
import { Colors } from '@/constants/Colors';
import { Spacing } from '../../constants/Spacing';

// Set screen-specific options
// export const options = {
//   title: 'Group Image',
// };

export default function Step2Image() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Step 2: Group Image (Placeholder)</Text>
      {/* UI for image selection will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.dark.background,
  },
  text: {
    fontSize: 18,
    color: Colors.dark.text,
  },
}); 