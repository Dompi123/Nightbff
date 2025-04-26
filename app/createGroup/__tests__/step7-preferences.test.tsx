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
// We don't need mockResetState if getState isn't called

// Define the state slices the component will select via the hook
let mockSelectedStoreState = {
  link: '',
  visibility: 'public' as 'public' | 'private',
  setLink: mockSetLink,
  setVisibility: mockSetVisibility,
  // Include other state fields the component selects
  groupName: 'Initial Mock Name',
  groupImageUri: null,
  aboutTrip: 'Initial About',
  arrivalDate: null,
  departingDate: null,
  destinations: [],
  interests: [],
};

// Mock the store hook to return the selected state object
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn(() => mockSelectedStoreState),
  // No getState mock needed
}));
// --- End Store Mock ---

describe('<Step7PreferencesScreen /> (Create Group Step 7)', () => {

  beforeEach(() => {
    // Clear all mocks
    mockRouterPush.mockClear();
    mockSetLink.mockClear();
    mockSetVisibility.mockClear();
    mockMutate.mockClear();
    (useCreateGroupStore as jest.Mock).mockClear(); // Clear calls to the hook itself

    // Reset the mock store state object
    mockSelectedStoreState = {
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
    };
    // Reset the hook mock return value
    (useCreateGroupStore as jest.Mock).mockReturnValue(mockSelectedStoreState);
    
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
    // Define the expected data based on the INITIAL mock state
    const expectedSubmissionData = {
      groupName: mockSelectedStoreState.groupName,
      groupImageUri: mockSelectedStoreState.groupImageUri,
      aboutTrip: mockSelectedStoreState.aboutTrip,
      arrivalDate: mockSelectedStoreState.arrivalDate,
      departingDate: mockSelectedStoreState.departingDate,
      destinations: mockSelectedStoreState.destinations,
      interests: mockSelectedStoreState.interests,
      link: mockSelectedStoreState.link,
      visibility: mockSelectedStoreState.visibility,
    };

    render(<Step7PreferencesScreen />);

    const createButton = screen.getByText('Create Plan');
    fireEvent.press(createButton);

    // Verify mutate was called once
    expect(mockMutate).toHaveBeenCalledTimes(1);
    // Verify mutate was called with the data derived from the hook's state
    expect(mockMutate).toHaveBeenCalledWith(expectedSubmissionData);
  });

}); 