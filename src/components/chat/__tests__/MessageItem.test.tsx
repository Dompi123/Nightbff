import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MessageItem from '../MessageItem'; // Adjust path if needed
import { ChatMessage } from '@/types/data'; // Adjust path if needed

// Mockup a basic Colors constant if needed for styles, or rely on Jest setup
// jest.mock('@/constants/Colors', () => ({
//   Colors: {
//     dark: {
//       text: '#ffffff',
//       primary: '#aaaaaa',
//       card: '#333333'
//     }
//   }
// }));
// jest.mock('@/constants/Spacing', () => ({
//     Spacing: {
//         xs: 2, sm: 4, md: 8, lg: 16, xl: 24, xxl: 32
//     }
// }));

describe('<MessageItem />', () => {
  const baseMockMessage: ChatMessage = {
    id: 'msg1',
    conversationId: 'conv1',
    text: 'Hello there!',
    timestamp: '11:45 AM',
    sender: {
      id: 'user2',
      name: 'Alice',
      avatarUrl: 'https://example.com/alice.png',
    },
  };

  it('renders correctly for a received message', () => {
    const mockReceived: ChatMessage = { ...baseMockMessage };

    render(<MessageItem message={mockReceived} isCurrentUser={false} />);

    // Check sender name is visible
    expect(screen.getByText('Alice')).toBeTruthy();
    // Check message text is visible
    expect(screen.getByText('Hello there!')).toBeTruthy();
    // Check timestamp is visible (both sent and received render it now)
    expect(screen.getByText('11:45 AM')).toBeTruthy();
    // Check Avatar is potentially rendered (we don't test image source easily)
    // We could test its presence by accessibility label if added, or test wrapper styles.
  });

  it('renders correctly for a sent message', () => {
    const mockSent: ChatMessage = {
      ...baseMockMessage,
      id: 'msg2',
      text: 'Hi Alice!',
      timestamp: '11:46 AM',
      sender: {
        id: 'user1',
        name: 'CurrentUser', // Name shouldn't be displayed
        avatarUrl: 'https://example.com/me.png',
      },
    };

    render(<MessageItem message={mockSent} isCurrentUser={true} />);

    // Check message text is visible
    expect(screen.getByText('Hi Alice!')).toBeTruthy();
    // Check sender name is NOT visible
    expect(screen.queryByText('CurrentUser')).toBeNull();
    // Check timestamp is visible (both sent and received render it now)
    expect(screen.getByText('11:46 AM')).toBeTruthy();
    // Check Avatar is NOT rendered for sent messages (based on component structure)
  });
}); 