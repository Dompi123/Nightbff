// Placeholder for app/exploreGroups.tsx
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  // SafeAreaView, // Remove import from react-native
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import from safe-area-context
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { palette } from '@/theme/colors'; // Adjust path if needed
import { spacing } from '@/theme/spacing'; // Adjust path if needed
import { useExploreGroups } from '@/hooks/api/useExploreGroups'; // Adjust path if needed
import ExploreGroupCard from '@/components/groups/ExploreGroupCard'; // Adjust path if needed

// Filter tabs - Adapt categories as needed for NightBFF
const filterTabs = [
  { key: 'trending', label: '🔥 Trending' },
  { key: 'new', label: '👋 New' },
  // Add country flags or relevant nightlife categories
  { key: '🇪🇸', label: '🇪🇸 Spain' }, 
  { key: '🇮🇹', label: '🇮🇹 Italy' },
  { key: '🇬🇧', label: '🇬🇧 UK' },
  { key: '🇺🇸', label: '🇺🇸 USA' },
  { key: 'nearby', label: '📍 Nearby' }, 
];

export default function ExploreGroupsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('trending'); // Default active filter
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query
  
  // Fetch data using the hook, passing the active filter
  const { data: groups, isLoading, error, refetch } = useExploreGroups(activeFilter);

  // Memoized filtered data for search
  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (!searchQuery) return groups; // No query, return all
    
    return groups.filter(group => 
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  const handleGroupPress = (groupId: string) => {
    // Navigate to the detail screen (ensure this route exists)
    // router.push(`/groupDetail/${groupId}`); // Example route
    console.log("Navigate to group:", groupId);
    // Example navigation: Needs route defined in _layout.tsx
    router.push(`/popularGroupDetail/${groupId}`); 
  };

  const handleFilterPress = (filterKey: string) => {
    setActiveFilter(filterKey);
    // Note: useExploreGroups hook will automatically refetch when filterKey changes
  };

  return (
    // Use edges to avoid safe area inset at the top, header handles it
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      
      {/* Screen Title (Below Header) */}
      <ThemedText style={styles.screenTitle}>Explore Groups</ThemedText>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={palette.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search All Plans" // Adjusted placeholder
          placeholderTextColor={palette.textSecondary}
          value={searchQuery} // Bind value to state
          onChangeText={setSearchQuery} // Update state on change
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, activeFilter === tab.key && styles.activeFilterTab]}
              onPress={() => handleFilterPress(tab.key)}
            >
              <ThemedText style={[styles.filterText, activeFilter === tab.key && styles.activeFilterText]}>
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area (Loading/Error/List) */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={palette.primary} style={{ marginTop: 50 }} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText>Error loading groups.</ThemedText>
            <ThemedText>{error.message}</ThemedText>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredGroups} // Use filtered data
            renderItem={({ item }) => (
              <ExploreGroupCard 
                item={item} 
                onPress={handleGroupPress} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => ( // Show message if search yields no results
              <View style={styles.emptyListContainer}>
                <ThemedText style={styles.emptyListText}>No groups found matching your search.</ThemedText>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenTitle: {
    fontSize: 28, // Larger title like reference
    fontWeight: 'bold',
    marginTop: spacing.lg, // Increased top margin to clear header
    marginBottom: spacing.md,
    marginHorizontal: spacing.md, // Align with content padding
    color: palette.text, // Ensure correct theme color
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.cardBackground, 
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg, // More space below search
    paddingHorizontal: spacing.md,
    height: 44, 
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: palette.text,
    height: '100%',
  },
  filterContainer: {
    paddingLeft: spacing.md, 
    marginBottom: spacing.lg,
  },
  filterScrollContent: {
    paddingRight: spacing.md, 
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: 20, 
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: palette.primary, 
  },
  filterText: {
    fontSize: 16,
    color: palette.textSecondary, 
  },
  activeFilterText: {
    color: palette.primary, 
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1, // Ensure list container takes remaining space
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Space at bottom
  },
  emptyListContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyListText: {
    color: palette.textSecondary,
    fontSize: 16,
  },
}); 