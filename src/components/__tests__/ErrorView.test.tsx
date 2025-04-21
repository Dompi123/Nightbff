import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ErrorView from '../ErrorView'; // Adjust path if needed

describe('<ErrorView />', () => {
  const mockRetry = jest.fn();

  beforeEach(() => {
    // Clear mock calls before each test
    mockRetry.mockClear();
  });

  it('renders default title', () => {
    render(<ErrorView />);
    expect(screen.getByText('Oops! Something went wrong.')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    const errorMessage = 'Test error message';
    render(<ErrorView error={new Error(errorMessage)} />);
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it('renders retry button when onRetry prop is provided', () => {
    render(<ErrorView onRetry={mockRetry} />);
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('does NOT render retry button when onRetry prop is missing', () => {
    render(<ErrorView />);
    expect(screen.queryByText('Try Again')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    render(<ErrorView onRetry={mockRetry} />);
    fireEvent.press(screen.getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
