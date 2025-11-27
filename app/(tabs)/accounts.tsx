
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';

interface Account {
  id: number;
  acct_name: string;
  current_balance: number;
  minimum_payment: number;
  my_monthly_pay: number;
  apr_interest: number;
  due_date: string | null;
  acct_type: string | null;
  loan_limit: number;
  created_at: string;
  user_id: string;
}

export default function AccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'high-to-low' | 'low-to-high'>('high-to-low');

  useEffect(() => {
    checkAuth();
  }, []);

  // Use useFocusEffect to refresh accounts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Accounts screen focused, checking auth and refreshing data...');
      checkAuth();
    }, [])
  );

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      const loggedIn = !!session;
      console.log('Auth check - logged in:', loggedIn);
      setIsLoggedIn(loggedIn);
      
      // Only fetch accounts if logged in
      if (loggedIn) {
        await fetchAccounts();
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      console.log('Fetching accounts from Supabase...');
      const { data, error } = await supabase
        .from('Accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      console.log('Accounts fetched:', data?.length || 0);
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Alert.alert('Error', 'Failed to load accounts. Please try again.');
    }
  };

  const handleSort = () => {
    try {
      const newSortOrder = sortOrder === 'high-to-low' ? 'low-to-high' : 'high-to-low';
      setSortOrder(newSortOrder);
      
      const sortedAccounts = [...accounts].sort((a, b) => {
        if (newSortOrder === 'high-to-low') {
          return b.current_balance - a.current_balance;
        } else {
          return a.current_balance - b.current_balance;
        }
      });
      
      setAccounts(sortedAccounts);
    } catch (error) {
      console.error('Error sorting accounts:', error);
      Alert.alert('Error', 'Failed to sort accounts');
    }
  };

  const handleAdd = () => {
    try {
      Alert.alert('Coming Soon', 'Add account functionality will be available soon');
    } catch (error) {
      console.error('Error in handleAdd:', error);
    }
  };

  const renderAccountCard = (account: Account, index: number) => (
    <View
      key={index}
      style={styles.accountCard}
    >
      <View style={styles.accountIconContainer}>
        <View style={styles.accountIcon}>
          <Ionicons name="card-outline" size={24} color="#4A90E2" />
        </View>
        <View style={styles.accountBadge}>
          <Text style={styles.accountBadgeText}>
            {account.acct_type?.toUpperCase() || 'ACCOUNT'}
          </Text>
        </View>
      </View>
      <View style={styles.accountContent}>
        <Text style={styles.accountName}>{account.acct_name || 'Unnamed Account'}</Text>
        <Text style={styles.accountType}>
          {account.due_date 
            ? `Due: ${new Date(account.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Account'
          }
        </Text>
      </View>
      <View style={styles.accountAmountContainer}>
        <Text style={styles.accountAmount}>${formatCurrency(account.current_balance, 2)}</Text>
        <Text style={styles.accountLabel}>Balance</Text>
      </View>
    </View>
  );

  const getSortedAccounts = () => {
    try {
      return [...accounts].sort((a, b) => {
        if (sortOrder === 'high-to-low') {
          return b.current_balance - a.current_balance;
        } else {
          return a.current_balance - b.current_balance;
        }
      });
    } catch (error) {
      console.error('Error sorting accounts:', error);
      return accounts;
    }
  };

  const displayedAccounts = getSortedAccounts();
  const totalBalance = displayedAccounts.reduce((sum, account) => sum + (account.current_balance || 0), 0);
  const totalMinimumPayment = displayedAccounts.reduce((sum, account) => sum + (account.minimum_payment || 0), 0);

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Accounts</Text>
        {isLoggedIn && (
          <View style={styles.navbarIcons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleAdd}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {accounts.length > 0 && (
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleSort}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              >
                <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isLoggedIn ? (
          <View style={styles.notLoggedInContainer}>
            <Ionicons name="lock-closed-outline" size={64} color="#3A3A3A" />
            <Text style={styles.notLoggedInTitle}>Please Sign In</Text>
            <Text style={styles.notLoggedInText}>
              Sign in to view and manage your accounts
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => {
                try {
                  router.push('/(tabs)/myaccount');
                } catch (error) {
                  console.error('Error navigating to my account:', error);
                }
              }}
            >
              <Text style={styles.signInButtonText}>Go to My Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.accountsList}>
            {loading ? (
              <Text style={styles.loadingText}>Loading accounts...</Text>
            ) : displayedAccounts.length > 0 ? (
              <React.Fragment>
                {displayedAccounts.map((account, index) => renderAccountCard(account, index))}
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Balance</Text>
                    <Text style={styles.summaryAmount}>
                      ${formatCurrency(totalBalance, 2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Minimum Payment</Text>
                    <Text style={styles.summaryAmountSecondary}>
                      ${formatCurrency(totalMinimumPayment, 2)}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={64} color="#3A3A3A" />
                <Text style={styles.emptyStateText}>No accounts yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Your accounts will appear here once added
                </Text>
              </View>
            )}
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
    height: 80,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  navbarTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
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
  accountsList: {
    width: '100%',
  },

  // Not Logged In State
  notLoggedInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  notLoggedInTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.bold,
    marginTop: 24,
    marginBottom: 12,
  },
  notLoggedInText: {
    color: '#888888',
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  signInButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },

  // Account Card Styles
  accountCard: {
    backgroundColor: '#0A1714',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A2F2F',
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
  accountIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  accountIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  accountBadge: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: [{ translateX: -24 }],
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  accountBadgeText: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  accountContent: {
    flex: 1,
    justifyContent: 'center',
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  accountType: {
    color: '#888888',
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  accountAmountContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  accountAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  accountLabel: {
    color: '#888888',
    fontSize: 12,
    fontFamily: fonts.regular,
  },

  // Summary Container
  summaryContainer: {
    backgroundColor: '#1A2F2F',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2A3F3F',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  summaryAmount: {
    color: colors.green,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  summaryAmountSecondary: {
    color: colors.yellow,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
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
    fontFamily: fonts.medium,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888888',
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },

  // Loading
  loadingText: {
    color: '#888888',
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 40,
  },
});
