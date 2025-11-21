
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

interface FixedBill {
  id: number;
  bill_name: string;
  bill_cost: number;
  created_at: string;
  user_id: string;
}

export default function FixedBillsScreen() {
  const [activeTab, setActiveTab] = useState<'bills' | 'calculators'>('bills');
  const [bills, setBills] = useState<FixedBill[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchBills();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('FixedBills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching bills:', error);
      } else {
        setBills(data || []);
      }
    } catch (error) {
      console.log('Error in fetchBills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    Alert.alert('Sort', 'Sort functionality coming soon');
  };

  const handleAdd = () => {
    Alert.alert('Add Bill', 'Add bill functionality coming soon');
  };

  const handleCopyExport = () => {
    Alert.alert('Export', 'Export functionality coming soon');
  };

  const renderBillCard = (bill: FixedBill, index: number) => (
    <View key={index} style={styles.billCard}>
      <View style={styles.billIconContainer}>
        <View style={styles.billIcon}>
          <Ionicons name="receipt-outline" size={24} color="#FF6B6B" />
        </View>
        <View style={styles.billBadge}>
          <Text style={styles.billBadgeText}>BILL</Text>
        </View>
      </View>
      <View style={styles.billContent}>
        <Text style={styles.billName}>{bill.bill_name || 'Unnamed Bill'}</Text>
        <Text style={styles.billType}>Fixed Bill</Text>
      </View>
      <View style={styles.billAmountContainer}>
        <Text style={styles.billAmount}>${bill.bill_cost?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.billLabel}>Balance</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Fixed Bills</Text>
        {isLoggedIn && (
          <View style={styles.navbarIcons}>
            {bills.length > 0 && (
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleSort}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              >
                <Ionicons name="swap-vertical" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleAdd}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleCopyExport}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <FontAwesome name="copy" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Pill Buttons */}
      <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[
            styles.pillButton,
            activeTab === 'bills' && styles.pillButtonActive
          ]}
          onPress={() => setActiveTab('bills')}
        >
          <Text style={[
            styles.pillButtonText,
            activeTab === 'bills' && styles.pillButtonTextActive
          ]}>
            Fixed Bills
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.pillButton,
            activeTab === 'calculators' && styles.pillButtonActive
          ]}
          onPress={() => setActiveTab('calculators')}
        >
          <Text style={[
            styles.pillButtonText,
            activeTab === 'calculators' && styles.pillButtonTextActive
          ]}>
            Calculators
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'bills' ? (
          <View style={styles.billsList}>
            {loading ? (
              <Text style={styles.loadingText}>Loading bills...</Text>
            ) : bills.length > 0 ? (
              bills.map((bill, index) => renderBillCard(bill, index))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={64} color="#3A3A3A" />
                <Text style={styles.emptyStateText}>No fixed bills yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap the + button to add your first bill
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.calculatorsContent}>
            <Text style={styles.comingSoonText}>Calculators coming soon...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  
  // Navbar Styles
  navbar: {
    height: 44,
    backgroundColor: '#0C1C17',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navbarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  navbarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Pill Buttons Styles
  pillContainer: {
    backgroundColor: '#0A1714',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 4,
  },
  pillButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 100,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#5AA0F2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  pillButtonText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '600',
  },
  pillButtonTextActive: {
    color: '#FFFFFF',
  },

  // Content Styles
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  billsList: {
    width: '100%',
  },

  // Bill Card Styles
  billCard: {
    backgroundColor: '#0A1714',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A2F1A',
    padding: 16,
    minHeight: 80,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  billIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  billBadge: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: [{ translateX: -18 }],
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  billBadgeText: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '600',
  },
  billContent: {
    flex: 1,
    justifyContent: 'center',
  },
  billName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  billType: {
    color: '#888888',
    fontSize: 13,
  },
  billAmountContainer: {
    alignItems: 'flex-end',
  },
  billAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  billLabel: {
    color: '#888888',
    fontSize: 12,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
  },

  // Loading & Coming Soon
  loadingText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  calculatorsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
});
