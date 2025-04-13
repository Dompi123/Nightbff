import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExploreGroupCardData } from '@/types/data'; // Adjust path if needed
import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors'; // Adjust path if needed
import { spacing } from '@/theme/spacing'; // Adjust path if needed
import { format } from 'date-fns'; // For date formatting

interface ExploreGroupCardProps {
  item: ExploreGroupCardData;
  onPress?: (id: string) => void;
}

// Helper to format dates (adjust format as needed)
const formatDateRange = (start: string, end: string) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Example: Apr 13 - May 28
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  } catch (e) {
    return `${start} - ${end}`; // Fallback
  }
};

const ExploreGroupCard: React.FC<ExploreGroupCardProps> = ({ item, onPress }) => {
  const attendeeLimit = 3; // Max avatars to show
  const displayedAvatars = item.attendeeAvatars.slice(0, attendeeLimit);
  const remainingCount = Math.max(0, item.attendeeCount - displayedAvatars.length);

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.8}
    >
      {/* Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      
      {/* Text Content */}
      <View style={styles.textContent}>
        <ThemedText style={styles.title} numberOfLines={2}>{item.title}</ThemedText>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={palette.textSecondary} style={styles.icon} />
          <ThemedText style={styles.detailText}>{formatDateRange(item.startDate, item.endDate)}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          {/* Using Text for flag emoji ensures consistent display */}
          <Text style={styles.flag}>{item.locationFlag}</Text>
          <ThemedText style={styles.detailText}>{item.location}</ThemedText>
        </View>
        
        {/* Attendees */}
        <View style={styles.attendeeRow}>
          <View style={styles.avatarStack}>
            {displayedAvatars.map((avatarUrl, index) => (
              <Image 
                key={index} 
                source={{ uri: avatarUrl }}
                style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]} // Overlap
              />
            ))}
          </View>
          {item.attendeeCount > 0 && (
             <View style={styles.attendeeCountBadge}>
                <ThemedText style={styles.attendeeCountText}>
                    {`${item.attendeeCount}+ Traveler${item.attendeeCount !== 1 ? 's' : ''}`}
                </ThemedText>
             </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: palette.cardBackground,
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden', // Ensures image corners are clipped
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android
  },
  cardImage: {
    width: 110, // Fixed width for image
    height: '100%', // Take full height of card (determined by text content)
    minHeight: 130, // Ensure a minimum height
    resizeMode: 'cover',
  },
  textContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  flag: {
    fontSize: 14, // Adjust emoji size if needed
    marginRight: spacing.xs,
  },
  detailText: {
    fontSize: 13,
    color: palette.textSecondary,
    flexShrink: 1, // Allow text to shrink if needed
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm, // Space above attendees
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.background, // Border color matching card background for overlap effect
  },
  attendeeCountBadge: {
    marginLeft: spacing.sm,
    backgroundColor: palette.background, // Slightly different background
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
  },
  attendeeCountText: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: '500',
  },
});

export default ExploreGroupCard; 