import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SOSScreen = () => {
  const navigation = useNavigation();
  const [holding, setHolding] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;
  
  // Animations for ambient pulse effects
  const pingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Simulate CSS 'animate-ping' and 'animate-pulse'
    Animated.loop(
      Animated.parallel([
        Animated.timing(pingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    setHolding(true);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 3000, // 3 seconds to fill
      useNativeDriver: false, // height/width doesn't support native driver
    }).start(({ finished }) => {
      if (finished) {
        // Trigger SOS Action here
        console.log("SOS Triggered!");
      }
    });
  };

  const handlePressOut = () => {
    setHolding(false);
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200, // Snap back quickly
      useNativeDriver: false,
    }).start();
  };

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience (Simulated Blur) */}
      <View style={styles.ambientBackground} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Assistance</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        
        {/* Map Card */}
        <View style={styles.mapCard}>
          <View style={styles.mapImageContainer}>
            <Image 
              source={{ uri: 'https://picsum.photos/seed/map-emergency/400/200' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <View style={styles.pingDot} />
              <Animated.View 
                style={[
                  styles.pingRing, 
                  { 
                    transform: [{ scale: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }],
                    opacity: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.locationInfo}>
            <View>
              <View style={styles.locationLabelRow}>
                <MaterialIcons name="near-me" size={14} color="#ef4444" />
                <Text style={styles.locationLabel}> Current Location</Text>
              </View>
              <Text style={styles.addressText}>124 Main St, Springfield, IL</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>
        </View>

        {/* SOS Button Section */}
        <View style={styles.sosSection}>
          <Text style={styles.instructionText}>Press and hold for 3 seconds</Text>
          
          <View style={styles.sosButtonWrapper}>
            {/* Background Ping Effect */}
            <Animated.View 
              style={[
                styles.sosPing,
                {
                  transform: [{ scale: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
                  opacity: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] })
                }
              ]}
            />
            <View style={styles.sosBorderRing} />
            
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={({ pressed }) => [
                styles.sosButton,
                pressed && { transform: [{ scale: 0.95 }] }
              ]}
            >
              <LinearGradient
                colors={['#ef4444', '#b91c1c']}
                style={styles.sosGradient}
              >
                <Animated.View style={[styles.fillOverlay, { height: fillHeight }]} />
                
                <MaterialIcons name="sos" size={80} color="white" style={styles.sosIcon} />
                <Text style={styles.sosText}>ALERT</Text>
              </LinearGradient>
            </Pressable>
          </View>
          
          <TouchableOpacity>
            <Text style={styles.testAlarmText}>Test Alarm Mode</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Select Emergency Type</Text>
        <View style={styles.grid}>
          <EmergencyType icon="car-repair" label="Breakdown" />
          <EmergencyType icon="car-crash" label="Accident" />
          <EmergencyType icon="medical-services" label="Medical" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const EmergencyType = ({ icon, label }) => (
  <TouchableOpacity style={styles.gridButton}>
    <MaterialIcons name={icon} size={32} color="#64748b" />
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  ambientBackground: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderRadius: width,
    transform: [{ scale: 1.5 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 48,
  },
  mapCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mapImageContainer: {
    height: 112,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    opacity: 0.8,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pingDot: {
    width: 16,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    zIndex: 2,
  },
  pingRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    zIndex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  locationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationLabel: {
    color: '#ef4444',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 10,
  },
  addressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    color: '#34d399',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 9,
  },
  sosSection: {
    alignItems: 'center',
  },
  instructionText: {
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 40,
  },
  sosButtonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosPing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  sosBorderRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  sosButton: {
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 6,
    borderColor: 'rgba(248, 113, 113, 0.5)',
    elevation: 10,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  sosGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  sosIcon: {
    zIndex: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sosText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    zIndex: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  testAlarmText: {
    marginTop: 48,
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    padding: 24,
    paddingTop: 12,
  },
  footerLabel: {
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 10,
    marginLeft: 4,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButton: {
    flex: 1,
    height: 112,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#64748b',
  }
});

export default SOSScreen;