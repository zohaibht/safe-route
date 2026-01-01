import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  useColorScheme,
} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Placeholder imports - assume these exist in your project structure
import LoginScreen from './screens/LoginScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import AdminDashboard from './screens/AdminDashboard';
import DriverHome from './screens/DriverHome';
import ParentHome from './screens/ParentHome';
import AttendanceLog from './screens/AttendanceLog';
import SOSScreen from './screens/SOSScreen';
import PerformanceAnalytics from './screens/PerformanceAnalytics';
// import { UserRole } from './types'; // Defined locally for this snippet

type UserRole = 'ADMIN' | 'DRIVER' | 'PARENT';

// Create a Stack Navigator
const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState<{ id: string; role: UserRole; name: string } | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Handle Theme - React Native doesn't use document.classList
  const scheme = useColorScheme();
  
  useEffect(() => {
    // Optional: Sync with system theme on mount if desired
    // setIsDark(scheme === 'dark');
  }, [scheme]);

  const toggleTheme = () => setIsDark(!isDark);
  
  const logout = () => {
    setUser(null);
    setPendingRole(null);
  };

  const appTheme = isDark ? DarkTheme : DefaultTheme;
  const iconColor = isDark ? '#FFFFFF' : '#334155'; // white vs slate-700

  // Floating Controls Component
  const FloatingControls = () => (
    <View style={styles.floatingControls}>
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.controlButton, isDark ? styles.controlButtonDark : styles.controlButtonLight]}
      >
        <Icon name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={iconColor} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={logout}
        style={[styles.controlButton, isDark ? styles.controlButtonDark : styles.controlButtonLight]}
      >
        <Icon name="home" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <NavigationContainer theme={appTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Main Container replacing the div */}
      <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        
        {/* Global Controls - Only show if user is logged in */}
        {user && <FloatingControls />}

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            // Auth Flow Group
            <Stack.Group>
              {!pendingRole ? (
                <Stack.Screen name="RoleSelection">
                  {(props) => <RoleSelectionScreen {...props} onSelectRole={setPendingRole} />}
                </Stack.Screen>
              ) : (
                <Stack.Screen name="Login">
                  {(props) => (
                    <LoginScreen
                      {...props}
                      role={pendingRole}
                      onLogin={setUser}
                      onBack={() => setPendingRole(null)}
                    />
                  )}
                </Stack.Screen>
              )}
            </Stack.Group>
          ) : (
            // Authenticated Flow Group
            <Stack.Group>
              {user.role === 'ADMIN' && (
                <>
                  <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                  <Stack.Screen name="SOS" component={SOSScreen} />
                  <Stack.Screen name="Analytics" component={PerformanceAnalytics} />
                  <Stack.Screen name="Attendance" component={AttendanceLog} />
                </>
              )}

              {user.role === 'DRIVER' && (
                <Stack.Screen name="DriverHome">
                  {(props) => <DriverHome {...props} user={user} />}
                </Stack.Screen>
              )}

              {user.role === 'PARENT' && (
                <>
                  <Stack.Screen name="ParentHome" component={ParentHome} />
                  <Stack.Screen name="Attendance" component={AttendanceLog} />
                </>
              )}
            </Stack.Group>
          )}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Equivalent to min-h-screen
  },
  bgLight: {
    backgroundColor: '#F8FAFC', // slate-50
  },
  bgDark: {
    backgroundColor: '#0F172A', // slate-900 / background-dark placeholder
  },
  floatingControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20, // Adjust for status bar
    right: 16,
    zIndex: 50,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // backdrop-blur emulation
    borderColor: '#E2E8F0', // slate-200
  },
  controlButtonDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default App;