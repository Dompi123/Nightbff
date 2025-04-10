import React from 'react';
import { 
  ActivityIndicator, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Share 
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { usePlanDetails } from '@/hooks/api/useHomeScreenData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { data: plan, isLoading, error, refetch } = usePlanDetails(planId);

  // Handle share button press
  const handleShare = async () => {
    if (!plan) return;
    
    try {
      await Share.share({
        message: `Check out this awesome plan: ${plan.title} at ${plan.location}`,
        // In a real app, you would include a deep link to the plan
        url: `https://nightbff.example.com/plans/${plan.id}`
      });
    } catch (error) {
      console.error('Error sharing plan:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9370DB" />
      </ThemedView>
    );
  }

  // Error state
  if (error || !plan) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={32} color="#FF6347" />
        <ThemedText style={styles.errorText}>
          Could not load plan details. Please try again.
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 16 }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: plan.imageUrl || 'https://via.placeholder.com/800x400' }} 
            style={styles.heroImage} 
          />
          
          {/* Floating Back Button */}
          <TouchableOpacity 
            style={[styles.floatingBackButton, { top: insets.top + 8 }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          {/* Floating Share Button */}
          <TouchableOpacity 
            style={[styles.floatingShareButton, { top: insets.top + 8 }]} 
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Plan Details Content */}
        <ThemedView style={styles.detailsContainer}>
          <ThemedText style={styles.planTitle}>{plan.title}</ThemedText>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#777" />
            <ThemedText style={styles.locationText}>{plan.location}</ThemedText>
          </View>
          
          {plan.host && (
            <View style={styles.hostContainer}>
              <Ionicons name="person-outline" size={16} color="#777" />
              <ThemedText style={styles.hostText}>Hosted by {plan.host}</ThemedText>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <ThemedText style={styles.descriptionTitle}>About this Plan</ThemedText>
          <ThemedText style={styles.descriptionText}>
            {plan.description || "No description available for this plan yet. Stay tuned for updates!"}
          </ThemedText>
          
          <View style={styles.divider} />
          
          {/* Plan Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={24} color="#9370DB" />
              <ThemedText style={styles.detailItemTitle}>Date</ThemedText>
              <ThemedText style={styles.detailItemText}>Coming Soon</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={24} color="#9370DB" />
              <ThemedText style={styles.detailItemTitle}>Time</ThemedText>
              <ThemedText style={styles.detailItemText}>TBD</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={24} color="#9370DB" />
              <ThemedText style={styles.detailItemTitle}>Attendees</ThemedText>
              <ThemedText style={styles.detailItemText}>0 Going</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={24} color="#9370DB" />
              <ThemedText style={styles.detailItemTitle}>Price</ThemedText>
              <ThemedText style={styles.detailItemText}>Free</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
      
      {/* Fixed Bottom Action Button */}
      <View style={[styles.bottomActionContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionButtonText}>Join This Plan</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  floatingBackButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingShareButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for the fixed bottom action button
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#777',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#777',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  detailItem: {
    width: '50%',
    paddingVertical: 12,
    paddingRight: 16,
    alignItems: 'flex-start',
  },
  detailItemTitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    marginBottom: 2,
  },
  detailItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    backgroundColor: '#9370DB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9370DB',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#9370DB',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 