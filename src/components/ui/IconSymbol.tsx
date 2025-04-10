import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
  style?: TextStyle;
}

export function IconSymbol({ 
  name, 
  size = 24, 
  color = '#000', 
  weight = 'regular', 
  style 
}: IconSymbolProps) {
  // This is a simplified version that renders text instead of SF Symbols
  // In a real app, you'd use a proper icon library or implement SF Symbols
  return (
    <Text 
      style={[
        styles.icon, 
        { 
          fontSize: size, 
          color,
          fontWeight: weight === 'bold' ? 'bold' : weight === 'medium' ? '500' : 'normal'
        },
        style
      ]}
    >
      {name.includes('chevron.right') ? '▶' : 
       name.includes('chevron.left') ? '◀' : 
       '●'}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'System',
  },
}); 