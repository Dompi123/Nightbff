import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConversationMessages } from '@/hooks/api/useConversationMessages';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatMessage } from '@/types/data';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuth } from '@/contexts/AuthContext';
import { fetchConversationDetails } from '@/services/api/mockService';

// Add this constant at the top of the file, outside the component
const HEADER_HEIGHT = 100; // Estimated header height including status bar

export default function ConversationScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useConversationMessages(chatId);
  const [messageText, setMessageText] = useState('');
  const [conversationDetails, setConversationDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = user?.id || 'user_001'; // Fallback to test user if not logged in
  
  // Fetch conversation details for the header
  useEffect(() => {
    const loadConversationDetails = async () => {
      if (chatId) {
        try {
          const details = await fetchConversationDetails(chatId);
          setConversationDetails(details);
          
          // Update the header with conversation title and participant count
          router.setParams({
            title: details?.title || 'Chat',
            participantCount: details?.participants?.length || 0,
          });
        } catch (error) {
          console.error('Error fetching conversation details:', error);
        } finally {
          setLoadingDetails(false);
        }
      }
    };
    
    loadConversationDetails();
  }, [chatId, router]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim().length === 0) return;
    
    sendMessage({
      text: messageText.trim(),
    });
    
    setMessageText('');
  };

  // Check if a message should show sender info (based on previous message)
  const shouldShowSenderInfo = (message: ChatMessage, index: number): boolean => {
    if (index === messages.length - 1) return true; // Always show for the first message (last in reversed list)
    
    const nextMessage = messages[index + 1];
    return nextMessage.sender.id !== message.sender.id;
  };
  
  // Render a message item in the FlatList
  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isSender = item.sender.id === currentUserId;
    const showSenderInfo = shouldShowSenderInfo(item, index);
    
    return (
      <MessageBubble
        message={item}
        isSender={isSender}
        showSenderInfo={showSenderInfo}
        onQuotePress={(messageId) => {
          // Could implement scrolling to quoted message
          console.log('Navigate to quoted message:', messageId);
        }}
      />
    );
  };

  if (isLoading || loadingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? HEADER_HEIGHT : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messagesContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type something..."
            placeholderTextColor={palette.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            textAlignVertical="center"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={messageText.trim().length === 0}
          >
            <Ionicons
              name="paper-plane"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: palette.background,
    marginBottom: spacing.xs,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: palette.cardBackground,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    padding: spacing.sm,
    color: palette.text,
    fontSize: 16,
    textAlignVertical: 'center',
    ...(Platform.OS === 'ios' ? {
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    } : {}),
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
}); 