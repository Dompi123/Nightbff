import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ChatMessage } from '@/types/data'; // Assuming type path is correct relative to components/
import { Colors } from '@/constants/Colors'; // Import colors
import { Spacing } from '../../../constants/Spacing'; // Using relative path

interface MessageItemProps {
    message: ChatMessage;
    isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(({ message, isCurrentUser }) => {
    const bubbleStyle = isCurrentUser ? styles.sentBubble : styles.receivedBubble;
    const textStyle = isCurrentUser ? styles.sentText : styles.receivedText;
    const containerStyle = isCurrentUser ? styles.sentContainer : styles.receivedContainer;

    // Common Timestamp component
    const Timestamp = () => (
        <Text style={styles.timestamp}>{message.timestamp}</Text>
    );

    if (isCurrentUser) {
        // Layout for sent messages (right-aligned)
        return (
            <View style={containerStyle}>
                <View style={bubbleStyle}>
                    <Text style={textStyle}>{message.text}</Text>
                    {/* Optionally add timestamp for sent messages too - Keep consistent for tests */}
                    <Timestamp />
                </View>
            </View>
        );
    }

    // Layout for received messages
    return (
        <View style={containerStyle}>
            <Image source={{ uri: message.sender.avatarUrl || 'https://via.placeholder.com/40' }} style={styles.avatar} />
            <View style={styles.messageContent}>
                <View style={styles.senderInfo}>
                    <Text style={styles.senderName}>{message.sender.name}</Text>
                    <Timestamp />
                </View>
                <View style={bubbleStyle}>
                    <Text style={textStyle}>{message.text}</Text>
                </View>
            </View>
        </View>
    );
});

// Define styles using constants (adjust names/values based on your actual constants)
const styles = StyleSheet.create({
    sentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
    },
    receivedContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
    },
    sentBubble: {
        backgroundColor: Colors.dark.primary, // Sent bubble color
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: 15,
        maxWidth: '80%',
        borderBottomRightRadius: 2,
    },
    receivedBubble: {
        backgroundColor: Colors.dark.card, // Received bubble color
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: 15,
        maxWidth: '80%',
        borderBottomLeftRadius: 2,
    },
    sentText: {
        color: Colors.dark.text, // Sent text color
        fontSize: 15,
    },
    receivedText: {
        color: Colors.dark.text, // Received text color
        fontSize: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: Spacing.sm,
        alignSelf: 'flex-end', // Align avatar to bottom of received message area
    },
    messageContent: {
        flexDirection: 'column',
    },
    senderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs, // Use xs instead of xxs
    },
    senderName: {
        color: Colors.dark.text, // Use standard text color
        fontSize: 12,
        fontWeight: '500',
        marginRight: Spacing.sm,
    },
    timestamp: {
        color: Colors.dark.text, // Use standard text color
        fontSize: 11,
    },
});

export default MessageItem; 