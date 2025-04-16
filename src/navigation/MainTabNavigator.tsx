import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { MainTabParamList } from '@/types/navigation';

// Import actual screens or placeholders
import { 
  DiscoverMapScreen, 
  CreateScreen, 
  ProfileScreen
} from '@/screens/placeholders/PlaceholderScreen';

// Create placeholder components for missing screens
const HomeScreen = () => <DiscoverMapScreen />;
const ChatScreen = () => <ProfileScreen />;

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'help-circle'; // Default icon

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9370DB', // Example purple color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#1a1a1a' }, // Dark background for tab bar
        headerShown: false, // Hide headers for tab screens, manage in screen components
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverMapScreen} />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen} 
        options={{ tabBarLabel: '' }} // Often the center button has no label
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
