
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import FinancialOverview from '@/components/FinancialOverview';
import BudgetBreakdown from '@/components/BudgetBreakdown';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function HomeScreen() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [fixedBillsTotal, setFixedBillsTotal] = useState(0);
  const [totalAccountsDebt, setTotalAccountsDebt] = useState(0);

  useEffect(() => {
    console.log('=== HomeScreen mounted ===');
    fetchFinancialData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('=== Home screen focused, refreshing financial data ===');
      fetchFinancialData();
    }, [])
  );

  const fetchFinancialData = async () => {
    try {
      console.log('Starting fetchFinancialData...');
      await Promise.all([
        fetchMonthlyIncome(),
        fetchFixedBillsTotal(),
        fetchAccountsDebt(),
      ]);
      console.log('Finished fetchFinancialData');
    } catch (error) {
      console.error('Error in fetchFinancialData:', error);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      console.log('--- Fetching monthly income ---');
      
      // Check authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('Auth check result:', {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        error: userError?.message
      });

      if (userError) {
        console.error('User error:', userError);
        throw userError;
      }

      if (!user) {
        console.log('❌ No user logged in');
        setMonthlyIncome(0);
        return;
      }

      console.log('✅ User authenticated:', user.id);

      // Fetch income data
      console.log('Querying FixedIncome table for user:', user.id);
      const { data, error } = await supabase
        .from('FixedIncome')
        .select('monthly_income')
        .eq('user_id', user.id)
        .single();

      console.log('FixedIncome query result:', {
        hasData: !!data,
        monthlyIncome: data?.monthly_income,
        error: error?.message,
        errorCode: error?.code
      });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No income record found for user (PGRST116)');
          setMonthlyIncome(0);
        } else {
          console.error('Database error:', error);
          throw error;
        }
      } else {
        const income = data?.monthly_income || 0;
        console.log('✅ Successfully fetched income:', income);
        setMonthlyIncome(income);
      }
    } catch (error) {
      console.error('❌ Error fetching monthly income:', error);
      setMonthlyIncome(0);
    }
  };

  const fetchFixedBillsTotal = async () => {
    try {
      console.log('--- Fetching fixed bills total ---');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error in fetchFixedBillsTotal:', userError);
        throw userError;
      }

      if (!user) {
        console.log('No user logged in for bills fetch');
        setFixedBillsTotal(0);
        return;
      }

      console.log('Querying FixedBills table for user:', user.id);
      const { data, error } = await supabase
        .from('FixedBills')
        .select('bill_cost')
        .eq('user_id', user.id);

      console.log('FixedBills query result:', {
        hasData: !!data,
        billCount: data?.length,
        error: error?.message
      });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const total = data?.reduce((sum, bill) => sum + (bill.bill_cost || 0), 0) || 0;
      console.log('✅ Successfully calculated bills total:', total);
      setFixedBillsTotal(total);
    } catch (error) {
      console.error('❌ Error fetching fixed bills total:', error);
      setFixedBillsTotal(0);
    }
  };

  const fetchAccountsDebt = async () => {
    try {
      console.log('--- Fetching accounts debt ---');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error in fetchAccountsDebt:', userError);
        throw userError;
      }

      if (!user) {
        console.log('No user logged in for accounts fetch');
        setTotalAccountsDebt(0);
        return;
      }

      console.log('Querying Accounts table for user:', user.id);
      const { data, error } = await supabase
        .from('Accounts')
        .select('current_balance')
        .eq('user_id', user.id);

      console.log('Accounts query result:', {
        hasData: !!data,
        accountCount: data?.length,
        error: error?.message
      });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const totalDebt = data?.reduce((sum, account) => sum + (account.current_balance || 0), 0) || 0;
      console.log('✅ Successfully calculated accounts debt:', totalDebt);
      setTotalAccountsDebt(totalDebt);
    } catch (error) {
      console.error('❌ Error fetching accounts debt:', error);
      setTotalAccountsDebt(0);
    }
  };

  const handleIncomeUpdate = (newIncome: number) => {
    console.log('Income updated to:', newIncome);
    setMonthlyIncome(newIncome);
  };

  const remainingAfterBills = monthlyIncome - fixedBillsTotal;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title="Dashboard" />
        
        <FinancialOverview 
          monthlyIncome={monthlyIncome}
          fixedBillsTotal={fixedBillsTotal}
          onIncomeUpdate={handleIncomeUpdate}
        />
        <BudgetBreakdown 
          monthlyIncome={monthlyIncome}
          fixedBillsTotal={fixedBillsTotal}
          remainingAfterBills={remainingAfterBills}
          totalAccountsDebt={totalAccountsDebt}
        />
        <MonthlyCalendar />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  bottomSpacer: {
    height: 40,
  },
});
