
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';

interface Account {
  id: number;
  acct_name: string;
  current_balance: number;
  minimum_payment: number;
  apr_interest: number;
  my_monthly_pay: number;
  due_date: string | null;
  acct_type: string;
  loan_limit: number;
  created_at: string;
  user_id: string;
}

export default function PlanningScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [payoffYear, setPayoffYear] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Planning screen focused, checking auth and refreshing data...');
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
        setTotalDebt(0);
        setTotalAccounts(0);
        setPayoffYear(0);
        setMonthlyPayments(0);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
      setAccounts([]);
      setTotalDebt(0);
      setTotalAccounts(0);
      setPayoffYear(0);
      setMonthlyPayments(0);
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
        console.log('Error fetching accounts:', error);
        setAccounts([]);
        setTotalDebt(0);
        setTotalAccounts(0);
        setPayoffYear(0);
        setMonthlyPayments(0);
      } else {
        setAccounts(data || []);
        calculateTotals(data || []);
      }
    } catch (error) {
      console.log('Error in fetchAccounts:', error);
      setAccounts([]);
      setTotalDebt(0);
      setTotalAccounts(0);
      setPayoffYear(0);
      setMonthlyPayments(0);
    }
  };

  const calculateTotals = (accountsData: Account[]) => {
    try {
      // If no accounts, set everything to 0
      if (!accountsData || accountsData.length === 0) {
        setTotalDebt(0);
        setTotalAccounts(0);
        setMonthlyPayments(0);
        setPayoffYear(0);
        return;
      }

      const debt = accountsData.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
      const payments = accountsData.reduce((sum, acc) => sum + (acc.my_monthly_pay || 0), 0);
      
      setTotalDebt(debt);
      setTotalAccounts(accountsData.length);
      setMonthlyPayments(payments);
      
      // Simple payoff year calculation (assuming constant payments)
      // Only calculate if there are actual payments being made
      if (payments > 0 && debt > 0) {
        const months = Math.ceil(debt / payments);
        const years = Math.floor(months / 12);
        setPayoffYear(new Date().getFullYear() + years);
      } else {
        setPayoffYear(0);
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
      setTotalDebt(0);
      setTotalAccounts(0);
      setPayoffYear(0);
      setMonthlyPayments(0);
    }
  };

  const calculateTimeToPayOff = (account: Account) => {
    try {
      if (account.my_monthly_pay <= 0 || account.current_balance <= 0) {
        return { years: 0, months: 0 };
      }
      
      const months = Math.ceil(account.current_balance / account.my_monthly_pay);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      return { years, months: remainingMonths };
    } catch (error) {
      console.error('Error calculating time to pay off:', error);
      return { years: 0, months: 0 };
    }
  };

  const renderAccountCard = (account: Account, index: number) => {
    try {
      const timeToPayOff = calculateTimeToPayOff(account);
      const accountType = account.acct_type || 'Credit Card';
      
      return (
        <View key={index} style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIconContainer}>
              <View style={styles.accountIcon}>
                <Ionicons name="card-outline" size={24} color="#FF6B6B" />
              </View>
            </View>
            <View style={styles.accountHeaderInfo}>
              <Text style={styles.accountName}>{account.acct_name || 'Unnamed Account'}</Text>
              <Text style={styles.accountType}>{accountType}</Text>
            </View>
            <Text style={styles.accountBalance}>${formatCurrency(account.current_balance, 2)}</Text>
          </View>

          <View style={styles.timeToPayOffContainer}>
            <Text style={styles.timeToPayOffLabel}>Time to Pay Off</Text>
            <View style={styles.timeToPayOffValues}>
              <View style={styles.timeValue}>
                <Text style={styles.timeNumber}>{timeToPayOff.years}</Text>
                <Text style={styles.timeLabel}>Years</Text>
              </View>
              <View style={styles.timeValue}>
                <Text style={styles.timeNumber}>{timeToPayOff.months}</Text>
                <Text style={styles.timeLabel}>Months</Text>
              </View>
            </View>
          </View>

          <View style={styles.accountDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Minimum Payment:</Text>
              <Text style={styles.detailValue}>${formatCurrency(account.minimum_payment)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>My Monthly Payment:</Text>
              <Text style={[styles.detailValue, styles.detailValueHighlight]}>
                ${formatCurrency(account.my_monthly_pay)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>APR:</Text>
              <Text style={styles.detailValue}>{(account.apr_interest || 0).toFixed(2)}%</Text>
            </View>
          </View>

          {account.my_monthly_pay > account.minimum_payment && (
            <View style={styles.strategyContainer}>
              <View style={styles.strategyHeader}>
                <Ionicons name="bulb" size={16} color="#FFC247" />
                <Text style={styles.strategyTitle}>✨ AI Personalized Strategy</Text>
              </View>
              <View style={styles.strategyContent}>
                <Ionicons name="trending-up" size={14} color="#FFFFFF" />
                <Text style={styles.strategyText}>
                  Increase to ${formatCurrency(account.minimum_payment * 1.5)}/month to save $
                  {formatCurrency(account.current_balance * 0.15)} in interest
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    } catch (error) {
      console.error('Error rendering account card:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Debt Overview</Text>
      </View>

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
              Sign in to view and manage your debt planning
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
          <React.Fragment>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>${formatCurrency(totalDebt)}</Text>
                <Text style={styles.summaryLabel}>Total Debt</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalAccounts}</Text>
                <Text style={styles.summaryLabel}>Accounts</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  ${formatCurrency(monthlyPayments)}
                </Text>
                <Text style={styles.summaryLabel}>Monthly Payments</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {payoffYear > 0 ? payoffYear : '0'}
                </Text>
                <Text style={styles.summaryLabel}>Payoff Year</Text>
              </View>
            </View>

            {/* Accounts Section */}
            <View style={styles.accountsSection}>
              <Text style={styles.sectionTitle}>Your Debt Accounts</Text>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.green} />
                  <Text style={styles.loadingText}>Loading accounts...</Text>
                </View>
              ) : accounts.length > 0 ? (
                <React.Fragment>
                  {accounts.map((account, index) => renderAccountCard(account, index))}
                </React.Fragment>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="card-outline" size={64} color="#3A3A3A" />
                  <Text style={styles.emptyStateText}>No accounts yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Add your first account to start tracking your debt
                  </Text>
                </View>
              )}
            </View>
          </React.Fragment>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    letterSpacing: 0.5,
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
    marginTop: 24,
    marginBottom: 12,
  },
  notLoggedInText: {
    color: '#888888',
    fontSize: 16,
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
  },

  // Summary Stats
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#A7A7A7',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Accounts Section
  accountsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  // Account Card
  accountCard: {
    backgroundColor: '#0F1E19',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A2F1A',
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountIconContainer: {
    marginRight: 12,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  accountHeaderInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 13,
    color: '#FF6B6B',
  },
  accountBalance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Time to Pay Off
  timeToPayOffContainer: {
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  timeToPayOffLabel: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeToPayOffValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  timeValue: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  // Account Details
  accountDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailValueHighlight: {
    color: '#FF6B6B',
  },

  // Strategy Container
  strategyContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  strategyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFC247',
  },
  strategyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  strategyText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },

  // Loading & Empty State
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 16,
  },
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
});
