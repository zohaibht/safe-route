import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Define a color palette based on the Tailwind classes provided
const COLORS = {
  backgroundDark: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  white: '#ffffff',
  white05: 'rgba(255, 255, 255, 0.05)',
  white10: 'rgba(255, 255, 255, 0.1)',
  primary: '#8b5cf6',
  primary10: 'rgba(139, 92, 246, 0.1)',
  emerald500: '#10b981',
  emerald500_10: 'rgba(16, 185, 129, 0.1)',
  emerald400: '#34d399',
};

interface TimelineItemProps {
  icon: string;
  title: string;
  time: string;
  location: string;
  status?: string;
  active?: boolean;
  inactive?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  icon, 
  title, 
  time, 
  location, 
  status, 
  active, 
  inactive 
}) => {
  // Map web icons to MaterialIcons names if necessary
  const getIconName = (name: string) => {
    const map: Record<string, string> = {
      'home_pin': 'pin-drop',
      'route': 'alt-route',
      'directions_bus': 'directions-bus',
    };
    return map[name] || name;
  };

  return (
    <View style={[styles.timelineItemWrapper, inactive && { opacity: 0.6 }]}>
      {/* Timeline Dot/Icon */}
      <View style={[
        styles.timelineIconContainer,
        active ? styles.timelineIconActive : styles.timelineIconInactive
      ]}>
        <MaterialIcons 
          name={getIconName(icon)} 
          size={18} 
          color={active ? COLORS.white : COLORS.slate500} 
        />
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          {status && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.timeText}>{time}</Text>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={14} color={COLORS.slate500} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const AttendanceLog: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Attendance Log</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="calendar-today" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://picsum.photos/seed/leo/100' }} 
              style={styles.avatar} 
            />
            <View style={styles.onlineBadge}>
              <MaterialIcons name="check" size={10} color={COLORS.white} style={{ fontWeight: 'bold' }} />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Leo M.</Text>
            <View style={styles.profileMeta}>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>GRADE 2</Text>
              </View>
              <Text style={styles.busInfo}>Bus #42</Text>
            </View>
          </View>
        </View>

        {/* Today Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.sectionDate}>Wed, Oct 24</Text>
          </View>

          <View style={styles.timelineContainer}>
             {/* Vertical Line */}
            <View style={styles.timelineLine} />

            <TimelineItem 
              icon="home_pin" 
              title="Arrived Home" 
              time="3:45 PM" 
              location="123 Maple Street, Springfield" 
              status="Safe"
              active
            />
            <TimelineItem 
              icon="route" 
              title="Bus Route Progress" 
              time="Tracking active" 
              location="Passing Main St Bridge"
              inactive
            />
            <TimelineItem 
              icon="directions_bus" 
              title="Boarded Bus #42" 
              time="7:30 AM" 
              location="123 Maple Street (Home Stop)" 
            />
          </View>
        </View>

        {/* Yesterday Section */}
        <View style={[styles.section, { opacity: 0.5 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yesterday</Text>
            <Text style={styles.sectionDate}>Tue, Oct 23</Text>
          </View>
          
          <TouchableOpacity style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <MaterialIcons name="history" size={20} color={COLORS.slate500} />
              <Text style={styles.historyText}>View full history for Oct 23</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white05,
    backgroundColor: COLORS.backgroundDark,
    // Ensure header stays on top (z-index equivalent)
    zIndex: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.slate800,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white05,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.white10,
    marginBottom: 32,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: COLORS.emerald500,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.slate800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeBadge: {
    backgroundColor: COLORS.primary10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gradeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  busInfo: {
    color: COLORS.slate400,
    fontSize: 12,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sectionDate: {
    color: COLORS.slate500,
    fontSize: 12,
    fontWeight: '500',
  },
  // Timeline
  timelineContainer: {
    paddingLeft: 40,
    position: 'relative',
    gap: 48, // Space between items
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 16,
    bottom: 16,
    width: 2,
    backgroundColor: COLORS.slate700,
  },
  timelineItemWrapper: {
    position: 'relative',
  },
  timelineIconContainer: {
    position: 'absolute',
    left: -40, // Pull icon to the left over the line
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.backgroundDark,
    zIndex: 10,
  },
  timelineIconActive: {
    backgroundColor: COLORS.emerald500,
  },
  timelineIconInactive: {
    backgroundColor: COLORS.slate800,
  },
  // Card reusable styles
  card: {
    padding: 16,
    backgroundColor: COLORS.white05,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white05,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusBadge: {
    backgroundColor: COLORS.emerald500_10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    color: COLORS.emerald400,
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.slate400,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.slate500,
  },
  // History Card
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white05,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white05,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  historyText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AttendanceLog;