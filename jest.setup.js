// Mock native modules / Vector Icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Icon', props), // Simple mock for Ionicons
    // Add mocks for other icon sets if ErrorView uses them
  };
});

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true], // Assume fonts are loaded
  loadAsync: async () => Promise.resolve(),
}));

// Mock SafeAreaContext (often needed for Expo Router tests/components)
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  }
});

require('@testing-library/jest-native/extend-expect');
