import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { format } from 'date-fns';
import { ChatMessage } from '@/types/data';

interface MessageBubbleProps {
  message: ChatMessage;
  isSender: boolean;
  showSenderInfo: boolean;
  onQuotePress?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSender,
  showSenderInfo,
  onQuotePress,
}) => {
  // Format the timestamp to display in the bubble
  const formattedTime = message.timestamp
    ? format(new Date(message.timestamp), 'h:mm a')
    : '';

  return (
    <View style={styles.container}>
      {/* Show avatar only for receiver messages when sender info is shown */}
      {!isSender && showSenderInfo && message.sender.avatarUrl && (
        <Image
          source={{ uri: message.sender.avatarUrl }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/40' }}
        />
      )}

      <View
        style={[
          styles.bubbleContainer,
          isSender ? styles.senderBubble : styles.receiverBubble,
          !isSender && !showSenderInfo && styles.receiverBubbleNoAvatar,
        ]}
      >
        {/* Show sender name and timestamp */}
        {showSenderInfo && (
          <View style={styles.senderInfoContainer}>
            {!isSender && (
              <ThemedText style={styles.senderName}>
                {message.sender.name}
              </ThemedText>
            )}
            <ThemedText style={styles.timestamp}>{formattedTime}</ThemedText>
          </View>
        )}

        {/* Quoted message if applicable */}
        {message.quotedMessage && (
          <TouchableOpacity
            style={styles.quotedMessageContainer}
            onPress={() => onQuotePress?.(message.quotedMessage?.id || '')}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.quotedSenderName}>
              {message.quotedMessage.senderName}
            </ThemedText>
            <ThemedText style={styles.quotedMessageText} numberOfLines={2}>
              {message.quotedMessage.text}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Message text */}
        <ThemedText
          style={[
            styles.messageText,
            isSender && styles.senderMessageText,
          ]}
        >
          {message.text}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.xs,
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
  },
  bubbleContainer: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  senderBubble: {
    backgroundColor: palette.primary,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: palette.cardBackground,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    marginLeft: 48, // Space for avatar
  },
  receiverBubbleNoAvatar: {
    marginLeft: 48, // Keep consistent alignment with messages that have avatars
  },
  senderInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.primary,
    marginRight: spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  quotedMessageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: spacing.xs,
    marginBottom: spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
  },
  quotedSenderName: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.primary,
    marginBottom: 2,
  },
  quotedMessageText: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  messageText: {
    fontSize: 16,
    color: palette.text,
  },
  senderMessageText: {
    color: '#ffffff',
  },
}); 