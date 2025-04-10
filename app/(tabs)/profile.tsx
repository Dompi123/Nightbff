import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <View style={styles.appHeader}>
        <ThemedText style={styles.appTitleText}>Profile</ThemedText>
      </View>

      <ThemedView style={styles.container}>
        <ScrollView>
          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <ThemedText style={styles.profileImageText}>👤</ThemedText>
            </View>
            <ThemedText style={styles.profileName}>User Name</ThemedText>
            <ThemedText style={styles.profileInfo}>@username</ThemedText>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Friends</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Events</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Photos</ThemedText>
            </View>
          </View>

          <View style={styles.menuSection}>
            <View style={styles.menuItem}>
              <ThemedText style={styles.menuText}>Settings</ThemedText>
            </View>
            <View style={styles.menuItem}>
              <ThemedText style={styles.menuText}>Your Events</ThemedText>
            </View>
            <View style={styles.menuItem}>
              <ThemedText style={styles.menuText}>Saved Places</ThemedText>
            </View>
            <View style={styles.menuItem}>
              <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  appHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 22,
    backgroundColor: '#151718',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#a970ff',
    letterSpacing: 0.5,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#504080',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 16,
    color: '#888',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#27272a',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#27272a',
  },
  menuText: {
    fontSize: 16,
  },
});

