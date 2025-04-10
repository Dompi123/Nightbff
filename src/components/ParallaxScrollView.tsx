import React, { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ParallaxScrollViewProps {
  children: ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
  headerImage?: ReactNode;
}

export default function ParallaxScrollView({
  children,
  headerBackgroundColor = { light: '#F2F2F2', dark: '#1A1A1A' },
  headerImage,
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = headerBackgroundColor[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor }]}>{headerImage}</View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 200,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },
}); 