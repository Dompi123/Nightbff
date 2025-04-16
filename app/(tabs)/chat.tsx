import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

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

export default function ChatScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Navigate to conversation when a chat item is tapped
  const handleChatPress = (chatId: string) => {
    // Use direct string navigation
    router.navigate(`conversation/${chatId}` as any);
  };

  // Render a single chat item
  const renderChatItem = ({ item }: { item: ChatItem }) => {
    // Verify if the avatar URL is valid, if not use a placeholder color
    const avatarIsValid = item.avatar && item.avatar.startsWith('http');
    
    return (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
      accessibilityLabel={`Chat with ${item.name}, last message: ${item.lastMessage}, ${item.time} ago${item.unread ? ', unread' : ''}`}
      accessibilityRole="button"
    >
      {avatarIsValid ? (
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.chatAvatar}
          defaultSource={{ uri: 'https://via.placeholder.com/56/333333/FFFFFF?text=' + item.name.charAt(0) }}
          onError={() => console.log(`Failed to load avatar for: ${item.name}`)}
        />
      ) : (
        <View style={[styles.chatAvatar, styles.placeholderAvatar]}>
          <ThemedText style={styles.placeholderText}>{item.name.charAt(0)}</ThemedText>
      </View>
      )}
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <ThemedText style={styles.chatName}>{item.name}</ThemedText>
          <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
        </View>
        
        <View style={styles.chatFooter}>
          <ThemedText 
            style={[
              styles.chatMessage, 
              item.unread ? styles.unreadMessage : null
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </ThemedText>
          
          {item.unread && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      {/* App Header - Using the same approach as home screen */}
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

      <View style={styles.container}>
        {/* Search Bar */}
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

        {/* Chat List */}
        <FlatList
          data={MOCK_CHATS}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
        />
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
});
