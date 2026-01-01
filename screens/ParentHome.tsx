import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Animated,
  useColorScheme,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Mocking the Primary Color to match the likely Tailwind configuration (Indigo/Blue)
const COLORS = {
  primary: '#4F46E5',
  primaryLight: 'rgba(79, 70, 229, 0.1)',
  white: '#FFFFFF',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  emerald500: '#10B981',
  pink500: '#EC4899',
  pinkLight: 'rgba(236, 72, 153, 0.2)',
};

const { width } = Dimensions.get('window');

const ParentHome = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Basic theme helpers
  const bgStyle = isDarkMode ? styles.bgDark : styles.bgLight;
  const textStyle = isDarkMode ? styles.textWhite : styles.textSlate900;
  const cardBg = isDarkMode ? styles.cardBgDark : styles.cardBgLight;
  const borderStyle = isDarkMode ? styles.borderDark : styles.borderLight;

  useEffect(() => {
    // Simple pulse animation for the live dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, borderStyle]}>
        <View style={styles.headerContent}>
          <View style={styles.logoIcon}>
            <MaterialIcons name="family-restroom" size={24} color={COLORS.primary} />
          </View>
          <Text style={[styles.headerTitle, textStyle]}>SafeRoute 360</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={[styles.card, cardBg, borderStyle, styles.shadow]}>
          {/* Decorative Corner */}
          <View style={styles.decorativeCorner} />
          
          <View style={styles.statusHeader}>
            <View style={styles.liveBadge}>
              <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveText}>LIVE TRACKING</Text>
            </View>
            
            <View style={styles.timeContainer}>
              <Text style={[styles.timeText, textStyle]}>7:42</Text>
              <Text style={styles.amPmText}>AM</Text>
            </View>
            
            <Text style={styles.arrivalText}>
              Arriving in <Text style={styles.highlightText}>4 mins</Text>
            </Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <View style={styles.row}>
                <MaterialIcons name="directions-bus" size={14} color={COLORS.slate400} />
                <Text style={styles.labelText}> Bus #42</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>Home </Text>
                <MaterialIcons name="location-on" size={14} color={COLORS.primary} />
              </View>
            </View>
            
            <View style={[styles.progressBarBg, isDarkMode ? { backgroundColor: COLORS.slate700 } : { backgroundColor: COLORS.slate200 }]}>
              <View style={[styles.progressBarFill, { width: '85%' }]} />
            </View>
            
            <Text style={styles.distanceText}>0.8 MILES AWAY</Text>
          </View>
        </View>

        {/* Map Widget */}
        <View style={[styles.mapContainer, borderStyle, styles.shadow]}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQn2vuNHbMPVeRgJBf4NZ4WNs-IexNMeXzG1i8GGjzrKZDFuhNYIUYAeo339ol_l2dH8zLA_GM1XNHAoHvFC5mQp-dR4vTu0N0O1WsQMCHC63o9NbnGC_eYk8_A-F8vuBuhpz8bkRn6IRnVfdn54AmR1JJeHpLSxqdBUTstSo8qjVnc3Kx7AxQGr-yK24frDiRAhO6WoAxuRAc8yjzSSdM0UIYmz0dlfSUbBpmDnZzDRn8AuVkc1gG4aLXGCqR--FvvSO7vBqjpGg' }}
            style={[styles.mapImage, isDarkMode && { opacity: 0.6 }]} // mimic brightness filter
            resizeMode="cover"
          />
          <View style={styles.mapOverlay}>
             <View style={styles.mapPinContainer}>
                <View style={styles.pingEffect} />
                <View style={[styles.mapPin, isDarkMode ? { borderColor: COLORS.slate800 } : { borderColor: COLORS.white }]}>
                   <MaterialIcons name="directions-bus" size={24} color={COLORS.white} />
                </View>
             </View>
          </View>
        </View>

        {/* Child Status */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Attendance')}
          style={[styles.statusItem, cardBg, borderStyle, styles.shadowSm]}
          activeOpacity={0.7}
        >
           <View style={styles.row}>
              <View style={styles.avatar}>
                 <Text style={styles.avatarText}>L</Text>
              </View>
              <View style={{ marginLeft: 16 }}>
                 <Text style={[styles.childName, textStyle]}>Leo's Status</Text>
                 <Text style={styles.childStatus}>Waiting at stop</Text>
              </View>
           </View>
           <View style={styles.row}>
              <Text style={styles.historyLabel}>History</Text>
              <MaterialIcons name="chevron-right" size={20} color={COLORS.slate400} />
           </View>
        </TouchableOpacity>

        {/* Full History Button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Attendance')}
          style={[styles.historyButton, isDarkMode ? { backgroundColor: 'rgba(255,255,255,0.05)' } : { backgroundColor: COLORS.white }, borderStyle, styles.shadowSm]}
        >
           <MaterialIcons name="history" size={20} color={COLORS.slate400} />
           <Text style={[styles.historyButtonText, isDarkMode ? styles.textWhite : styles.textSlate700]}>View Full History</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, borderStyle, isDarkMode ? { backgroundColor: COLORS.slate900 } : { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
         <NavItem icon="map" label="Live Map" active />
         <NavItem icon="history" label="History" onPress={() => navigation.navigate('Attendance')} />
         <NavItem icon="settings" label="Settings" />
      </View>
    </SafeAreaView>
  );
};

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
     <MaterialIcons name={icon} size={28} color={active ? COLORS.primary : COLORS.slate400} />
     <Text style={[styles.navLabel, { color: active ? COLORS.primary : COLORS.slate400 }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: { backgroundColor: COLORS.slate50 },
  bgDark: { backgroundColor: COLORS.slate900 },
  textWhite: { color: COLORS.white },
  textSlate900: { color: COLORS.slate900 },
  textSlate700: { color: COLORS.slate700 },
  
  cardBgLight: { backgroundColor: COLORS.white },
  cardBgDark: { backgroundColor: 'rgba(30, 41, 59, 0.4)' },
  
  borderLight: { borderColor: COLORS.slate200, borderWidth: 1 },
  borderDark: { borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.01)', // Glass placeholder
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 24,
  },

  // Status Card
  card: {
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: COLORS.primaryLight,
    borderBottomLeftRadius: 128,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emerald500,
    marginRight: 8,
  },
  liveText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 60,
    fontWeight: '800',
    lineHeight: 70,
    fontVariant: ['tabular-nums'],
  },
  amPmText: {
    fontSize: 24,
    color: COLORS.slate400,
    marginTop: 12,
    marginLeft: 4,
  },
  arrivalText: {
    fontSize: 18,
    color: COLORS.slate500,
    fontWeight: '500',
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  // Progress Bar Area
  progressSection: {
    gap: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  distanceText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.slate400,
    letterSpacing: 1,
  },

  // Map Widget
  mapContainer: {
    height: 192,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingEffect: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
  },
  mapPin: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },

  // Child Status Item
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.pinkLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.pink500,
    fontWeight: 'bold',
    fontSize: 18,
  },
  childName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  childStatus: {
    fontSize: 12,
    color: COLORS.slate500,
  },
  historyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.slate400,
    marginRight: 4,
  },

  // History Button
  historyButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  historyButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderWidth: 0, // Override generic border logic for top only
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Generic Shadows
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ParentHome;