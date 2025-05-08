import * as React from 'react';
// import renderer, { act } from 'react-test-renderer'; // Switch to RNTL
import { render } from '@testing-library/react-native';

import { ThemedText } from '../ThemedText';

// Mock the useColorScheme hook to prevent issues during testing
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'), // Default to 'light' or 'dark'
}));

it(`renders correctly`, () => {
  const { toJSON } = render(<ThemedText>Snapshot test!</ThemedText>);
  expect(toJSON()).toMatchSnapshot();
});
