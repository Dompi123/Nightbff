import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

// Plans data
const plans = [
  { id: 'weekly', name: '1 Week', price: '$9.99', recommended: false },
  { id: 'monthly', name: '1 Month', price: '$24.99', recommended: true },
];

// Features list
const features = [
  'Unlock unlimited map access',
  'See all nearby users',
  'Premium profile badge',
  'Priority event access',
  'Ad-free experience',
  'Custom itinerary suggestions',
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('weekly');
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  const handlePurchase = () => {
    // In a real app, this would initiate the purchase flow
    console.log('Starting purchase for plan:', selectedPlan);
    // Mock successful purchase and return
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  // Calculate bottom padding for safe area
  const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 20;

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['bottom', 'left', 'right']} // Handle all edges except top, which we'll handle manually
    >
      {/* Fixed top content */}
      {/* Close button */}
      <TouchableOpacity 
        style={[styles.closeButton, { top: insets.top + 16 }]} 
        onPress={handleClose}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Header area with proper spacing */}
      <View style={[styles.headerContainer, { marginTop: insets.top + 60 }]}>
        {/* Title */}
        <ThemedText style={styles.title}>
          See all nearby nighterz with NightBFF Pro
        </ThemedText>
      </View>

      {/* Plan selection */}
      <View style={styles.plansContainer}>
        {plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlan,
              plan.recommended && styles.recommendedPlan
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.recommended && (
              <View style={styles.recommendedTag}>
                <ThemedText style={styles.recommendedText}>Best Value</ThemedText>
              </View>
            )}
            <ThemedText style={styles.planName}>{plan.name}</ThemedText>
            <ThemedText style={styles.planPrice}>{plan.price}</ThemedText>
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                selectedPlan === plan.id && styles.radioOuterSelected
              ]}>
                {selectedPlan === plan.id && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable content (features) */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]} // Reduced padding to account for smaller bottom container
        showsVerticalScrollIndicator={false}
      >
        {/* Features */}
        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>NightBFF Pro includes:</ThemedText>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <FontAwesome5 name="check-circle" size={16} color="#a970ff" />
              <ThemedText style={styles.featureText}>{feature}</ThemedText>
            </View>
          ))}
        </View>

        {/* Terms - moved to scrollable area */}
        <ThemedText style={styles.termsText}>
          Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscription in your Account Settings.
        </ThemedText>
      </ScrollView>

      {/* Fixed bottom content */}
      <View style={[styles.bottomContainer, { paddingBottom: bottomPadding }]}>
        {/* Fine print text */}
        <ThemedText style={styles.recurringText}>
          Recurring billing for the same price and duration. Cancel Anytime.
        </ThemedText>
        
        {/* Terms & Privacy link */}
        <TouchableOpacity>
          <ThemedText style={styles.termsLink}>
            Terms & Privacy Policy
          </ThemedText>
        </TouchableOpacity>
        
        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handlePurchase}>
          <ThemedText style={styles.ctaButtonText}>See All Nighterz Now 👋</ThemedText>
        </TouchableOpacity>

        {/* Price note */}
        <ThemedText style={styles.priceNote}>
          $6.99 per week
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#121212', // Dark theme background
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 38, // Better for multiline text
    marginHorizontal: 20,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    position: 'relative',
    minHeight: 120,
  },
  selectedPlan: {
    borderColor: '#a970ff',
    backgroundColor: 'rgba(169, 112, 255, 0.1)',
  },
  recommendedPlan: {
    borderColor: '#a970ff',
  },
  recommendedTag: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#a970ff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioContainer: {
    marginTop: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#a970ff',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a970ff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Increased for better spacing
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    marginBottom: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212', // Match container background
    paddingTop: 8, // Reduced from 15
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  recurringText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAA',
    marginBottom: 3, // Reduced from 5
  },
  termsLink: {
    textAlign: 'center',
    fontSize: 12,
    color: '#a970ff',
    marginBottom: 8, // Reduced from 15
    textDecorationLine: 'underline',
  },
  ctaButton: {
    backgroundColor: '#a970ff', // Changed from blue to purple
    paddingVertical: 14, // Slightly reduced from 16
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10, // Reduced from 15
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceNote: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 3, // Reduced from 5
  },
}); 