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
import useSendMessage from '@/hooks/api/useSendMessage';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';
import { Colors } from '@/constants/Colors';
import { spacing } from '@/theme/spacing';
import { palette } from '@/theme/colors';
import { ChatMessage } from '@/types/data';

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
                <Feather name="arrow-left" size={26} color="#FFFFFF" />
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
                <Feather name="more-horizontal" size={26} color="#FFFFFF" />
            </Pressable>
        </View>
    );
};
// --- End Custom Header Component ---

// --- Format Timestamp Helper ---
const formatTimestamp = (isoTimestamp: string | undefined): string => {
  if (!isoTimestamp) return '';
  try {
    // Basic time formatting, adjust as needed (e.g., for date, AM/PM)
    return new Date(isoTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch (e) { 
    console.error("Error formatting timestamp:", e);
    return '--:--'; // Fallback for invalid date
  } 
};

// --- Message Item Component ---
interface MessageItemProps {
  message: ChatMessage; // Use ChatMessage type
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  if (isCurrentUser) {
    // --- SENT MESSAGE --- 
    return (
      <View style={styles.sentContainer}>
        <View style={styles.sentBubble}>
          <Text style={styles.sentText}>{message.text}</Text>
        </View>
        <Text style={[styles.timestampBase, styles.timestampSent]}>
          {formatTimestamp(message.timestamp)}
        </Text>
      </View>
    );
  } else {
    // --- RECEIVED MESSAGE --- 
    return (
      <View style={styles.receivedContainer}>
        <Image source={{ uri: message.sender.avatarUrl }} style={styles.avatar} />
        <View style={styles.messageContent}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{message.sender.name}</Text>
          </View>
          <View style={styles.receivedBubble}>
            <Text style={styles.receivedText}>{message.text}</Text>
          </View>
          <Text style={[styles.timestampBase, styles.timestampReceived]}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  }
};
// --- End Message Item Component ---

export default function BasicConversationScreen() {
  const { chatId: rawChatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();

  // Ensure chatId is a string before using it
  const chatId = typeof rawChatId === 'string' ? rawChatId : '';

  // --- State Hooks ---
  const [inputText, setInputText] = React.useState('');
  const [headerInfo, setHeaderInfo] = useState<ChatHeaderInfo | null>(null);

  // --- Data Fetching & Mutation Hooks ---
  const { 
      messages,
      isLoading: messagesLoading,
      error: messagesError,
  } = useConversationMessages(chatId);
  
  // Use the send message mutation hook, passing the chatId
  const { mutate: sendMessageMutate, isPending: isSendingMessage } = useSendMessage({ chatId });

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
              }
          }
      };
      fetchHeader();
  }, [chatId]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    sendMessageMutate({ text: inputText.trim() });
    setInputText('');
  };

  // --- Custom Header Handlers ---
  const handleBackPress = () => {
    router.back();
  };
  const handleOptionsPress = () => {
    // Navigate to chat options screen (replace with actual route)
    router.push(`/conversation/options/${chatId}`); 
    console.log('Options pressed');
  };
  // --- End Custom Header Handlers ---

  // --- Render Logic ---
  const renderMessageList = () => {
    if (messagesLoading) return <LoadingIndicator />;
    if (messagesError) return <ErrorView error={messagesError} />;

    return (
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageItem message={item} isCurrentUser={item.sender.id === currentUserId} />
        )}
        keyExtractor={(item) => item.id}
        inverted // This is crucial for chat UI
        contentContainerStyle={styles.listContentContainer} // Add padding
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaViewRN edges={['top', 'bottom']} style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ChatCustomHeader
          info={headerInfo}
          onBackPress={handleBackPress}
          onOptionsPress={handleOptionsPress}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
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
              (!inputText.trim() || isSendingMessage || pressed) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSendingMessage}
          >
            {isSendingMessage ? (
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

const CUSTOM_HEADER_HEIGHT = 80; // Increased header height

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
    marginBottom: spacing.md,
    alignItems: 'flex-end',
    paddingRight: '20%',
  },
  sentContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingLeft: '20%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageContent: {
    flexShrink: 1,
    alignItems: 'flex-start',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 13,
    color: Colors.dark.primary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  timestamp: {
  },
  receivedBubble: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  sentBubble: {
    backgroundColor: Colors.dark.primary,
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
    height: CUSTOM_HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerButton: {
    padding: 10,
  },
  headerCenterContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: 15,
      overflow: 'hidden',
  },
  headerImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
    resizeMode: 'cover',
  },
  headerTextContainer: { 
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  memberCountText: { 
      fontSize: 15,
      color: '#ccc',
      marginTop: 4,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  timestampBase: { 
    fontSize: 11,
    color: palette.textSecondary,
  },
  timestampSent: { 
    alignSelf: 'flex-end',
    marginRight: 5,
    marginTop: 4,
  },
  timestampReceived: { 
    alignSelf: 'flex-start',
    marginLeft: 38,
    marginTop: 4,
  },
}); 