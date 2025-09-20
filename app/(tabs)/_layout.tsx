import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { palette } from '@/theme/colors';

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
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: palette.primary,
          tabBarStyle: {
            backgroundColor: palette.background,
            borderTopColor: palette.border,
            height: 82,
            paddingBottom: 20,
            paddingTop: 10,
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
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="add" color={color} />,
            tabBarButton: () => (
              <TouchableOpacity
                onPress={(e) => {
                  e.preventDefault(); // Prevent default tab behavior
                  router.push('/createGroup');
                }}
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: palette.primary,
                  borderRadius: 28,
                  position: 'absolute',
                  top: -15,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5,
                }}
              >
                <Ionicons name="add" size={28} color="white" />
              </TouchableOpacity>
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
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
