import { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, TextInput, ScrollView, Pressable } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useNearbyUsers } from '../../src/hooks/api/useHomeScreenData';
import { UserLocation, MapRegion } from '../../src/types/data';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { unstable_batchedUpdates } from 'react-native';
import { UserMarker } from '../../src/components/map/UserMarker';
import { NearbyUserCard } from '../../src/components/map/NearbyUserCard';
import { useNavigation } from '@react-navigation/native';

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

// Improved helper function to validate region data
const isValidRegion = (region: any): boolean => {
  try {
    return (
      region &&
      typeof region.latitude === 'number' &&
      typeof region.longitude === 'number' &&
      typeof region.latitudeDelta === 'number' &&
      typeof region.longitudeDelta === 'number' &&
      !isNaN(region.latitude) &&
      !isNaN(region.longitude) &&
      !isNaN(region.latitudeDelta) &&
      !isNaN(region.longitudeDelta) &&
      Math.abs(region.latitude) <= 90 &&
      Math.abs(region.longitude) <= 180 &&
      region.latitudeDelta > 0 &&
      region.longitudeDelta > 0
    );
  } catch (error) {
    console.error("Error validating region:", error);
    return false;
  }
};

// Helper to validate user location data
const isValidUserLocation = (user: any): boolean => {
  try {
    return (
      user &&
      user.location &&
      typeof user.location.latitude === 'number' &&
      typeof user.location.longitude === 'number' &&
      !isNaN(user.location.latitude) &&
      !isNaN(user.location.longitude) &&
      Math.abs(user.location.latitude) <= 90 &&
      Math.abs(user.location.longitude) <= 180
    );
  } catch (error) {
    console.error("Error validating user location:", error);
    return false;
  }
};

