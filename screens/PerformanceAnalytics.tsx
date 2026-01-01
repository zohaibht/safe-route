import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

// Screen Dimensions
const screenWidth = Dimensions.get('window').width;

// Theme Colors
const COLORS = {
  backgroundDark: '#0f172a', // Slate 900
  surface: '#1e293b',        // Slate 800
  surfaceLight: '#334155',   // Slate 700
  primary: '#1973f0',
  text: '#ffffff',
  textMuted: '#94a3b8',      // Slate 400
  emerald: '#34d399',
  emeraldBg: 'rgba(16, 185, 129, 0.1)',
  red: '#ef4444',
  redBg: 'rgba(239, 68, 68, 0.1)',
  border: 'rgba(255, 255, 255, 0.1)',
};

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [400, 300, 500, 200, 278, 189, 239],
      color: (opacity = 1) => `rgba(25, 115, 240, ${opacity})`, // primary color
      strokeWidth: 3,
    },
  ],
};

const PerformanceAnalytics = () => {
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
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Fuel Efficiency</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="filter-list" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContent}
        >
          <View style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>This Week</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Last Month</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Route 66</Text>
          </View>
        </ScrollView>

        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <MetricCard 
            label="Avg Efficiency" 
            value="8.4" 
            unit="MPG" 
            change="+2.1%" 
            icon="local-gas-station" 
          />
          <MetricCard 
            label="Total Fuel Cost" 
            value="$4,203" 
            change="-5.0%" 
            icon="payments" 
            color={COLORS.emerald} 
          />
        </View>

        {/* Main Chart Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>FLEET FUEL USAGE</Text>
              <View style={styles.valueRow}>
                <Text style={styles.cardValueLarge}>1,240</Text>
                <Text style={styles.cardUnit}>Gallons</Text>
              </View>
            </View>
            
            <View style={styles.timeToggle}>
              <View style={styles.timeToggleItemActive}>
                <Text style={styles.timeToggleTextActive}>W</Text>
              </View>
              <View style={styles.timeToggleItem}>
                <Text style={styles.timeToggleText}>M</Text>
              </View>
              <View style={styles.timeToggleItem}>
                <Text style={styles.timeToggleText}>Y</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 64} // adjusting for padding
              height={160}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withHorizontalLabels={false}
              chartConfig={{
                backgroundColor: COLORS.surface,
                backgroundGradientFrom: COLORS.surface,
                backgroundGradientTo: COLORS.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                propsForBackgroundLines: {
                   strokeWidth: 0
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Attention Needed */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Attention Needed</Text>
          <TouchableOpacity style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertIconContainer}>
                <Icon name="warning" size={24} color="#ef4444" />
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>High Idling Detected</Text>
                <Text style={styles.alertSubtitle}>3 Buses exceeded 20min idle time</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const MetricCard = ({ label, value, unit, change, icon, color }) => {
  // Determine color styling based on prop or default to primary
  const isPositive = change.includes('+'); // simplistic check for color logic
  
  return (
    <View style={styles.metricCard}>
      <View style={styles.bgIcon}>
         <Icon name={icon} size={60} color="#ffffff" />
      </View>
      
      <Text style={styles.cardLabel}>{label}</Text>
      
      <View style={styles.metricValueRow}>
        <Text style={[styles.cardValue, color ? { color } : null]}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      
      <View style={styles.badge}>
        <Icon name="trending-up" size={12} color={COLORS.emerald} style={{ marginRight: 4 }} />
        <Text style={styles.badgeText}>{change}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  tabContainer: {
    marginBottom: 24,
  },
  tabContent: {
    gap: 12,
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textMuted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  metricsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)', // surface with opacity
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },
  bgIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.05,
    transform: [{ translateX: 10 }, { translateY: -5 }],
  },
  cardLabel: {
    color: COLORS.textMuted,
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  cardValue: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '800',
  },
  metricUnit: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  badgeText: {
    color: COLORS.emerald,
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValueLarge: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '800',
  },
  cardUnit: {
    fontSize: 18,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  timeToggle: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeToggleItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  timeToggleItemActive: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 6,
  },
  timeToggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  timeToggleTextActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  chart: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  sectionContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.redBg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTextContainer: {
    gap: 2,
  },
  alertTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  }
});

export default PerformanceAnalytics;