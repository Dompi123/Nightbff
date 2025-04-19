import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useConversationMessages } from '@/hooks/api/useConversationMessages';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';
// Assume mockService exists and has the getMessages function
// We'll use local mock data for now.
// import * as mockService from '../../services/mockService';

// Define a simple Message type based on description
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string; // Keep as string for simplicity
  avatarUrl: string;
  // isCurrentUser: boolean; // This can be determined by comparing senderId
}

// Define interface for Chat Header Info
interface ChatHeaderInfo {
  name: string;
  imageUrl: string;
  isGroupChat: boolean;
  memberCount?: number; // Added optional member count
}

// --- Mock Data (Replace with actual service call later) ---
// Mock function to get chat header info
const getMockChatHeaderInfo = async (chatId: string): Promise<ChatHeaderInfo> => {
  console.log(`Fetching header info for chat ${chatId}...`);
  await new Promise(res => setTimeout(res, 300)); // Simulate network delay
  // Example logic: return different info based on chatId
  if (chatId === 'chat1') {
    return { name: 'Alice', imageUrl: 'https://i.pravatar.cc/150?img=1', isGroupChat: false }; // No member count for 1:1
  } else if (chatId === 'chat2') {
    return { name: 'Work Group', imageUrl: 'https://i.pravatar.cc/150?img=5', isGroupChat: true, memberCount: 8 };
  } else {
    return { name: `Chat ${chatId}`, imageUrl: 'https://i.pravatar.cc/150?img=10', isGroupChat: false, memberCount: 5 }; // Example group
  }
};

// Mock function to simulate sending a message
const mockSendMessage = async (chatId: string, messageText: string): Promise<Message> => {
  console.log(`Simulating send message for chat ${chatId}: ${messageText}`);
  await new Promise(res => setTimeout(res, 200)); // Simulate network delay

  // In a real scenario, the backend would assign the ID and timestamp
  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    text: messageText,
    senderId: 'user_001', // Assume current user ID
    senderName: 'You', // Assume current user name
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatarUrl: 'https://i.pravatar.cc/150?img=32', // Current user avatar
  };
  // Simulate potential failure
  // if (Math.random() < 0.1) { throw new Error("Simulated network error"); }
  return newMessage;
};

// const MOCK_MESSAGES: Message[] = [ ... ]; // Remove MOCK_MESSAGES array if no longer needed

