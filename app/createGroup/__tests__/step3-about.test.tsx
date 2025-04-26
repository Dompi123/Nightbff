import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step3AboutScreen from '../step3-about'; // Import the screen component
import useCreateGroupStore from '@/stores/createGroupStore'; // Import store for mock type

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Zustand store
const mockSetAboutTrip = jest.fn();
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    aboutTrip: '', // Initial mock state
    setAboutTrip: mockSetAboutTrip,
  })),
}));

describe('<Step3AboutScreen /> (Create Group Step 3)', () => {

  beforeEach(() => {
    // Clear mocks before each test
    mockSetAboutTrip.mockClear();
    mockPush.mockClear();
    // Reset the mock store return value if needed (although it's simple here)
    (useCreateGroupStore as jest.Mock).mockReturnValue({
      aboutTrip: '',
      setAboutTrip: mockSetAboutTrip,
    });
  });

  it('renders initial elements correctly and calls setAboutTrip on input change', () => {
    render(<Step3AboutScreen />);

    // Assert main elements are present
    expect(screen.getByText('About Trip')).toBeTruthy();
    expect(screen.getByText('A short description about your trip')).toBeTruthy();
    expect(screen.getByPlaceholderText('Type something...')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    // Optional: Check for character count - find element containing "/ 200"
    expect(screen.getByText(/\/\s*200/)).toBeTruthy(); // Check for "/" possibly followed by whitespace, then "200"

    // Simulate typing in the input
    const input = screen.getByPlaceholderText('Type something...');
    const testInput = 'This is a test description.';
    fireEvent.changeText(input, testInput);

    // Assert the setAboutTrip action from the mock store was called
    expect(mockSetAboutTrip).toHaveBeenCalledTimes(1);
    expect(mockSetAboutTrip).toHaveBeenCalledWith(testInput);

    // Optional: Check if character count updates (assuming state reflects in text)
    // This requires the component to actually render the count based on the mocked state
    // For this simple test, we primarily check the action call.
    // Re-render or update mock state if needed to test count text update.
    // expect(screen.getByText(`${testInput.length}/250`)).toBeTruthy();
  });
}); 