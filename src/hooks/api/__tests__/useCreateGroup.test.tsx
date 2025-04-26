import React from 'react';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import useCreateGroup from '../useCreateGroup';
import * as mockService from '@/services/api/mockService';
import { CreateGroupState } from '@/stores/createGroupStore'; // Assuming type is here

// Mock the service module
jest.mock('@/services/api/mockService');

// Mock expo-router
const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();
const mockRouterCanGoBack = jest.fn(() => true); // Assume it can always go back for testing
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockRouterBack,
    push: mockRouterPush,
    canGoBack: mockRouterCanGoBack,
  }),
}));

// Mock Zustand Store
const mockResetFormState = jest.fn();
const mockStoreState = { // Define mock state shape
    groupName: 'Mock Name',
    // Add ALL other state fields expected by hook/getState call
    groupImageUri: null, 
    aboutTrip: '',
    arrivalDate: null,
    departingDate: null,
    destinations: [],
    interests: [],
    link: '',
    visibility: 'public' as 'public' | 'private', // Add type assertion for visibility
    resetState: mockResetFormState, 
};

jest.mock('@/stores/createGroupStore', () => {
  // This factory is called instead of the real module
  const useStore = (selector?: (state: any) => any) => {
    // If a selector is provided, call it with mock state
    if (selector) {
      return selector(mockStoreState);
    }
    // If no selector, return the whole mock state (or relevant parts)
    return mockStoreState; 
  };
  // Mock the static getState if necessary (though avoiding it is better)
  // useStore.getState = jest.fn(() => mockStoreState); 
  return {
    __esModule: true,
    default: useStore, // Default export is the mock hook
    // getState: useStore.getState, // Export static if needed
  };
});

// Spy on Alert.alert
jest.spyOn(Alert, 'alert');

// Create typesafe mock variable for the service function
const mockedCreateGroup = mockService.createGroup as jest.Mock;

// Define the Test Wrapper Helper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return TestWrapper;
};

describe('useCreateGroup Hook', () => {
  const mockGroupData: Partial<CreateGroupState> = {
    groupName: 'Test Group',
    aboutTrip: 'A fun trip!',
    interests: ['hiking', 'food'],
    // Add other necessary fields based on CreateGroupState
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store mock manually if needed between tests, though jest.clearAllMocks handles the function calls
    // useCreateGroupStoreMock.mockClear(); // Handled by clearAllMocks
    // mockResetFormState.mockClear(); // Handled by clearAllMocks
  });

  it('successfully creates group, resets state, navigates back, and shows alert', async () => {
    const mockSuccessResponse = { success: true, groupId: 'new-group-123' };
    mockedCreateGroup.mockResolvedValue(mockSuccessResponse);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCreateGroup(), { wrapper });

    act(() => {
      result.current.mutate(mockGroupData as CreateGroupState); // Cast required if partial
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check final state
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);

    // Check side effects
    expect(mockedCreateGroup).toHaveBeenCalledTimes(1);
    expect(mockedCreateGroup).toHaveBeenCalledWith(mockGroupData);
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Group Created!', // Title check - Changed from expect.stringContaining(...)
      expect.stringContaining(`ID: ${mockSuccessResponse.groupId}`) // Body check for groupId
    );
    expect(mockResetFormState).toHaveBeenCalledTimes(1); // Zustand store reset state called
    expect(mockRouterBack).toHaveBeenCalledTimes(1); // Navigation back called
  });

  it('handles error during creation and shows alert', async () => {
    const mockError = new Error('Failed to create');
    mockedCreateGroup.mockRejectedValue(mockError);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCreateGroup(), { wrapper });

    act(() => {
      result.current.mutate(mockGroupData as CreateGroupState); // Cast required
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check final state
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);

    // Check side effects
    expect(mockedCreateGroup).toHaveBeenCalledTimes(1);
    expect(mockedCreateGroup).toHaveBeenCalledWith(mockGroupData);
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Creation Failed', // Check error title - Changed from 'Create Group Error'
      `Failed to create group: ${mockError.message}` // Check error message
    );
    expect(mockResetFormState).not.toHaveBeenCalled(); // Store state should NOT be reset on error
    expect(mockRouterBack).not.toHaveBeenCalled(); // Navigation should NOT happen on error
  });
}); 