import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Use for padding if needed

// Define the structure for options
interface Option {
    key: string;
    label: string;
    icon: keyof typeof Feather.glyphMap; // Type safety for icon names
    color?: string; // Optional color override (for Leave Group)
    action: () => void;
}

export default function ChatOptionsScreen() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const router = useRouter();

    // --- Option Handlers ---
    const handleOptionPress = (label: string) => {
        // Placeholder for action
        // console.log(`Tapped ${label} for chat: ${chatId}`);
        // Example: Navigate or show confirmation
        router.back(); // Close the modal for now
    };

    const options: Option[] = [
        {
            key: 'details',
            label: 'Group Details',
            icon: 'info',
            action: () => handleOptionPress('Group Details'),
        },
        {
            key: 'clear',
            label: 'Clear Chat',
            icon: 'trash-2',
            action: () => handleOptionPress('Clear Chat'),
        },
        {
            key: 'report',
            label: 'Report Group',
            icon: 'flag',
            action: () => handleOptionPress('Report Group'),
        },
        {
            key: 'leave',
            label: 'Leave Group',
            icon: 'log-out', // Using log-out as a common 'leave' icon
            color: '#FF3B30', // Red color for leave
            action: () => handleOptionPress('Leave Group'),
        },
    ];

    return (
        <View style={styles.modalContainer}>
            {/* Configure Stack Screen options */}
            <Stack.Screen
                options={{
                    presentation: 'modal',
                    headerShown: false,
                }}
            />

            {/* Grab Handle */}
            <View style={styles.grabHandle} />

            {/* Options List */}
            {options.map((option, index) => (
                <Pressable
                    key={option.key}
                    onPress={option.action}
                    style={({ pressed }) => [
                        styles.optionRow,
                        { borderBottomWidth: index === options.length - 1 ? 0 : 1 }, // No border on last item
                        pressed && styles.optionRowPressed, // Optional pressed state style
                    ]}
                >
                    <Feather
                        name={option.icon}
                        size={22}
                        color={option.color || '#FFFFFF'} // Use override color or default white
                        style={styles.optionIcon}
                    />
                    <Text style={[styles.optionText, { color: option.color || '#FFFFFF' }]}>
                        {option.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Take up available space in modal presentation
        backgroundColor: '#1E1E1E', // Dark background
        paddingHorizontal: 15,
        paddingTop: 5, // Small padding at the very top before grab handle
        borderTopLeftRadius: 20, // Rounded top corners
        borderTopRightRadius: 20,
    },
    grabHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#888', // Grey color for handle
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20, // Space below handle
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18, // Vertical padding for touch area and spacing
        borderBottomColor: '#333', // Separator color
    },
    optionRowPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight highlight on press
    },
    optionIcon: {
        marginRight: 15, // Space between icon and text
    },
    optionText: {
        fontSize: 16,
        // Default color is set inline based on option.color
    },
}); 