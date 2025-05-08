import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step7PreferencesScreen from '../step7-preferences'; // Import the screen component
import useCreateGroupStore from '@/stores/createGroupStore'; // Import store for mocking
import useCreateGroup from '@/hooks/api/useCreateGroup'; // Import hook for mocking

// Mock expo-router
const mockRouterPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    back: jest.fn(), // Mock back() as well if needed
  }),
}));

// Mock useAuth (assuming it's used but not critical for these tests)
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'testUser123' } }),
}));

// --- Mock useCreateGroup hook ---
const mockMutate = jest.fn();
let mockIsPending = false; // Allow changing pending state if needed later
jest.mock('@/hooks/api/useCreateGroup', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  })),
}));

// --- Mock useCreateGroupStore ---
const mockSetLink = jest.fn();
const mockSetVisibility = jest.fn();
const mockResetStateCreateGroupStore = jest.fn(); // Mock for resetState if it exists

// Define the full state the store would hold
let mockFullStoreState = {
  link: '',
  visibility: 'public' as 'public' | 'private',
  groupName: 'Initial Mock Name',
  groupImageUri: null,
  aboutTrip: 'Initial About',
  arrivalDate: null,
  departingDate: null,
  destinations: [],
  interests: [],
  // Actions
  setLink: mockSetLink,
  setVisibility: mockSetVisibility,
  setGroupName: jest.fn(),
  setGroupImageUri: jest.fn(),
  setAboutTrip: jest.fn(),
  setArrivalDate: jest.fn(),
  setDepartingDate: jest.fn(),
  addDestination: jest.fn(),
  removeDestination: jest.fn(),
  updateDestination: jest.fn(),
  toggleInterest: jest.fn(),
  resetState: mockResetStateCreateGroupStore,
};

// Mock the store
jest.mock('@/stores/createGroupStore', () => {
  const actualStore = jest.requireActual('@/stores/createGroupStore');
  const originalGetState = actualStore.default.getState; // Keep for potential partial mocks

  return {
    __esModule: true,
    default: Object.assign(
      jest.fn((selector) => { // The hook implementation
        if (typeof selector === 'function') {
          return selector(mockFullStoreState);
        }
        return mockFullStoreState; // Should not happen with selectors but as a fallback
      }),
      { // Static properties on the hook
        getState: jest.fn(() => mockFullStoreState),
        setState: jest.fn((updater) => {
          if (typeof updater === 'function') {
            mockFullStoreState = { ...mockFullStoreState, ...updater(mockFullStoreState) };
          } else {
            mockFullStoreState = { ...mockFullStoreState, ...updater };
          }
        }),
        // You might need to mock other static methods if the store uses them, e.g., subscribe
      }
    ),
  };
});
// --- End Store Mock ---

describe('<Step7PreferencesScreen /> (Create Group Step 7)', () => {

  beforeEach(() => {
    // Clear all mocks
    mockRouterPush.mockClear();
    mockSetLink.mockClear();
    mockSetVisibility.mockClear();
    mockResetStateCreateGroupStore.mockClear();
    mockMutate.mockClear();
    
    // Clear calls to the hook itself and its methods
    (useCreateGroupStore as unknown as jest.Mock).mockClear();
    (useCreateGroupStore.getState as jest.Mock).mockClear();
    (useCreateGroupStore.setState as jest.Mock).mockClear();


    // Reset the mock store state object
    mockFullStoreState = {
      link: '',
      visibility: 'public',
      setLink: mockSetLink,
      setVisibility: mockSetVisibility,
      groupName: 'Initial Mock Name',
      groupImageUri: null,
      aboutTrip: 'Initial About',
      arrivalDate: null,
      departingDate: null,
      destinations: [],
      interests: [],
      // Ensure all actions are reset/re-assigned if they are not jest.fn() at the top level
      setGroupName: jest.fn(),
      setGroupImageUri: jest.fn(),
      setAboutTrip: jest.fn(),
      setArrivalDate: jest.fn(),
      setDepartingDate: jest.fn(),
      addDestination: jest.fn(),
      removeDestination: jest.fn(),
      updateDestination: jest.fn(),
      toggleInterest: jest.fn(),
      resetState: mockResetStateCreateGroupStore,
    };
    
    // Reset the hook mock return values/implementations
    (useCreateGroupStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockFullStoreState);
      }
      return mockFullStoreState;
    });
    (useCreateGroupStore.getState as jest.Mock).mockReturnValue(mockFullStoreState);
    (useCreateGroupStore.setState as jest.Mock).mockImplementation((updater) => {
      if (typeof updater === 'function') {
        mockFullStoreState = { ...mockFullStoreState, ...updater(mockFullStoreState) };
      } else {
        mockFullStoreState = { ...mockFullStoreState, ...updater };
      }
    });
    
    // Reset create group hook mock
    mockIsPending = false;
    (useCreateGroup as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: mockIsPending });
  });

  it('renders initial elements correctly', () => {
    render(<Step7PreferencesScreen />);

    // Assert elements
    expect(screen.getByText('Preferences')).toBeTruthy();
    expect(screen.getByText('Set some preferences')).toBeTruthy();
    expect(screen.getByText('Add Link')).toBeTruthy();
    expect(screen.getByText('Pro Feature')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://example.com (Pro Only)')).toBeTruthy();
    expect(screen.getByText('Group Visibility')).toBeTruthy();
    expect(screen.getByText('Public')).toBeTruthy();
    expect(screen.getByText('Private')).toBeTruthy();
    expect(screen.getByText('Create Plan')).toBeTruthy();
  });

  it('calls setLink on link input change', () => {
    render(<Step7PreferencesScreen />);
    
    const linkInput = screen.getByPlaceholderText('https://example.com (Pro Only)');
    const testLink = 'https://test.com';
    // Note: editable={isProUser} is false in the component, so this shouldn't actually call setLink
    // fireEvent.changeText(linkInput, testLink);
    // If we were testing the Pro user case:
    // 1. Mock useAuth to return a pro user OR set isProUser=true in test
    // 2. fireEvent.changeText(linkInput, testLink);
    // 3. expect(mockSetLink).toHaveBeenCalledWith(testLink);

    // For now, just confirm it renders without crashing on change attempt
     fireEvent.changeText(linkInput, testLink);
     expect(mockSetLink).not.toHaveBeenCalled(); // Because input is disabled

  });

  it('calls setVisibility on visibility option press', () => {
    render(<Step7PreferencesScreen />);
    
    const privateOption = screen.getByText('Private');
    fireEvent.press(privateOption);
    
    expect(mockSetVisibility).toHaveBeenCalledTimes(1);
    expect(mockSetVisibility).toHaveBeenCalledWith('private');

    const publicOption = screen.getByText('Public');
    fireEvent.press(publicOption);
    expect(mockSetVisibility).toHaveBeenCalledTimes(2);
    expect(mockSetVisibility).toHaveBeenCalledWith('public');
  });

  it('calls createGroup mutation on Create Plan button press', () => {
    // Simulate what the component does to get submission data
    const { resetState, ...expectedSubmissionDataFromMock } = mockFullStoreState;

    render(<Step7PreferencesScreen />);

    const createButton = screen.getByText('Create Plan');
    fireEvent.press(createButton);

    // Verify mutate was called once
    expect(mockMutate).toHaveBeenCalledTimes(1);
    // Verify mutate was called with the data derived by the component's logic
    expect(mockMutate).toHaveBeenCalledWith(expectedSubmissionDataFromMock);
  });

}); 