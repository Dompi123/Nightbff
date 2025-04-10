import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PaywallScreen from '@/screens/paywall/PaywallScreen';

// Use relative path for useColorScheme to avoid module resolution issues
import { useColorScheme } from '../src/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

function RootNavigation() {
  const { isAuthenticated, isLoading, userToken, user } = useAuth();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Add detailed debug logging
  useEffect(() => {
    console.log('[Navigation] Auth state updated:', { 
      isAuthenticated, 
      isLoading,
      userToken: userToken ? 'exists' : 'null',
      user: user ? `${user.name} (${user.email})` : 'null'
    });
  }, [isAuthenticated, isLoading, userToken, user]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isLoading) {
    // Show a loading indicator while fonts load or auth state is resolving
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9370DB" />
        <Text style={{ marginTop: 10, color: 'gray' }}>
          {isLoading ? 'Checking authentication...' : 'Loading fonts...'}
        </Text>
      </View>
    );
  }

  // For more explicit handling
  if (isAuthenticated) {
    console.log('[Navigation] User is authenticated - showing app screens');
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="explorePlans" />
          <Stack.Screen name="planDetail" />
          <Stack.Screen 
            name="paywall" 
            options={{ 
              presentation: 'fullScreenModal', 
              headerShown: false,
              contentStyle: { backgroundColor: '#121212' }
            }} 
          />
          <Stack.Screen 
            name="popularGroupDetail" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
          <Stack.Screen name="login" redirect />
          <Stack.Screen name="signup" redirect />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  } else {
    console.log('[Navigation] User is NOT authenticated - showing auth screens');
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="login"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" redirect />
          <Stack.Screen name="explorePlans" redirect />
          <Stack.Screen name="planDetail" redirect />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </AuthProvider>
  );
}
