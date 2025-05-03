import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'caption' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  // Font style based on type
  let fontStyles = {};
  
  switch (type) {
    case 'title':
      fontStyles = styles.title;
      break;
    case 'subtitle':
      fontStyles = styles.subtitle;
      break;
    case 'caption':
      fontStyles = styles.caption;
      break;
    case 'link':
      fontStyles = styles.link;
      break;
    case 'defaultSemiBold':
      fontStyles = styles.defaultSemiBold;
      break;
    default:
      fontStyles = styles.default;
      break;
  }

  return <Text style={[{ color }, fontStyles, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
}); 