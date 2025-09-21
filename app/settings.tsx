import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [hideNearbyDistance, setHideNearbyDistance] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('km');

  const handleUnitPress = () => {
    Alert.alert(
      'Select Unit of Measurement',
      '',
      [
        { 
          text: 'Kilometers', 
          onPress: () => {
            setSelectedUnit('km');
            console.log('Kilometers selected');
          }
        },
        { 
          text: 'Miles', 
          onPress: () => {
            setSelectedUnit('mi');
            console.log('Miles selected');
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') }
      ]
    );
  };

  const SettingsRow = ({ 
    title, 
    onPress, 
    rightComponent, 
    textStyle = {} 
  }: { 
    title: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    textStyle?: any;
  }) => (
    <TouchableOpacity 
      style={styles.settingsRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <ThemedText style={[styles.settingsText, textStyle]}>{title}</ThemedText>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {/* First Section */}
        <View style={styles.firstSection}>
          <SettingsRow
            title="Unit of measurement"
            rightComponent={
              <View style={styles.measurementRow}>
                <ThemedText style={styles.measurementText}>{selectedUnit}</ThemedText>
                <Ionicons name="chevron-down" size={16} color={palette.textSecondary} />
              </View>
            }
            onPress={handleUnitPress}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Hide my nearby distance"
            rightComponent={
              <Switch
                value={hideNearbyDistance}
                onValueChange={setHideNearbyDistance}
                trackColor={{ false: '#3A3A3C', true: palette.primary }}
                thumbColor={hideNearbyDistance ? '#FFFFFF' : '#F4F3F4'}
                ios_backgroundColor="#3A3A3C"
              />
            }
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Hide active status"
            rightComponent={
              <View style={styles.proFeatureContainer}>
                <ThemedText style={styles.proFeatureText}>Pro Feature</ThemedText>
              </View>
            }
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Report an issue"
            onPress={() => console.log('Report an issue')}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Leave a review"
            onPress={() => console.log('Leave a review')}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Restore Purchases"
            onPress={() => console.log('Restore purchases')}
          />
        </View>

        {/* Second Section */}
        <View style={styles.section}>
          <SettingsRow
            title="Community Guidelines"
            onPress={() => console.log('Community Guidelines')}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Terms and Conditions"
            onPress={() => console.log('Terms and Conditions')}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Privacy Policy"
            onPress={() => console.log('Privacy Policy')}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Logout"
            onPress={handleLogout}
          />
          
          <View style={styles.divider} />
          
          <SettingsRow
            title="Delete Account"
            onPress={handleDeleteAccount}
            textStyle={styles.deleteText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  firstSection: {
    backgroundColor: palette.cardBackground,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  settingsText: {
    fontSize: 16,
    color: palette.text,
    flex: 1,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementText: {
    fontSize: 16,
    color: palette.textSecondary,
    marginRight: spacing.xs,
  },
  proFeatureContainer: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proFeatureText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginLeft: spacing.md,
  },
  deleteText: {
    color: '#FF4444',
  },
}); 