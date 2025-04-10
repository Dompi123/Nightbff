import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

function MapTabIcon({ color }: { color: string }) {
  return (
    <View style={{ position: 'relative' }}>
      <TabBarIcon name="location-outline" color={color} />
      <View 
        style={{ 
          position: 'absolute', 
          right: -2, 
          top: -2, 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: 'red' 
        }} 
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  
  // Get the colors from the current theme
  const palette = Colors[colorScheme];
  
  // Get the primary color for the create button based on the current color scheme
  const primaryColor = Colors[colorScheme].primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: Colors[colorScheme].border,
          height: 90,
          paddingBottom: 15,
          paddingTop: 15,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapTabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <View style={styles.plusButtonContainer}>
              <View 
                style={[
                  styles.plusButton,
                  { backgroundColor: primaryColor }
                ]}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabBarIcon name="chatbubble-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
