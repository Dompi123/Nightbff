import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ChatListItem from '../ChatListItem'; // Adjust path if needed
import { ChatConversation } from '@/types/data'; // Adjust path if needed

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('<ChatListItem />', () => {
  const baseMockConversation: Omit<ChatConversation, 'id'> = {
    title: 'Test User',
    participants: [{ id: 'user2', name: 'Test User', avatarUrl: 'https://example.com/avatar.png' }],
    lastMessage: {
      text: 'This is the last message snippet.',
      timestamp: '10:30 AM',
      senderId: 'user2',
    },
    unreadCount: 0,
    isGroupChat: false,
    groupImageUrl: undefined,
  };

  beforeEach(() => {
    // Clear mock calls before each test
    mockPush.mockClear();
  });

  it('renders correctly for a Direct Message (DM) with no unread messages', () => {
    const mockDM: ChatConversation = {
      ...baseMockConversation,
      id: 'dm1',
      title: 'Alice',
    };

    render(<ChatListItem conversation={mockDM} />);

    // Check required elements
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('This is the last message snippet.')).toBeTruthy();
    expect(screen.getByText('10:30 AM')).toBeTruthy();

    // Check that unread count badge number is NOT rendered
    // Querying for a number within the badge style might be complex, 
    // so we query for text that is purely numeric.
    expect(screen.queryByText(/^[0-9]+$/)).toBeNull();
  });

  it('renders correctly for a Group Chat with unread messages', () => {
    const mockGroup: ChatConversation = {
      ...baseMockConversation,
      id: 'group1',
      title: 'Work Group',
      isGroupChat: true,
      groupImageUrl: 'https://example.com/group.png',
      unreadCount: 3,
    };

    render(<ChatListItem conversation={mockGroup} />);

    expect(screen.getByText('Work Group')).toBeTruthy();
    expect(screen.getByText('This is the last message snippet.')).toBeTruthy();
    expect(screen.getByText('10:30 AM')).toBeTruthy();

    // Check that the unread count '3' is rendered
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders correctly when there is no last message', () => {
    const mockNoLastMsg: ChatConversation = {
      ...baseMockConversation,
      id: 'dm2',
      title: 'Bob',
      lastMessage: undefined,
    };

    render(<ChatListItem conversation={mockNoLastMsg} />);

    expect(screen.getByText('Bob')).toBeTruthy();
    // Timestamp should be empty or not rendered (implementation dependent)
    // Check that the specific last message text is NOT present
    expect(screen.queryByText('This is the last message snippet.')).toBeNull();
    // Check that the timestamp text is NOT present (as formatTimestamp returns '' for undefined)
    expect(screen.queryByText('10:30 AM')).toBeNull();
  });

  it('navigates to the correct conversation on press', () => {
    const mockDM: ChatConversation = {
      ...baseMockConversation,
      id: 'navDm123',
      title: 'Navigate Test',
    };

    render(<ChatListItem conversation={mockDM} />);

    const touchable = screen.getByLabelText('Chat with Navigate Test'); // Use accessibilityLabel
    fireEvent.press(touchable);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/conversation/[chatId]',
      params: { chatId: 'navDm123' },
    });
  });
}); 