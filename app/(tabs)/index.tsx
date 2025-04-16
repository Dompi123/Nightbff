import { Image, StyleSheet, TextInput, TouchableOpacity, View, ScrollView, Text, ImageBackground, FlatList } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTrendingPlans, useHotspots, useInterests, useNightlifeGroups, useBffsYouMayLike, useNearbyGroup } from '@/hooks/api/useHomeScreenData';
import { AvatarStack } from '@/components/home/AvatarStack';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProp } from '@react-navigation/native';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';

// Filter categories for nightlife
const FILTER_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'clubs', label: '🎶 Clubs' },
  { id: 'bars', label: '🍻 Bars' },
  { id: 'rooftops', label: '✨ Rooftops' },
  { id: 'lounges', label: '🛋️ Lounges' },
  { id: 'events', label: '🎭 Events' },
];

// Destinations mock data for top section
const DESTINATIONS = [
  {
    id: 'dest1',
    name: 'Miami',
    imageUrl: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Vibrant nightlife',
  },
  {
    id: 'dest2',
    name: 'Las Vegas',
    imageUrl: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    description: 'Never sleeps',
  },
  {
    id: 'dest3',
    name: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'City lights',
  },
  {
    id: 'dest4',
    name: 'Los Angeles',
    imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Trendsetting clubs',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Fetch data using hooks with isError and error states
  const { data: trendingPlans, isLoading: plansLoading, isError: plansError, error: plansErrorData } = useTrendingPlans();
  const { data: nightlifeGroups, isLoading: groupsLoading, isError: groupsError, error: groupsErrorData } = useNightlifeGroups();
  const { data: interests, isLoading: interestsLoading, isError: interestsError, error: interestsErrorData } = useInterests();
  // Add new data hooks
  const { data: bffs, isLoading: bffsLoading, isError: bffsError, error: bffsErrorData } = useBffsYouMayLike();
  const { data: nearbyGroup, isLoading: nearbyGroupLoading, isError: nearbyGroupError, error: nearbyGroupErrorData } = useNearbyGroup();

  // Filter selection handler
  const handleFilterSelect = useCallback((filterId: string) => {
    setSelectedFilter(filterId);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.appTitleContainer}>
          <ThemedText style={styles.appTitleText}>NightBFF</ThemedText>
          <View style={styles.appIconContainer}>
            <Text style={{ fontSize: 22 }}>🎉</Text>
          </View>
        </View>
        <TouchableOpacity 
          accessibilityLabel="View profile"
          accessibilityRole="button"
        >
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=32' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <ThemedView style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities, venues..."
            placeholderTextColor="#777"
            accessibilityLabel="Search cities, venues"
          />
        </ThemedView>

        {/* Horizontal filter chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTER_CATEGORIES.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.filterChip,
                selectedFilter === category.id && styles.filterChipSelected
              ]}
              onPress={() => handleFilterSelect(category.id)}
              accessibilityLabel={`Filter by ${category.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedFilter === category.id }}
            >
              <ThemedText 
                style={[
                  styles.filterText,
                  selectedFilter === category.id && styles.filterTextSelected
                ]}
              >
                {category.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Nightlife Plans Section with subtitle */}
        <View style={styles.sectionHeaderContainer}>
          <View>
          <ThemedText style={styles.sectionTitle}>Trending Nightlife Plans</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>popular among bffs 📈</ThemedText>
          </View>
        </View>
        
        {plansLoading ? (
          <LoadingIndicator />
        ) : plansError ? (
          <ErrorView error={plansErrorData} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansContainer}
          >
            {trendingPlans?.map((plan) => (
              <TouchableOpacity 
                key={plan.id} 
                style={styles.planCard}
                onPress={() => router.push(`/locationDetail/${plan.location}`)}
                accessibilityLabel={`View ${plan.title} plan`}
                accessibilityRole="button"
              >
                <ImageBackground
                  source={{ uri: plan.imageUrl }}
                  style={styles.planImage}
                  imageStyle={styles.planImageStyle}
                >
                  <View style={styles.planGradient}>
                    <ThemedText style={styles.planTitle}>{plan.title}</ThemedText>
                    <View style={styles.planDateContainer}>
                      <ThemedText style={styles.planDate}>{plan.subtitle}</ThemedText>
                    </View>
                    
                    <View style={styles.planAvatarContainer}>
                      <AvatarStack 
                        avatars={plan.userAvatars || []}
                        count={plan.userCount || plan.count}
                        size={22}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Popular Groups Section */}
        <View style={styles.sectionHeaderContainer}>
          <ThemedText style={styles.sectionTitle}>Popular Groups</ThemedText>
          <TouchableOpacity 
            onPress={() => router.push('/exploreGroups')}
            accessibilityLabel="View all popular groups"
            accessibilityRole="button"
          >
            <ThemedText style={styles.seeAllText}>View all</ThemedText>
          </TouchableOpacity>
        </View>
        
        {groupsLoading ? (
          <LoadingIndicator />
        ) : groupsError ? (
          <ErrorView error={groupsErrorData} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsContainer}
          >
            {nightlifeGroups?.map((group) => (
              <TouchableOpacity 
                key={group.id} 
                style={styles.groupCard}
                onPress={() => router.push(`/popularGroupDetail/${group.id}`)}
                accessibilityLabel={`View ${group.title} group in ${group.location}`}
                accessibilityRole="button"
              >
                <Image
                  source={{ uri: group.imageUrl }}
                  style={styles.groupImage}
                />
                <View style={styles.groupContent}>
                  <View style={styles.groupLocation}>
                    <Text style={styles.locationFlag}>{group.locationFlag}</Text>
                    <ThemedText style={styles.locationName}>{group.location}</ThemedText>
                    </View>
                  <ThemedText style={styles.groupDate}>{group.dateRange}</ThemedText>
                  <ThemedText style={styles.groupTitle}>{group.title}</ThemedText>
                  
                  <View style={styles.groupAttendees}>
                    <AvatarStack 
                      avatars={group.userAvatars}
                      count={group.attendeeCount}
                      size={20}
                    />
                    <ThemedText style={styles.attendeeText}>
                      {group.attendeeCount} travelers
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* BFFs You May Like Section (replacing Find Experiences) */}
        <View style={styles.sectionHeaderContainer}>
          <ThemedText style={styles.sectionTitle}>BFFs You May Like</ThemedText>
        </View>
          
        {bffsLoading ? (
          <LoadingIndicator />
        ) : bffsError ? (
          <ErrorView error={bffsErrorData} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bffsContainer}
          >
            {bffs?.map((bff) => (
              <TouchableOpacity 
                key={bff.id} 
                style={styles.bffCard}
                onPress={() => router.push(`/bffProfileDetail/${bff.id}`)}
                accessibilityLabel={`View ${bff.name}'s profile, ${bff.age} years old`}
                accessibilityRole="button"
              >
                <ImageBackground
                  source={{ uri: bff.avatarUrl }}
                  style={styles.bffImage}
                  imageStyle={styles.bffImageStyle}
                >
                  <View style={styles.bffGradient}>
                    <View style={styles.bffInfo}>
                      <View style={styles.bffNameRow}>
                        <ThemedText style={styles.bffName}>{bff.name}</ThemedText>
                        <View style={[styles.onlineIndicator, { backgroundColor: bff.isOnline ? '#44d62c' : '#aaa' }]} />
                      </View>
                      <ThemedText style={styles.bffAge}>{bff.age} years old</ThemedText>
                      {bff.countryFlag && (
                        <Text style={styles.bffCountryFlag}>{bff.countryFlag}</Text>
                      )}
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Nearby Groups Section (new section) */}
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.headerWithTag}>
            <ThemedText style={styles.sectionTitle}>Nearby Groups</ThemedText>
            <View style={styles.newTag}>
              <ThemedText style={styles.newTagText}>NEW</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/exploreGroups')}
            accessibilityLabel="See more nearby groups"
            accessibilityRole="button"
          >
            <ThemedText style={styles.seeAllText}>See more</ThemedText>
          </TouchableOpacity>
        </View>
        
        {nearbyGroupLoading ? (
          <LoadingIndicator />
        ) : nearbyGroupError ? (
          <ErrorView error={nearbyGroupErrorData} />
        ) : nearbyGroup && (
          <TouchableOpacity 
            style={styles.nearbyGroupCard} 
            onPress={() => router.push(`/group/${nearbyGroup.id}`)}
            accessibilityLabel={`View ${nearbyGroup.title} nearby group in ${nearbyGroup.location}`}
            accessibilityRole="button"
          >
            <Image
              source={{ uri: nearbyGroup.imageUrl }}
              style={styles.nearbyGroupImage}
              resizeMode="cover"
              onError={() => console.log('Failed to load image for nearby group')}
            />
            <View style={styles.nearbyGroupContent}>
              <View style={styles.nearbyGroupHeader}>
                <Text style={styles.nearbyGroupFlag}>{nearbyGroup.flag}</Text>
                <ThemedText style={styles.nearbyGroupLocation}>{nearbyGroup.location}</ThemedText>
                <ThemedText style={styles.nearbyGroupDate}>{nearbyGroup.dateRange}</ThemedText>
              </View>
              <ThemedText style={styles.nearbyGroupTitle}>{nearbyGroup.title}</ThemedText>
              
              <View style={styles.nearbyGroupMembers}>
                <AvatarStack 
                  avatars={nearbyGroup.userAvatars}
                  count={nearbyGroup.memberCount}
                  size={20}
                />
                <ThemedText style={styles.memberCountText}>
                  {nearbyGroup.memberCount}+ travelers
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {/* Add some bottom padding for the ScrollView */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#151718',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#27272a',
    marginRight: 10,
  },
  filterChipSelected: {
    backgroundColor: '#a970ff',
  },
  filterText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ECEDEE',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9BA1A6',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: '#a970ff',
  },
  
  // Trending Plans section styles
  plansContainer: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  planCard: {
    width: 220,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  planImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  planImageStyle: {
    borderRadius: 12,
  },
  planGradient: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '100%',
    justifyContent: 'space-between',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 'auto',
  },
  planDateContainer: {
    marginTop: 2,
  },
  planDate: {
    fontSize: 14,
    color: '#ddd',
  },
  planAvatarContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  
  // Popular Groups section styles
  groupsContainer: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  groupCard: {
    width: 200,
    backgroundColor: '#27272a',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  groupImage: {
    width: '100%',
    height: 95,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  groupContent: {
    padding: 10,
  },
  groupLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationFlag: {
    fontSize: 14,
    marginRight: 4,
  },
  locationName: {
    fontSize: 12,
    color: '#a970ff',
    fontWeight: '500',
  },
  groupDate: {
    fontSize: 12,
    color: '#9BA1A6',
    marginBottom: 4,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ECEDEE',
    marginBottom: 6,
  },
  groupAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 11,
    color: '#9BA1A6',
    marginLeft: 6,
  },
  
  // BFFs You May Like section styles
  bffsContainer: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  bffCard: {
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  bffImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bffImageStyle: {
    borderRadius: 12,
  },
  bffGradient: {
    padding: 12,
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bffInfo: {
    marginTop: 'auto',
  },
  bffNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  bffAge: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 2,
  },
  bffCountryFlag: {
    fontSize: 16,
    marginTop: 8,
  },
  
  // Nearby Group section styles
  headerWithTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newTag: {
    backgroundColor: '#1a7bff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  newTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  nearbyGroupCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#27272a',
    marginBottom: 20,
  },
  nearbyGroupImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#27272a',
  },
  nearbyGroupContent: {
    padding: 12,
  },
  nearbyGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nearbyGroupFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  nearbyGroupLocation: {
    fontSize: 14,
    color: '#9BA1A6',
    fontWeight: '500',
    marginRight: 12,
  },
  nearbyGroupDate: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  nearbyGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ECEDEE',
    marginBottom: 8,
  },
  nearbyGroupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: 12,
    color: '#9BA1A6',
    marginLeft: 8,
  },
  
  bottomPadding: {
    height: 80,
  },

  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 22,
    marginBottom: 4,
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#a970ff',
    letterSpacing: 0.5,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#303030',
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(169, 112, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
