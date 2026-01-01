import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  SafeAreaView, 
  StatusBar, 
  useColorScheme, 
  Modal,
  FlatList,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { repository } from '../db';
import { Driver, Student, AppState } from '../types';

// Color Palette & Constants
const COLORS = {
  primary: '#4F46E5',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
  alertRed: '#EF4444',
  emerald500: '#10B981',
  indigo500: '#6366F1',
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('FLEET');
  const [db, setDb] = useState(repository.getData());
  const [showAddForm, setShowAddForm] = useState(false);
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  const refreshDb = () => {
    setDb(repository.getData());
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddForm(false);
    refreshDb();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>Admin Portal</Text>
            <Text style={styles.headerSubtitle}>Fleet & Student Management</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowAddForm(!showAddForm)}
            style={[styles.addButton, showAddForm ? styles.addButtonActive : styles.addButtonInactive]}
          >
            <Icon name={showAddForm ? 'close' : 'add'} size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {['FLEET', 'STUDENTS', 'SYSTEM'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabChange(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.main} contentContainerStyle={styles.scrollContent}>
        {showAddForm ? (
          <AddEntityForm 
            type={activeTab} 
            drivers={db.drivers} 
            onSuccess={() => { setShowAddForm(false); refreshDb(); }} 
            isDarkMode={isDarkMode}
          />
        ) : (
          <View style={styles.contentContainer}>
            {activeTab === 'FLEET' && (
              <>
                <View style={styles.gridRow}>
                   <ActionButton 
                      icon="analytics" 
                      label="Analytics" 
                      color={COLORS.primary} 
                      onPress={() => navigation.navigate('Analytics')} 
                      isDarkMode={isDarkMode}
                   />
                   <ActionButton 
                      icon="sos" 
                      label="SOS Center" 
                      color={COLORS.alertRed} 
                      onPress={() => navigation.navigate('SOS')} 
                      isDarkMode={isDarkMode}
                   />
                </View>
                {db.drivers.length === 0 ? (
                  <EmptyState icon="local-taxi" message="No drivers registered yet." />
                ) : db.drivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} isDarkMode={isDarkMode} />
                ))}
              </>
            )}

            {activeTab === 'STUDENTS' && (
              db.students.length === 0 ? (
                <EmptyState icon="school" message="No students registered yet." />
              ) : db.students.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  driver={db.drivers.find(d => d.id === student.driverId)} 
                  isDarkMode={isDarkMode}
                />
              ))
            )}

            {activeTab === 'SYSTEM' && (
              <View style={styles.systemCard}>
                <Icon name="account-tree" size={40} color={COLORS.slate400} />
                <Text style={styles.systemTitle}>Hierarchy Management</Text>
                <Text style={styles.systemSubtitle}>Configure sub-admins and region permissions.</Text>
                <TouchableOpacity style={styles.systemButton}>
                  <Text style={styles.systemButtonText}>Manage Roles</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* --- Sub Components --- */

const AddEntityForm = ({ type, drivers, onSuccess, isDarkMode }) => {
  const [formData, setFormData] = useState({});
  const styles = getStyles(isDarkMode);

  const handleSubmit = () => {
    if (type === 'FLEET') {
      repository.addDriver({
        driverName: formData.driverName,
        phoneNumber: formData.phoneNumber,
        vanNumberPlate: formData.vanPlate,
        routeName: formData.route
      });
    } else if (type === 'STUDENTS') {
      repository.addStudent({
        studentName: formData.studentName,
        classGrade: formData.grade,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        homeLocation: formData.location,
        driverId: formData.driverId
      });
    }
    onSuccess();
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Register New {type === 'FLEET' ? 'Driver' : 'Student'}</Text>
      {type === 'FLEET' ? (
        <>
          <InputField label="Driver Name" onChange={v => setFormData({ ...formData, driverName: v })} isDarkMode={isDarkMode} />
          <InputField label="Phone Number" onChange={v => setFormData({ ...formData, phoneNumber: v })} isDarkMode={isDarkMode} />
          <InputField label="Van Plate #" onChange={v => setFormData({ ...formData, vanPlate: v })} isDarkMode={isDarkMode} />
          <InputField label="Route Name" onChange={v => setFormData({ ...formData, route: v })} isDarkMode={isDarkMode} />
        </>
      ) : (
        <>
          <InputField label="Student Name" onChange={v => setFormData({ ...formData, studentName: v })} isDarkMode={isDarkMode} />
          <InputField label="Class / Grade" onChange={v => setFormData({ ...formData, grade: v })} isDarkMode={isDarkMode} />
          <InputField label="Parent Name" onChange={v => setFormData({ ...formData, parentName: v })} isDarkMode={isDarkMode} />
          <InputField label="Parent Phone" onChange={v => setFormData({ ...formData, parentPhone: v })} isDarkMode={isDarkMode} />
          <InputField label="Home Location" onChange={v => setFormData({ ...formData, location: v })} isDarkMode={isDarkMode} />
          <DriverSelector 
            drivers={drivers} 
            selectedId={formData.driverId} 
            onSelect={id => setFormData({ ...formData, driverId: id })} 
            isDarkMode={isDarkMode}
          />
        </>
      )}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Save Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const InputField = ({ label, onChange, isDarkMode }) => {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput 
        style={styles.textInput}
        placeholder={`Enter ${label.toLowerCase()}...`}
        placeholderTextColor={COLORS.slate400}
        onChangeText={onChange}
      />
    </View>
  );
};

// Custom Dropdown Replacement using Modal
const DriverSelector = ({ drivers, selectedId, onSelect, isDarkMode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const styles = getStyles(isDarkMode);
  const selectedDriver = drivers.find(d => d.id === selectedId);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Assign Driver</Text>
      <TouchableOpacity 
        style={styles.selectButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectText, !selectedDriver && { color: COLORS.slate400 }]}>
          {selectedDriver ? `${selectedDriver.driverName} - ${selectedDriver.routeName}` : 'Select a Driver'}
        </Text>
        <Icon name="arrow-drop-down" size={24} color={COLORS.slate400} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Driver</Text>
            <FlatList
              data={drivers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => { onSelect(item.id); setModalVisible(false); }}
                >
                  <Text style={styles.modalItemText}>{item.driverName} ({item.routeName})</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ActionButton = ({ icon, label, color, onPress, isDarkMode }) => {
  const styles = getStyles(isDarkMode);
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.actionButton, { borderColor: color + '40', backgroundColor: color + '15' }]}
    >
      <Icon name={icon} size={28} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const DriverCard = ({ driver, isDarkMode }) => {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '15' }]}>
        <Icon name="local-taxi" size={30} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{driver.driverName}</Text>
        <Text style={styles.cardSubtitle}>{driver.vanNumberPlate} • {driver.routeName}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={COLORS.slate400} />
    </View>
  );
};

