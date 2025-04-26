import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step6InterestsScreen from '../step6-interests'; // Import the screen component
import useCreateGroupStore from '@/stores/createGroupStore'; // Import store for mock type

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Zustand store
const mockToggleInterest = jest.fn();
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({ // Default mock hook implementation
    interests: [], 
    toggleInterest: mockToggleInterest,
  })),
}));   

describe('<Step6InterestsScreen /> (Create Group Step 6)', () => {

  beforeEach(() => {
    // Clear mocks
    mockPush.mockClear();
    mockToggleInterest.mockClear();
    // Reset the mock store's return value to default (empty interests)
    // Directly modify the mock function provided by jest.mock
    (useCreateGroupStore as jest.Mock).mockReturnValue({ 
        interests: [], 
        toggleInterest: mockToggleInterest 
    }); 
  });

  it('renders initial state correctly with interest chips', () => {
    render(<Step6InterestsScreen />);

    // Assert initial elements
    expect(screen.getByText('Interests')).toBeTruthy();
    expect(screen.getByText(/Add up to \d+ trip interests/i)).toBeTruthy(); // Check subtitle pattern
    expect(screen.getByText('Continue')).toBeTruthy();

    // Assert that some specific unselected interest chips are visible
    // (Using labels defined in the component file)
    expect(screen.getByText('Adventure')).toBeTruthy(); 
    expect(screen.getByText('Backpacking')).toBeTruthy();
    expect(screen.getByText('Night Life')).toBeTruthy();
  });

  it('calls toggleInterest with correct ID on chip press', () => {
    render(<Step6InterestsScreen />);

    // Find an interest chip by its label text
    const adventureChip = screen.getByText('Adventure');
    fireEvent.press(adventureChip);

    // Assert mockToggleInterest was called with the correct interest ID ('adv')
    expect(mockToggleInterest).toHaveBeenCalledTimes(1);
    expect(mockToggleInterest).toHaveBeenCalledWith('adv'); // ID from ALL_INTERESTS constant

    // Test another chip
    const nightlifeChip = screen.getByText('Night Life');
    fireEvent.press(nightlifeChip);
    expect(mockToggleInterest).toHaveBeenCalledTimes(2);
    expect(mockToggleInterest).toHaveBeenCalledWith('nit'); // ID from ALL_INTERESTS constant
  });

  // Optional: Add test for selected state rendering (would require updating mock return value)
}); 