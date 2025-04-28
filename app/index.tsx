import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext'; // Assuming standard context path
import { ActivityIndicator, View } from 'react-native'; // For loading state

export default function RootIndex() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log(`[app/index.tsx] Auth State: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    // Optional: Add styling for the loading container
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}> 
        <ActivityIndicator size="large" color="#FFFFFF"/>
      </View>
    );
  }

  // If loading is finished and user is authenticated, redirect to tabs (Homescreen)
  if (isAuthenticated) {
    // TODO: Redirect to home screen or wherever is appropriate
    // console.log('[app/index.tsx] Redirecting to / (tabs)');
    return <Redirect href="/(tabs)" />;
  } else {
    // User is not authenticated or token is missing
    // console.log('[app/index.tsx] Redirecting to /login');
    return <Redirect href="/login" />;
  }
} 