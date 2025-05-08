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

// --- Mock useCreateGroupStore for Step 6 ---
const mockToggleInterestAction = jest.fn();

let mockStep6StoreState = {
  interests: [] as string[], // Ensure this is typed as an array
  toggleInterest: mockToggleInterestAction,
  // Add other minimal state/actions if Step6InterestsScreen unexpectedly accesses them
};

jest.mock('@/stores/createGroupStore', () => {
  return {
    __esModule: true,
    default: Object.assign(
      jest.fn((selector) => { // The hook implementation
        if (typeof selector === 'function') {
          return selector(mockStep6StoreState);
        }
        // Fallback if no selector, though Zustand hooks usually use selectors
        return mockStep6StoreState; 
      }),
      { // Static properties on the hook, if Step6 uses getState or setState directly (it doesn't seem to)
        getState: jest.fn(() => mockStep6StoreState),
        setState: jest.fn((updater) => {
          if (typeof updater === 'function') {
            mockStep6StoreState = { ...mockStep6StoreState, ...updater(mockStep6StoreState) };
          } else {
            mockStep6StoreState = { ...mockStep6StoreState, ...updater };
          }
        }),
      }
    ),
  };
});
// --- End Store Mock ---

describe('<Step6InterestsScreen /> (Create Group Step 6)', () => {

  beforeEach(() => {
    // Clear mocks
    mockPush.mockClear();
    mockToggleInterestAction.mockClear();

    // Reset the mock store state
    mockStep6StoreState = {
      interests: [],
      toggleInterest: mockToggleInterestAction,
    };

    // Reset the hook mock implementation and its static methods
    (useCreateGroupStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStep6StoreState);
      }
      return mockStep6StoreState;
    });
    (useCreateGroupStore.getState as jest.Mock).mockReturnValue(mockStep6StoreState);
    // No need to clear/reset setState mock if not used by component directly
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

    // Assert mockToggleInterestAction was called with the correct interest ID ('adv')
    expect(mockToggleInterestAction).toHaveBeenCalledTimes(1);
    expect(mockToggleInterestAction).toHaveBeenCalledWith('adv'); // ID from ALL_INTERESTS constant

    // Test another chip
    const nightlifeChip = screen.getByText('Night Life');
    fireEvent.press(nightlifeChip);
    expect(mockToggleInterestAction).toHaveBeenCalledTimes(2);
    expect(mockToggleInterestAction).toHaveBeenCalledWith('nit'); // ID from ALL_INTERESTS constant
  });

  // Optional: Add test for selected state rendering (would require updating mock return value)
}); 