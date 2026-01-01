import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserRole } from '../types';

interface Props {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<Props> = ({ onSelectRole }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);
  const themeColors = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.background}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <MaterialIcons 
              name="security" 
              size={48} 
              color="#FFFFFF" 
            />
          </View>
          <Text style={styles.title}>SafeRoute 360</Text>
          <Text style={styles.subtitle}>Select your access portal</Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          <RoleCard
            icon="admin-panel-settings"
            title="Administrator"
            desc="Manage fleet, students & staff"
            color="#2563EB" // bg-blue-600
            onClick={() => onSelectRole('ADMIN')}
            isDarkMode={isDarkMode}
          />
          <RoleCard
            icon="directions-bus"
            title="Driver Portal"
            desc="Route tracking & attendance"
            color="#059669" // bg-emerald-600
            onClick={() => onSelectRole('DRIVER')}
            isDarkMode={isDarkMode}
          />
          <RoleCard
            icon="family-restroom"
            title="Parent App"
            desc="Live tracking & notifications"
            color="#9333EA" // bg-purple-600
            onClick={() => onSelectRole('PARENT')}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          CREDENTIAL-BASED ACCESS REQUIRED FOR ALL MODULES
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

interface RoleCardProps {
  icon: string;
  title: string;
  desc: string;
  color: string;
  onClick: () => void;
  isDarkMode: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  icon, 
  title, 
  desc, 
  color, 
  onClick, 
  isDarkMode 
}) => {
  const cardStyles = getCardStyles(isDarkMode, color);

  return (
    <TouchableOpacity 
      onPress={onClick}
      style={cardStyles.card}
      activeOpacity={0.7}
    >
      <View style={cardStyles.iconBox}>
        <MaterialIcons name={icon} size={30} color="#FFFFFF" />
      </View>
      <View style={cardStyles.textContainer}>
        <Text style={cardStyles.title}>{title}</Text>
        <Text style={cardStyles.desc}>{desc}</Text>
      </View>
      <MaterialIcons 
        name="chevron-right" 
        size={24} 
        color={isDarkMode ? '#475569' : '#CBD5E1'} 
      />
    </TouchableOpacity>
  );
};

// --- Styles & Theme Configuration ---

const lightColors = {
  background: '#F8FAFC', // slate-50
  textPrimary: '#0F172A', // slate-900
  textSecondary: '#64748B', // slate-500
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0', // slate-200
  footerText: '#94A3B8', // slate-400
  primary: '#2563EB', // approximate primary blue
};

const darkColors = {
  background: '#020617', // slate-950
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8', // slate-400
  cardBg: '#0F172A', // slate-900
  cardBorder: 'rgba(255,255,255,0.05)',
  footerText: '#475569', // slate-600
  primary: '#2563EB',
};

const getStyles = (isDark: boolean) => {
  const colors = isDark ? darkColors : lightColors;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    headerContainer: {
      marginBottom: 48,
      alignItems: 'center',
      width: '100%',
    },
    logoContainer: {
      width: 96,
      height: 96,
      backgroundColor: colors.primary,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      // Shadows
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 8,
      letterSpacing: -1,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    cardsContainer: {
      width: '100%',
      maxWidth: 380,
      gap: 16, // Note: gap requires newer RN versions, use marginBottom on children otherwise
    },
    footerText: {
      marginTop: 48,
      color: colors.footerText,
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 2,
      textAlign: 'center',
    },
  });
};

const getCardStyles = (isDark: boolean, iconColor: string) => {
  const colors = isDark ? darkColors : lightColors;

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginBottom: 16, // Fallback for 'gap'
      // Shadows
      shadowColor: isDark ? '#000' : '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 4,
      elevation: isDark ? 0 : 2,
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: iconColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
      // Icon Shadow
      shadowColor: iconColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    desc: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
};

export default RoleSelectionScreen;
