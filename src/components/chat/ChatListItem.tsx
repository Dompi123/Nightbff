import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChatConversation } from '@/types/data'; // Assuming type path

interface ChatListItemProps {
    conversation: ChatConversation;
}

// Simple time formatting (replace with more robust library like date-fns if needed)
const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return '';
    // Assuming timestamp is already a simple string like "10:30 AM" or "Yesterday"
    // In a real app, parse ISO string or Date object here
    return timestamp;
};

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/conversation/[chatId]',
            params: { chatId: conversation.id },
        });
    };

    // Determine image source - Adjusting based on lint error
    const imageSource = conversation.groupImageUrl
        ? conversation.groupImageUrl
        // Assuming participants is array like [{ avatarUrl: string }, ...]
        : conversation.participants && conversation.participants.length > 0 && conversation.participants[0].avatarUrl 
        ? conversation.participants[0].avatarUrl
        : 'https://via.placeholder.com/50'; // Default placeholder

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            accessibilityLabel={`Chat with ${conversation.title}`}
            accessibilityRole="button"
        >
            <Image source={{ uri: imageSource }} style={styles.avatar} />
            <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{conversation.title}</Text><Text style={styles.timestamp}>{formatTimestamp(conversation.lastMessage?.timestamp)}</Text>
                </View>
                <View style={styles.messageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {conversation.lastMessage?.text || ''}
                    </Text>{conversation.unreadCount && conversation.unreadCount > 0 ? (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{String(conversation.unreadCount)}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#1E1E1E', // Match theme background
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333', // Subtle separator
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flexShrink: 1, // Allow title to shrink if timestamp is long
        marginRight: 5,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginLeft: 'auto', // Push timestamp to the right
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: '#ccc',
        flexShrink: 1, // Allow message to shrink if badge is present
        marginRight: 5,
    },
    unreadBadge: {
        backgroundColor: '#A970FF', // Theme primary color
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 'auto', // Push badge to the right
    },
    unreadCount: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ChatListItem; 