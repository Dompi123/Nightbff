import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText'; // Adjust import path if needed

// Basic test suite for ThemedText
describe('<ThemedText />', () => {
  it('renders children correctly', () => {
    const testMessage = 'Hello World';
    const { getByText } = render(<ThemedText>{testMessage}</ThemedText>);
    // Check if the text content is rendered
    expect(getByText(testMessage)).toBeTruthy();
  });

  it('applies default styles', () => {
    const { getByText } = render(<ThemedText>Default Style</ThemedText>);
    const textElement = getByText('Default Style');
    // Example: Check if a default style property exists (adapt as needed)
    // This is a basic check; more specific style checks can be added.
    expect(textElement.props.style).toBeDefined();
  });

  // Add more tests here later: e.g., for different types (title, default, link)
});
