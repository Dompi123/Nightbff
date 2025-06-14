import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import useChatList from '../useChatList'; // REVERTED HERE
import * as mockService from '@/services/api/mockService';
import { ChatConversation } from '@/types/data'; // Kept modification

// Mock the service module
jest.mock('@/services/api/mockService');

// Create a typesafe mock variable
const mockedFetchChatList = mockService.fetchChatList as jest.Mock;

// Define the Test Wrapper Helper EXACTLY like this:
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
        gcTime: Infinity, // Disable garbage collection for tests
      },
    },
  });
  // Define the Wrapper component separately
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  // Return the component itself
  return TestWrapper;
};

describe('useChatList Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be in loading state initially', () => {
    // Mock fetchChatList to never resolve for loading state test
    mockedFetchChatList.mockImplementation(() => new Promise(() => {}));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useChatList(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true); // React Query distinguishes loading vs fetching
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();
  });

  it('should return data on successful fetch', async () => {
    // Define mock data matching the ChatConversation type structure
    const mockChatListData: ChatConversation[] = [
      {
        id: 'chat1',
        name: 'Alice',
        lastMessage: 'See you soon!',
        timestamp: new Date().toISOString(),
        unreadCount: 1,
        imageUrl: 'https://example.com/alice.png',
      },
      {
        id: 'chat2',
        name: 'Bob & Charlie',
        lastMessage: 'Project update attached.',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        unreadCount: 0,
        imageUrl: 'https://example.com/group.png',
        isGroup: true,
      },
    ];

    mockedFetchChatList.mockResolvedValue(mockChatListData);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useChatList(), { wrapper });

    // Wait for the query to become successful
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual(mockChatListData);
    expect(result.current.error).toBeNull();
    expect(mockedFetchChatList).toHaveBeenCalledTimes(1);
  });

  it('should return an error state when fetch fails', async () => {
    const mockError = new Error('API Fetch Error');
    mockedFetchChatList.mockRejectedValue(mockError);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useChatList(), { wrapper });

    // Wait for the query to transition to an error state
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
    expect(mockedFetchChatList).toHaveBeenCalledTimes(1);
  });
}); 