// Default location constants
const DEFAULT_LOCATION = {
  latitude: 44.648764,
  longitude: -63.575239,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Constants for free tier experience
const FREE_TIER = {
  MAX_USERS_DISPLAYED: 3,
  BLUR_AMOUNT: 30,
};

export default function MapScreen() {
  const navigation = useNavigation();
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const regionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [mapKey, setMapKey] = useState(1); // Used to force re-render if needed

  // Get nearby users from React Query hook with null check for mapRegion
  // Only pass valid region data to the hook
  const { 
    data: nearbyUsers = [], 
    isLoading, 
    error,
    refetch
  } = useNearbyUsers(isValidRegion(mapRegion) ? mapRegion : null);
  
  // Log when data fetching status changes
  useEffect(() => {
    console.log(`MapScreen: Data fetching status - isLoading: ${isLoading}, error: ${error ? 'yes' : 'no'}, users: ${nearbyUsers?.length || 0}`);
  }, [isLoading, error, nearbyUsers]);

  // Request location permissions and set initial map region
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      console.log('MapScreen: Initializing location services');
      setIsFetchingLocation(true);
      
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;
        
        if (status !== 'granted') {
          console.log('MapScreen: Location permission denied, using default location');
          setErrorMsg('Permission to access location was denied');
          
          // Set default location
          setUserLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
          });
          
          setMapRegion(DEFAULT_LOCATION);
          setIsFetchingLocation(false);
          return;
        }

        // Get current location with timeout
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        // Set a timeout for getting location
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Location request timed out')), 10000);
        });
        
        // Use the first to resolve/reject
        const location = await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
        if (!isMounted) return;
        
        console.log('MapScreen: Location obtained successfully', {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
        
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        const newRegion = {
          ...userCoords,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        
        // Validate coordinates before setting state
        if (Math.abs(userCoords.latitude) <= 90 && Math.abs(userCoords.longitude) <= 180) {
          unstable_batchedUpdates(() => {
            setUserLocation(userCoords);
            setMapRegion(newRegion);
            setIsFetchingLocation(false);
          });
        } else {
          throw new Error('Invalid coordinates received from location services');
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('MapScreen: Error getting location:', error);
        setErrorMsg('Error getting location. Using default.');
        
        // Use default location
        unstable_batchedUpdates(() => {
          setUserLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
          });
          setMapRegion(DEFAULT_LOCATION);
          setIsFetchingLocation(false);
        });
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter valid user markers
  const validUsers = useCallback(() => {
    if (!nearbyUsers || !Array.isArray(nearbyUsers)) {
      console.log('MapScreen: No nearby users data available or invalid format');
      return [];
    }
    
    return nearbyUsers.filter(user => isValidUserLocation(user));
  }, [nearbyUsers]);

  // Get limited users for free tier
  const limitedUsers = useCallback(() => {
    return validUsers().slice(0, FREE_TIER.MAX_USERS_DISPLAYED);
  }, [validUsers]);

  // Navigate to paywall screen
  const navigateToPaywall = useCallback(() => {
    console.log('Navigating to paywall screen');
    // @ts-ignore - Ignore type error for simplicity
    navigation.navigate('paywall');
  }, [navigation]);

  // Handle map ready event
  const handleMapReady = useCallback(() => {
    console.log('MapScreen: Map is ready');
    setIsMapReady(true);
  }, []);

  // Render the UI with proper error handling
  return (
    <ThemedView style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          {/* Map View - Static for free tier */}
          {mapRegion && isValidRegion(mapRegion) && (
            <View style={styles.mapWrapper}>
              <MapView
                key={`map-view-${mapKey}`}
                ref={mapRef}
                style={styles.map}
                region={mapRegion}
                customMapStyle={darkMapStyle}
                onMapReady={handleMapReady}
                minDelta={0.001}
                maxDelta={1.5}
                // Disable interactions for free tier
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                showsPointsOfInterest={false}
                showsBuildings={false}
                showsTraffic={false}
                showsIndoors={false}
              >
                {/* User location marker */}
                {userLocation && (
                  <Marker
                    key="user-location-marker"
                    coordinate={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    title="You"
                    description="Your current location"
                    tracksViewChanges={false}
                  >
                    <UserMarker
                      profileImage=""
                      isCurrentUser={true}
                    />
                  </Marker>
                )}
                
                {/* Nearby users markers - Limited to 3 for free tier */}
                {!isFetchingLocation && isMapReady && validUsers().map((user) => (
                  <Marker
                    key={`user-marker-${user.id}`}
                    coordinate={{
                      latitude: user.location.latitude,
                      longitude: user.location.longitude,
                    }}
                    title={user.name}
                    description={`${user.distance} miles away`}
                    onPress={() => setSelectedUser(user)}
                    tracksViewChanges={false}
                  >
                    <UserMarker
                      profileImage={user.profileImage}
                      isOnline={user.isOnline}
                      blurAmount={FREE_TIER.BLUR_AMOUNT}
                    />
                  </Marker>
                ))}
              </MapView>

              {/* Clickable overlay that navigates to paywall */}
              <Pressable 
                style={styles.mapOverlay} 
                onPress={navigateToPaywall}
              />
            </View>
          )}
          
          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Halifax, Canada"
                placeholderTextColor="#777"
              />
            </View>
          </View>
          
          {/* Loading Overlay - Show on top of the map */}
          {isLoading && mapRegion && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#a970ff" />
              <ThemedText style={styles.loadingText}>Finding people nearby...</ThemedText>
            </View>
          )}

          {/* Initial Loading - Only display when map isn't ready yet */}
          {isFetchingLocation && (
            <View style={styles.initialLoadingContainer}>
              <ActivityIndicator size="large" color="#a970ff" />
              <ThemedText style={styles.loadingText}>Loading map...</ThemedText>
            </View>
          )}

          {/* Free tier indicator */}
          <View style={styles.freeTierBadge}>
            <ThemedText style={styles.freeTierText}>Free Tier</ThemedText>
          </View>

          {/* Bottom Sheet Preview - Limited for free tier */}
          {!isLoading && !isFetchingLocation && validUsers().length > 0 && !selectedUser && (
            <View style={styles.bottomSheetPreview}>
              <View style={styles.bottomSheetHandle} />
              <View style={styles.bottomSheetHeader}>
                <ThemedText style={styles.bottomSheetTitle}>
                  {validUsers().length} Nearby Travelers
                </ThemedText>
                <TouchableOpacity 
                  style={styles.seeAllButton}
                  onPress={navigateToPaywall}
                >
                  <ThemedText style={styles.seeAllText}>See All</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color="#a970ff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.userCardsContainer}
              >
                {limitedUsers().map(user => (
                  <NearbyUserCard 
                    key={`user-card-${user.id}`}
                    user={user}
                    onPress={() => setSelectedUser(user)}
                  />
                ))}
                
                {/* "See more" card for additional users */}
                {validUsers().length > FREE_TIER.MAX_USERS_DISPLAYED && (
                  <TouchableOpacity 
                    style={styles.seeMoreCard}
                    onPress={navigateToPaywall}
                  >
                    <ThemedText style={styles.seeMoreText}>
                      See more
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}

          {/* User card popup */}
          {selectedUser && isValidUserLocation(selectedUser) && (
            <View style={styles.userCard}>
              <Image 
                source={{ uri: selectedUser.profileImage }} 
                style={styles.userCardImage} 
                defaultSource={require('../../assets/images/default-avatar.png')}
              />
              <View style={styles.userCardInfo}>
                <View style={styles.userCardHeader}>
                  <ThemedText style={styles.userCardName}>{selectedUser.name}</ThemedText>
                  {selectedUser.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <ThemedText style={styles.userCardDistance}>{selectedUser.distance} away</ThemedText>
                <View style={styles.userCardActions}>
                  <TouchableOpacity style={styles.userCardButton} onPress={navigateToPaywall}>
                    <MaterialIcons name="chat" size={18} color="white" />
                    <ThemedText style={styles.userCardButtonText}>Message</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.userCardCloseButton}
                    onPress={() => setSelectedUser(null)}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  searchBarContainer: {
    position: 'absolute',
    top: 60, // Adjusted to match reference image
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  initialLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  bottomSheetPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 18, 19, 0.92)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#666',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#a970ff',
    fontWeight: '500',
  },
  userCardsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  seeMoreCard: {
    width: 70,
    height: 150,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'rgba(169, 112, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(169, 112, 255, 0.3)',
  },
  seeMoreText: {
    fontSize: 13,
    color: '#a970ff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#27272a',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  userCardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  userCardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  userCardDistance: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  userCardActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  userCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f94ef',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  userCardButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  userCardCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeTierBadge: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'rgba(169, 112, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  freeTierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4f94ef',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 