import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; // Assuming Colors definition exists

function LoadingIndicator() {
  // You can add a container View for potential centering/styling later
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Optional: Adjust styling as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator; 