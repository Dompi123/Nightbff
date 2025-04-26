import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CreateGroupNameScreen from '../index'; // Import the screen component

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Zustand store
const mockSetGroupName = jest.fn();
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true, // Required for ES modules
  // Mock the default export (the hook itself)
  default: jest.fn(() => ({
    // Provide the state and actions used by the component
    groupName: '', // Initial state for the component
    setGroupName: mockSetGroupName,
    // Add other state defaults only if the component directly reads them
    // Example: If Step 1 checked destinations length, we'd add: destinations: [],
  })),
}));

describe('<CreateGroupNameScreen /> (Create Group Step 1)', () => {

  beforeEach(() => {
    // Clear mock calls before each test
    mockSetGroupName.mockClear();
    mockPush.mockClear();
  });

  it('renders initial elements correctly and calls setGroupName on input change', () => {
    render(<CreateGroupNameScreen />);

    // Assert main elements are present using getByText/getByPlaceholderText
    expect(screen.getByText('Group Name')).toBeTruthy();
    expect(screen.getByText('Enter group name to get started')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter Name')).toBeTruthy();
    expect(screen.getByText(/no more than 60 characters/i)).toBeTruthy(); // Use regex for case insensitivity
    expect(screen.getByText('Continue')).toBeTruthy();

    // Simulate typing in the input
    const input = screen.getByPlaceholderText('Enter Name');
    const testInput = 'Test Group Name';
    fireEvent.changeText(input, testInput);

    // Assert the setGroupName action from the mock store was called
    expect(mockSetGroupName).toHaveBeenCalledTimes(1);
    expect(mockSetGroupName).toHaveBeenCalledWith(testInput);

    // Optional: Test button press (though it depends on validation logic not fully mocked here)
    // const continueButton = screen.getByText('Continue');
    // fireEvent.press(continueButton);
    // Assert mockPush was called if input is valid
    // expect(mockPush).toHaveBeenCalledWith('/createGroup/step2-image'); 
  });

  // Add more tests later if needed, e.g., for the character limit visual feedback,
  // or button disabled state based on input length.
}); 