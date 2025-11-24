
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import SummaryCard from './SummaryCard';
import CurrencyInputModal from './CurrencyInputModal';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

interface FinancialOverviewProps {
  monthlyIncome: number;
  fixedBillsTotal: number;
  onIncomeUpdate: (newIncome: number) => void;
}

export default function FinancialOverview({
  monthlyIncome,
  fixedBillsTotal,
  onIncomeUpdate,
}: FinancialOverviewProps) {
  const router = useRouter();
  const [totalAccountsDebt, setTotalAccountsDebt] = useState(0);
  const [accountsCount, setAccountsCount] = useState(0);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  useEffect(() => {
    console.log('FinancialOverview mounted');
    fetchAccountsData();
  }, []);

  // Refresh accounts data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('FinancialOverview focused, refreshing accounts data...');
      fetchAccountsData();
    }, [])
  );

  const fetchAccountsData = async () => {
    try {
      console.log('--- Fetching accounts data ---');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('Auth check in FinancialOverview:', {
        hasUser: !!user,
        userId: user?.id,
        error: userError?.message
      });

      if (userError) {
        console.error('User error in fetchAccountsData:', userError);
        throw userError;
      }

      if (!user) {
        console.log('No user logged in for accounts fetch');
        setTotalAccountsDebt(0);
        setAccountsCount(0);
        return;
      }

      console.log('Querying Accounts table for user:', user.id);
      const { data, error } = await supabase
        .from('Accounts')
        .select('current_balance, minimum_payment')
        .eq('user_id', user.id);

      console.log('Accounts query result:', {
        hasData: !!data,
        accountCount: data?.length,
        error: error?.message
      });

      if (error) {
        console.error('Database error in fetchAccountsData:', error);
        throw error;
      }

      const totalDebt = data?.reduce((sum, account) => sum + (account.current_balance || 0), 0) || 0;
      
      console.log('✅ Accounts data fetched:', {
        totalDebt,
        accountCount: data?.length || 0
      });

      setTotalAccountsDebt(totalDebt);
      setAccountsCount(data?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching accounts data:', error);
      setTotalAccountsDebt(0);
      setAccountsCount(0);
    }
  };

  const handleIncomeCardPress = () => {
    console.log('Income card pressed, opening modal');
    setShowIncomeModal(true);
  };

  const handleFixedBillsCardPress = () => {
    try {
      console.log('Fixed bills card pressed, navigating to fixed bills');
      router.push('/(tabs)/fixedbills');
    } catch (error) {
      console.error('Error navigating to fixed bills:', error);
      Alert.alert('Error', 'Failed to navigate to Fixed Bills');
    }
  };

  const handleIncomeSave = (value: number) => {
    console.log('Income saved with value:', value);
    onIncomeUpdate(value);
  };

  const remainingAfterBills = monthlyIncome - fixedBillsTotal;
  const yearlyIncome = monthlyIncome * 12;

  console.log('FinancialOverview render:', {
    monthlyIncome,
    fixedBillsTotal,
    remainingAfterBills,
    totalAccountsDebt,
    accountsCount
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.cardsGrid}>
        <SummaryCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={colors.green}
          iconName="wallet"
          iconColor={colors.green}
          value={`$${monthlyIncome.toFixed(0)}`}
          valueColor={colors.green}
          subtext={`Monthly Income, $${yearlyIncome.toFixed(0)}/year`}
          onPress={handleIncomeCardPress}
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={colors.red}
          iconName="receipt"
          iconColor={colors.red}
          value={`$${fixedBillsTotal.toFixed(0)}`}
          valueColor={colors.red}
          subtext="Fixed Bills"
          onPress={handleFixedBillsCardPress}
        />
        <SummaryCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={colors.yellow}
          iconName="payments"
          iconColor={colors.yellow}
          value={`$${remainingAfterBills.toFixed(0)}`}
          valueColor={colors.yellow}
          subtext="Remaining After fixed bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={colors.red}
          iconName="account_balance"
          iconColor={colors.red}
          value={`$${totalAccountsDebt.toFixed(0)}`}
          valueColor={colors.red}
          subtext={`Total Accounts Debt, ${accountsCount} accounts`}
        />
      </View>

      <CurrencyInputModal
        visible={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSave={handleIncomeSave}
        initialValue={monthlyIncome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
