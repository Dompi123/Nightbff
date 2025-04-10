import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        {/* Using Ionicons instead of IconSymbol which might not exist in src/components */}
        <ThemedText style={{ 
          transform: [{ rotate: isOpen ? '90deg' : '0deg' }],
          fontSize: 18,
          marginRight: 6
        }}>▶</ThemedText>

        <ThemedText style={{fontWeight: 'bold'}}>{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 8,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    marginBottom: 16,
  },
}); 