// MessageItem Component
const MessageItem: React.FC<{ message: Message; isCurrentUser: boolean }> = React.memo(({ message, isCurrentUser }) => {
  // Basic styling, adjust colors/fonts based on actual theme later
  const bubbleStyle = isCurrentUser ? styles.sentBubble : styles.receivedBubble;
  const textStyle = isCurrentUser ? styles.sentText : styles.receivedText;
  const containerStyle = isCurrentUser ? styles.sentContainer : styles.receivedContainer;

  if (isCurrentUser) {
    // Layout for sent messages (right-aligned)
    return (
      <View style={containerStyle}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
          {/* Optionally add timestamp for sent messages too */}
          {/* <Text style={styles.timestamp}>{message.timestamp}</Text> */}
        </View>
      </View>
    );
  }

  // Layout for received messages
  return (
    <View style={containerStyle}>
      <Image source={{ uri: message.avatarUrl }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
        </View>
      </View>
    </View>
  );
});

// --- Custom Header Component ---
interface ChatCustomHeaderProps {
    info: ChatHeaderInfo | null;
    onBackPress: () => void;
    onOptionsPress: () => void;
}

const ChatCustomHeader: React.FC<ChatCustomHeaderProps> = ({ info, onBackPress, onOptionsPress }) => {
    return (
        <View style={styles.customHeaderBar}>
            {/* Back Button */}
            <Pressable onPress={onBackPress} style={styles.headerButton}>
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </Pressable>

            {/* Center Content: Avatar + Text */}
            <View style={styles.headerCenterContainer}>
                {info ? (
                    <>
                        <Image source={{ uri: info.imageUrl }} style={styles.headerImage} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerName} numberOfLines={1}>{info.name}</Text>
                            {info.memberCount && (
                                <Text style={styles.memberCountText}>{`${info.memberCount} members`}</Text>
                            )}
                        </View>
                    </>
                ) : (
                    // Placeholder/Loader for center content
                    <ActivityIndicator size="small" color="#FFFFFF" />
                )}
            </View>

            {/* Options Button */}
            <Pressable onPress={onOptionsPress} style={styles.headerButton}>
                <Feather name="more-horizontal" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
};
// --- End Custom Header Component ---

export default function BasicConversationScreen() {
  const { chatId: rawChatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();

  // Ensure chatId is a string before using it
  const chatId = typeof rawChatId === 'string' ? rawChatId : '';

  // --- State Hooks ---
  const [inputText, setInputText] = React.useState('');
  const [headerInfo, setHeaderInfo] = useState<ChatHeaderInfo | null>(null);
  const [isSending, setIsSending] = useState(false);

  // --- Data Fetching Hook ---
  const { 
      messages,
      isLoading: messagesLoading,
      error: messagesError,
  } = useConversationMessages(chatId);

  // Assuming user ID 'user_001' is the current user for demo purposes
  const currentUserId = 'user_001';

  // --- Fetch Header Info (Still using local effect for now) ---
  useEffect(() => {
      const fetchHeader = async () => {
          if (chatId) {
              try {
                  const fetchedHeaderInfo = await getMockChatHeaderInfo(chatId);
                  setHeaderInfo(fetchedHeaderInfo);
              } catch (error) {
                  console.error("Failed to fetch header info:", error);
                  // Handle header fetch error if needed
              }
          }
      };
      fetchHeader();
  }, [chatId]);

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || isSending || !chatId) return;

    setIsSending(true);
    console.log(`Attempting to send message for chat ${chatId}: ${textToSend}`);

    try {
      // Call the mock service
      const sentMessage = await mockSendMessage(chatId, textToSend);

      setInputText('');

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // --- Custom Header Handlers ---
  const handleBackPress = () => {
      router.back();
  };
  const handleOptionsPress = () => {
    console.log('Opening chat options for:', chatId);
    if (chatId) {
        router.push(`/chat/options/${chatId}` as any);
    } else {
        console.warn("Cannot open options, chatId is missing.");
    }
  };
  // --- End Custom Header Handlers ---

  // --- Render Logic Helper ---
  const renderMessageList = () => {
      if (messagesLoading) {
          return <LoadingIndicator />;
      }

      if (messagesError) {
          return <ErrorView error={messagesError as Error} />;
      }

      return (
          <FlatList
              style={styles.messageListArea}
              data={messages}
              renderItem={({ item }) => { // Assuming item type is implicitly ChatMessage from hook
                  const isCurrentUser = item.sender?.id === currentUserId; 
                  const messageProps = {
                      id: item.id,
                      text: item.text,
                      senderId: item.sender?.id || 'unknown',
                      senderName: item.sender?.name || 'Unknown',
                      timestamp: item.timestamp,
                      avatarUrl: item.sender?.avatarUrl || 'https://via.placeholder.com/150'
                  };
                  return (
                      <MessageItem
                          message={messageProps}
                          isCurrentUser={isCurrentUser}
                      />
                  );
              }}
              keyExtractor={(item) => item.id}
              inverted
              contentContainerStyle={styles.flatListContent}
          />
      );
  };

  return (
    <SafeAreaViewRN style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ChatCustomHeader
          info={headerInfo}
          onBackPress={handleBackPress}
          onOptionsPress={handleOptionsPress}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {renderMessageList()}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              (!inputText.trim() || isSending || pressed) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <Feather name="send" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaViewRN>
  );
}

const CUSTOM_HEADER_HEIGHT = 60; // Define header height constant

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
      marginTop: 10,
      color: '#ccc'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageListArea: {
    flex: 1,
  },
  flatListContent: {
      paddingHorizontal: 10,
      paddingBottom: 10,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#333',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  receivedContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
    paddingRight: '20%',
  },
  sentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    paddingLeft: '20%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageContent: {
    flexShrink: 1,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 13,
    color: '#A970FF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  receivedBubble: {
    backgroundColor: '#3A3A3A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  sentBubble: {
    backgroundColor: '#A970FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    alignSelf: 'flex-end',
    maxWidth: '100%',
  },
  receivedText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  sentText: {
      fontSize: 15,
      color: '#FFFFFF',
      lineHeight: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A970FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#5d3d8c',
    opacity: 0.7,
  },
  customHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: CUSTOM_HEADER_HEIGHT,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
      padding: 5,
  },
  headerCenterContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: 10,
      overflow: 'hidden',
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    resizeMode: 'cover',
  },
  headerTextContainer: { 
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberCountText: { 
      fontSize: 13,
      color: '#ccc',
      marginTop: 2,
  },
}); 