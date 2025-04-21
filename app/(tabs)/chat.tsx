import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Image, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { ChatConversation } from '@/types/data';
import ChatListItem from '@/components/chat/ChatListItem';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';

// Add interface for chat item data
interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

// Update the MOCK_CHATS with the ChatItem type
const MOCK_CHATS: ChatItem[] = [
  {
    id: 'chat1',
    name: 'Tokyo experience',
    avatar: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    lastMessage: 'Welcome to Tokyo experience',
    time: '2h',
    unread: true,
  },
  {
    id: 'chat2',
    name: 'Rio de Janeiro Carnival',
    avatar: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
    lastMessage: 'Olá a todos. Sou um estrangeiro que qu...',
    time: '7h',
    unread: true,
  },
  {
    id: 'chat3',
    name: 'Perth 🇦🇺 ✈️',
    avatar: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71',
    lastMessage: 'Until Saturday 🙏',
    time: '14h',
    unread: true,
  },
  {
    id: 'chat4',
    name: 'guatemala trip 🇬🇹 👢 ⭐',
    avatar: 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be',
    lastMessage: 'Hi, I\'m from Guatemala and I\'ll be backp...',
    time: '1d',
    unread: false,
  },
  {
    id: 'chat5',
    name: 'Weekend in Europe (flexible time)',
    avatar: '',
    lastMessage: 'Hello guys, in 17-21 of April I will be in Am...',
    time: '3d',
    unread: false,
  },
  {
    id: 'chat6',
    name: 'lol',
    avatar: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5',
    lastMessage: 'Welcome to lol',
    time: '1w',
    unread: true,
  },
  {
    id: 'chat7',
    name: 'Mystery trip',
    avatar: 'https://images.unsplash.com/photo-1580851935978-f6b4e359da3f',
    lastMessage: 'Welcome to Mystery trip',
    time: '2w',
    unread: false,
  },
  {
    id: 'chat8',
    name: 'Alex Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastMessage: 'Hey! Are you coming to the party tonight?',
    time: '3w',
    unread: true,
  },
];

// --- Mock Data Fallback ---
const MOCK_CONVERSATIONS: ChatConversation[] = [
    { 
        id: 'chat1', 
        title: 'Alice', 
        isGroupChat: false,
        participants: [{ id: 'user2', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?img=1' }],
        lastMessage: { text: 'See you there!', timestamp: '10:05 AM', senderId: 'user2' }, 
        unreadCount: 0 
    },
    { 
        id: 'chat2', 
        title: 'Work Group', 
        isGroupChat: true,
        groupImageUrl: 'https://i.pravatar.cc/150?img=5', 
        participants: [],
        lastMessage: { text: 'Meeting confirmed for 2 PM.', timestamp: '9:45 AM', senderId: 'user3' }, 
        unreadCount: 3 
    },
    { 
        id: 'chat3', 
        title: 'Bob', 
        isGroupChat: false,
        participants: [{ id: 'user4', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?img=7' }],
        lastMessage: { text: 'Okay, sounds good!', timestamp: 'Yesterday', senderId: 'user4' }, 
        unreadCount: 1 
    },
];
// --- End Mock Data ---

export default function ChatListScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Use local state as fallback since hook wasn't found
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [isLoading, setIsLoading] = useState(false); // Simulate no loading for mock data
  const [error, setError] = useState<Error | null>(null); // Simulate no error

  // Conditional rendering based on state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return <ErrorView error={error as Error} />;
    }

    if (!conversations || conversations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={conversations}
        renderItem={({ item }: { item: ChatConversation }) => {
          return <ChatListItem conversation={item} />;
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        style={styles.list}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <Stack.Screen options={{ title: 'Chats' }} />
      <View style={styles.container}>
        <View style={styles.appHeader}>
          <View style={styles.appTitleContainer}>
            <ThemedText style={styles.appTitleText}>Chats</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.requestsButton}
            accessibilityLabel="Chat requests, 0 pending"
            accessibilityRole="button"
          >
            <ThemedText style={styles.requestsText}>Requests (0)</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colorScheme === 'dark' ? '#9BA1A6' : '#687076'} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
            accessibilityLabel="Search chats"
          />
        </View>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#151718',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 22,
    marginBottom: 4,
    backgroundColor: '#151718',
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#a970ff',
    letterSpacing: 0.5,
  },
  requestsButton: {
    backgroundColor: 'rgba(169, 112, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  requestsText: {
    color: '#a970ff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  chatListContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatTime: {
    fontSize: 14,
    color: '#888',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#888',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#e0e0e0',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a970ff',
  },
  placeholderAvatar: {
    backgroundColor: '#504080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
