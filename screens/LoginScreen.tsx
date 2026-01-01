import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserRole } from '../types';
import { repository } from '../db';

interface LoginProps {
  role: UserRole;
  onLogin: (user: { id: string; role: UserRole; name: string }) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ role, onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const handleLogin = () => {
    setError('');

    if (role === 'ADMIN') {
      if (username === 'Admin' && password === '12345') {
        onLogin({ id: 'super-admin', role: 'ADMIN', name: 'Super Admin' });
        return;
      }
    } else if (role === 'DRIVER') {
      const db = repository.getData();
      const driver = db.drivers.find(
        d => d.driverName.toLowerCase() === username.toLowerCase() && d.vanNumberPlate === password
      );
      if (driver) {
        onLogin({ id: driver.id, role: 'DRIVER', name: driver.driverName });
        return;
      }
      setError('Driver not found or plate number mismatch');
      return;
    } else if (role === 'PARENT') {
      if (username === 'Parent' && password === '12345') {
        onLogin({ id: 'parent-1', role: 'PARENT', name: 'Emma Johnson' });
        return;
      }
    }

    setError('Invalid credentials for ' + role);
  };

  const getRoleThemeColor = () => {
    switch (role) {
      case 'ADMIN': return '#3b82f6'; // blue-500
      case 'DRIVER': return '#10b981'; // emerald-500
      case 'PARENT': return '#a855f7'; // purple-500
      default: return '#0f172a'; // slate-900 (primary)
    }
  };

  const getUsernameLabel = () => {
    if (role === 'DRIVER') return 'Driver Name';
    if (role === 'PARENT') return 'Parent Username';
    return 'Admin Username';
  };

  const getPasswordLabel = () => {
    if (role === 'DRIVER') return 'Van Number Plate';
    return 'Password';
  };

  const styles = getStyles(isDarkMode, getRoleThemeColor());

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.maxWidthContainer}>
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-back" size={16} color={styles.backButtonText.color} />
              <Text style={styles.backButtonText}>BACK TO ROLES</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {role} Portal
              </Text>
              <Text style={styles.subtitle}>Please enter your credentials to continue</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{getUsernameLabel()}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={role === 'DRIVER' ? "e.g. Mr. Roberts" : "e.g. Admin"}
                  placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{getPasswordLabel()}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={role === 'DRIVER' ? "e.g. V-402" : "••••••"}
                  placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={role !== 'DRIVER'} // Only hide if it's a real password
                  autoCapitalize="none"
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="error" size={18} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Authenticate</Text>
                <Icon name="verified-user" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Footer / Helper */}
            <View style={styles.helperBox}>
              <Text style={styles.helperTitle}>DEFAULT CREDENTIALS</Text>
              <View style={styles.helperContent}>
                <View style={styles.helperRow}>
                  <Text style={styles.helperLabel}>Admin:</Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>Admin / 12345</Text>
                  </View>
                </View>
                <View style={styles.helperRow}>
                  <Text style={styles.helperLabel}>Parent:</Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>Parent / 12345</Text>
                  </View>
                </View>
                <Text style={[styles.helperLabel, { marginTop: 4 }]}>
                  Driver: Register in Admin Portal first.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean, roleColor: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#020617' : '#f8fafc', // slate-950 : slate-50
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 32,
  },
  maxWidthContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButtonText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: roleColor,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: isDarkMode ? '#94a3b8' : '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#94a3b8',
    marginLeft: 4,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    width: '100%',
    height: 56,
    backgroundColor: isDarkMode ? roleColor : '#0f172a',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  helperBox: {
    marginTop: 48,
    padding: 16,
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(226, 232, 240, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
  },
  helperTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#64748b',
    marginBottom: 8,
  },
  helperContent: {
    gap: 4,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  helperLabel: {
    fontSize: 11,
    color: isDarkMode ? '#94a3b8' : '#475569',
    fontWeight: '500',
    marginRight: 4,
  },
  codeBlock: {
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: isDarkMode ? '#cbd5e1' : '#334155',
  },
});

export default LoginScreen;