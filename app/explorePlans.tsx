import React, { useState, useCallback } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  Image, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View,
  RefreshControl,
  useWindowDimensions
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { usePlans } from '@/hooks/api/useHomeScreenData';
import { Plan } from '@/types/data';

export default function ExplorePlansScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { data: plans, isLoading, error, refetch } = usePlans();
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Filter options
  const filterOptions = ['All', 'Trending', 'New', 'Weekend', 'Nightlife'];

  // Filter and search logic
  const filteredPlans = React.useMemo(() => {
    if (!plans) return [];
    
    let result = [...plans];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(plan => 
        plan.title.toLowerCase().includes(query) ||
        plan.location.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedFilter && selectedFilter !== 'All') {
      // This is mock filtering based on category
      // In a real app, plans would have category properties
      result = result.filter(plan => 
        // Simple mock implementation - just using the first letter of the plan title
        // In a real app, you'd filter based on actual categories
        plan.title.charAt(0).toLowerCase() === selectedFilter.charAt(0).toLowerCase()
      );
    }
    
    return result;
  }, [plans, searchQuery, selectedFilter]);

  // Render a single plan card
  const renderPlanCard = ({ item }: { item: Plan }) => (
    <TouchableOpacity 
      style={styles.planCard} 
      onPress={() => router.push({ pathname: '/planDetail', params: { planId: item.id } })}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x200' }} 
        style={styles.planImage} 
      />
      <View style={styles.planContent}>
        <ThemedText style={styles.planTitle}>{item.title}</ThemedText>
        <View style={styles.planDetails}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#777" />
            <ThemedText style={styles.detailText}>{item.location}</ThemedText>
          </View>
          {item.host && (
            <View style={styles.hostContainer}>
              <Ionicons name="person-outline" size={14} color="#777" />
              <ThemedText style={styles.detailText}>{item.host}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9370DB" />
      </ThemedView>
    );
  }

  // Error state
  if (error && !plans) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={32} color="#FF6347" />
        <ThemedText style={styles.errorText}>
          Could not load plans. Please try again.
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: 'Explore Plans',
          headerShown: true,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#9370DB" />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plans..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#777" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Categories */}
      <FlatList
        horizontal
        data={filterOptions}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === item ? styles.selectedFilterButton : null
            ]}
            onPress={() => setSelectedFilter(item === 'All' ? null : item)}
          >
            <ThemedText 
              style={[
                styles.filterText,
                selectedFilter === item ? styles.selectedFilterText : null
              ]}
            >
              {item}
            </ThemedText>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      />

      {/* Plans List */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlanCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.plansListContainer}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="search-outline" size={48} color="#9370DB" />
            <ThemedText style={styles.emptyStateText}>
              No plans found for "{searchQuery}"
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Try a different search or filter
            </ThemedText>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9370DB']}
            tintColor="#9370DB"
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedFilterButton: {
    backgroundColor: '#9370DB',
  },
  filterText: {
    fontSize: 14,
    color: '#777',
  },
  selectedFilterText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  plansListContainer: {
    paddingBottom: 24,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  planImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  planContent: {
    padding: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#9370DB',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
}); 