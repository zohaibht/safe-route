import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView, 
  StatusBar,
  useColorScheme
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
// You would replace this with your actual navigation hook (e.g., React Navigation)
import { useNavigation } from '@react-navigation/native';

// Mocking the database/types for the sake of the standalone component
// In a real app, import these from your actual paths
const repository = {
  getData: () => {},
  getDriverById: (id) => null,
  getStudentsByDriver: (id) => []
};

// Theme constants
const Colors = {
  light: {
    background: '#F8FAFC', // slate-50
    text: '#0F172A', // slate-900
    card: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#4F46E5', // indigo/primary
    subtext: '#64748B',
  },
  dark: {
    background: '#0F172A',
    text: '#FFFFFF',
    card: 'rgba(30, 41, 59, 0.4)',
    border: 'rgba(255, 255, 255, 0.1)',
    primary: '#6366F1',
    subtext: '#94A3B8',
  }
};

const DriverHome = ({ user = { id: 'd1' } }) => {
  const [students, setStudents] = useState([]);
  const [driver, setDriver] = useState();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Simulation logic copied from source
    const data = repository.getData();
    const foundDriver = repository.getDriverById(user.id);
    
    setDriver(foundDriver || { 
      id: 'd1', 
      driverName: 'Mr. Roberts', 
      phoneNumber: '555-0199', 
      vanNumberPlate: 'V-402', 
      routeName: 'Morning Run - North', 
      role: 'DRIVER' 
    });

    const fetchedStudents = repository.getStudentsByDriver(user.id);
    setStudents(fetchedStudents.length ? fetchedStudents : [
      { id: 's1', studentName: 'Leo M.', classGrade: '2', parentName: 'Emma', parentPhone: '555-123', homeLocation: 'Maple Ave', driverId: user.id, status: 'WAITING' },
      { id: 's2', studentName: 'Sarah K.', classGrade: '4', parentName: 'John', parentPhone: '555-456', homeLocation: 'Oak St', driverId: user.id, status: 'ONBOARD' }
    ]);
  }, [user.id]);

  const onboardCount = students.filter(s => s.status === 'ONBOARD').length;
  const totalStudents = students.length || 1;
  const progressPercent = (onboardCount / totalStudents) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
        <View>
          <Text style={[styles.subHeader, { color: theme.primary }]}>ACTIVE DUTY</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{driver?.routeName}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Map Section */}
        <View style={[styles.mapCard, { borderColor: theme.border }]}>
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqUiArioVWYU0bs2w6oZPZ1uANd4W6z33trlcS2TQeJZiMclNj0qwH4o2CsGsV8v9CDlQ6EnaQfVOktwiMMZSayqiINVPsdhZlgx1mbZnKyURfZoDBvQ--VcjG8R6sds8smri9LUu1kR-loLNU2Af_dgrvI5cZmjMm47MZhNod8lmHqd9nLlTfZL-X-ljcCQsVEXc_GpnxzjS5td1wKqwx6YKnwICjtS5qYnkax9mzxCsGmvKRUprePk9DC25cWq2W-EYPW3WNktU" }}
            style={[styles.mapImage, { opacity: isDark ? 0.7 : 0.9 }]} 
          />
          <LinearGradient 
            colors={isDark ? ['transparent', theme.background] : ['transparent', theme.background]}
            style={StyleSheet.absoluteFill} 
          />
          <View style={[styles.nextStopBadge, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)', borderColor: theme.border }]}>
            <View style={styles.pulseDot} />
            <Text style={[styles.nextStopText, { color: theme.text }]}>
              NEXT: {students.find(s => s.status === 'WAITING')?.homeLocation || 'Complete'}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={[styles.statsCount, { color: theme.text }]}>
              {onboardCount}
              <Text style={{ fontSize: 18, color: theme.subtext, fontWeight: 'normal' }}> / {students.length}</Text>
            </Text>
            <Text style={styles.statsLabel}>STUDENTS PICKED UP</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: theme.primary }]} />
          </View>
        </View>

        {/* Roster Grid */}
        <View style={styles.rosterSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pickup Roster</Text>
          <View style={styles.gridContainer}>
            {students.map(s => (
              <StudentRosterCard key={s.id} student={s} theme={theme} isDark={isDark} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <LinearGradient
        colors={isDark ? ['transparent', theme.background] : ['transparent', theme.background]}
        style={styles.footerGradient}
      >
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.actionButtonText}>Depart Current Stop</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const StudentRosterCard = ({ student, theme, isDark }) => {
  const isOnboard = student.status === 'ONBOARD';
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: isOnboard ? 'rgba(16, 185, 129, 0.1)' : theme.card,
        borderColor: isOnboard ? 'rgba(16, 185, 129, 0.3)' : theme.border,
      }
    ]}>
      {isOnboard && (
        <View style={styles.checkIcon}>
          <MaterialIcons name="check" size={14} color="white" />
        </View>
      )}
      
      <View style={[styles.avatarContainer, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <Image 
          source={{ uri: `https://picsum.photos/seed/${student.id}/100` }}
          style={styles.avatarImage}
        />
      </View>

      <View style={styles.cardInfo}>
        <Text style={[styles.studentName, { color: theme.text }]}>{student.studentName}</Text>
        <Text style={[
          styles.statusText, 
          { color: isOnboard ? '#10B981' : '#94A3B8' }
        ]}>
          {isOnboard ? 'Picked Up' : `Grade ${student.classGrade}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140, // Space for the fixed footer
  },
  mapCard: {
    height: 192,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nextStopBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981', // emerald-500
    marginRight: 6,
  },
  nextStopText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSection: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  statsHeader: {
    marginBottom: 8,
  },
  statsCount: {
    fontSize: 24,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBarBg: {
    height: 12,
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  rosterSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Card Styles
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  // Footer
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default DriverHome;