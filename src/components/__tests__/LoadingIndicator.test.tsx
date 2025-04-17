import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import LoadingIndicator from '../LoadingIndicator'; // Adjust path if needed

describe('<LoadingIndicator />', () => {
  it('renders an ActivityIndicator', () => {
    render(<LoadingIndicator />);
    // Use UNSAFE_getByType instead of getByRole since ActivityIndicator may not have progressbar role
    const activityIndicator = screen.UNSAFE_getByType(ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });
});
