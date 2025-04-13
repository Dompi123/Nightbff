import { Tabs } from 'expo-router';
import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import CreateOptionsSheetContent from '@/screens/create/CreateOptionsSheetContent';

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

  // Create ref for the bottom sheet modal
  const createOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  
  // useCallback for closing the sheet
  const handleCloseSheet = useCallback(() => {
    createOptionsBottomSheetRef.current?.dismiss();
  }, []);

  // useCallback for presenting the sheet
  const presentCreateOptions = useCallback(() => {
    createOptionsBottomSheetRef.current?.present();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].primary,
          tabBarStyle: {
            backgroundColor: palette.background,
            borderTopColor: Colors[colorScheme].border,
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
                onPress={presentCreateOptions}
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

      {/* Bottom sheet for create options - positioned here to render above tabs */}
      <BottomSheetModal
        ref={createOptionsBottomSheetRef}
        index={0}
        snapPoints={['30%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: palette.secondary }}
        backgroundStyle={{ backgroundColor: palette.card }}
      >
        <CreateOptionsSheetContent handleClose={handleCloseSheet} />
      </BottomSheetModal>
    </>
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