const StudentCard = ({ student, driver, isDarkMode }) => {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: COLORS.indigo500 + '15' }]}>
        <Icon name="school" size={30} color={COLORS.indigo500} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{student.studentName}</Text>
        <Text style={styles.cardSubtitle}>Grade {student.classGrade} • {driver?.driverName || 'Unassigned'}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{student.status || 'Active'}</Text>
      </View>
    </View>
  );
};

const EmptyState = ({ icon, message }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconBox}>
      <Icon name={icon} size={40} color={COLORS.slate400} />
    </View>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

/* --- Styles & Theme --- */

const lightTheme = {
  bg: COLORS.slate50,
  cardBg: COLORS.white,
  text: COLORS.slate900,
  border: COLORS.slate200,
  subText: COLORS.slate500,
  headerBg: 'rgba(255, 255, 255, 0.95)',
};

const darkTheme = {
  bg: COLORS.slate900,
  cardBg: '#1E293B40', 
  text: COLORS.white,
  border: 'rgba(255, 255, 255, 0.1)',
  subText: COLORS.slate400,
  headerBg: 'rgba(15, 23, 42, 0.95)',
};

const getStyles = (isDarkMode) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    header: {
      padding: 24,
      paddingTop: Platform.OS === 'android' ? 40 : 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.headerBg,
    },
    headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.subText,
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    addButtonActive: {
      backgroundColor: COLORS.slate400,
    },
    addButtonInactive: {
      backgroundColor: COLORS.primary,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : COLORS.slate200,
      padding: 4,
      borderRadius: 16,
      gap: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: isDarkMode ? COLORS.primary : COLORS.white,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.subText,
    },
    activeTabText: {
      color: isDarkMode ? COLORS.white : COLORS.primary,
    },
    main: {
      flex: 1,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 100,
    },
    contentContainer: {
      gap: 16,
    },
    gridRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    actionButton: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      gap: 8,
    },
    actionButtonText: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderRadius: 24,
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 16,
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.subText,
    },
    statusBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    statusText: {
      color: isDarkMode ? '#34D399' : COLORS.emerald500,
      fontSize: 10,
      fontWeight: 'bold',
    },
    systemCard: {
      padding: 24,
      backgroundColor: theme.cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    systemTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16,
      color: theme.text,
    },
    systemSubtitle: {
      fontSize: 12,
      color: theme.subText,
      textAlign: 'center',
    },
    systemButton: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : COLORS.slate100,
      borderRadius: 12,
    },
    systemButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
    },
    // Form Styles
    formCard: {
      backgroundColor: theme.cardBg,
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      gap: 24,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    inputContainer: {
      gap: 4,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.subText,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    textInput: {
      backgroundColor: isDarkMode ? COLORS.slate900 : COLORS.slate50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 16,
      color: theme.text,
      fontSize: 14,
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
    submitButtonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    // Select/Modal Styles
    selectButton: {
      backgroundColor: isDarkMode ? COLORS.slate900 : COLORS.slate50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectText: {
      color: theme.text,
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 24,
    },
    modalContent: {
      backgroundColor: theme.cardBg,
      borderRadius: 24,
      padding: 24,
      maxHeight: '60%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    modalItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalItemText: {
      fontSize: 16,
      color: theme.text,
    },
    modalCloseButton: {
      marginTop: 16,
      padding: 12,
      backgroundColor: theme.bg,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalCloseText: {
      color: theme.text,
      fontWeight: 'bold',
    },
    // Empty State
    emptyState: {
      paddingVertical: 80,
      alignItems: 'center',
      gap: 16,
    },
    emptyIconBox: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDarkMode ? COLORS.slate800 : COLORS.slate200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontWeight: '500',
      color: COLORS.slate400,
    },
  });
};

// Placeholder Styles object to satisfy linter before render
const styles = {}; 

export default AdminDashboard;