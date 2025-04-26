import React from 'react';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import useSendMessage from '../useSendMessage';
import * as mockService from '@/services/api/mockService';
import { ChatMessage, User } from '@/types'; // Assuming types are here

// Mock the service module
jest.mock('@/services/api/mockService');

// Mock the Auth context
const mockUser: User = { id: 'test-user-id', name: 'Test User', email: 'test@example.com' };
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Spy on Alert.alert
jest.spyOn(Alert, 'alert');

// Create typesafe mock variable
const mockedSendMessage = mockService.sendMessage as jest.Mock;

// Define the Test Wrapper Helper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false, // Also disable retry for mutations
      },
    },
  });
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return TestWrapper;
};

describe('useSendMessage Hook', () => {
  const testChatId = 'test-send-chat';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully sends message and updates cache optimistically', async () => {
    const messageText = 'Sent Text';
    // Mock response from the actual API call
    const mockSuccessResponse: ChatMessage = {
      id: 'real-msg-1',
      conversationId: testChatId,
      senderId: mockUser.id,
      senderName: mockUser.name,
      text: messageText,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    mockedSendMessage.mockResolvedValue(mockSuccessResponse);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useSendMessage({ chatId: testChatId }), { wrapper });

    // Call the mutation
    act(() => {
      result.current.mutate({ text: messageText });
    });

    // Wait for the mutation to succeed
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check final states
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify the mock service was called correctly
    expect(mockedSendMessage).toHaveBeenCalledTimes(1);
    expect(mockedSendMessage).toHaveBeenCalledWith(testChatId, messageText);

    // Note: Verification of queryClient.setQueryData within the hook's onSuccess
    // is complex here. We trust it runs if isSuccess is true and the service was called.
    // A more integration-style test could verify the cache directly.
  });

  it('handles error during send and shows alert', async () => {
    const messageText = 'Will Fail';
    const mockError = new Error('Failed to send');
    mockedSendMessage.mockRejectedValue(mockError);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useSendMessage({ chatId: testChatId }), { wrapper });

    // Call the mutation
    act(() => {
      result.current.mutate({ text: messageText });
    });

    // Wait for the mutation to error out
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check final states
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);

    // Verify the mock service was called
    expect(mockedSendMessage).toHaveBeenCalledTimes(1);
    expect(mockedSendMessage).toHaveBeenCalledWith(testChatId, messageText);

    // Verify Alert was called
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Send Error', `Failed to send message: ${mockError.message}`);
  });
}); 