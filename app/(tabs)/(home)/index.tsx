
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
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

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home screen focused, refreshing financial data...');
      fetchFinancialData();
    }, [])
  );

  const fetchFinancialData = async () => {
    try {
      await Promise.all([
        fetchMonthlyIncome(),
        fetchFixedBillsTotal(),
      ]);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        console.log('No user logged in');
        setMonthlyIncome(0);
        return;
      }

      const { data, error } = await supabase
        .from('FixedIncome')
        .select('monthly_income')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No income record found for user');
          setMonthlyIncome(0);
        } else {
          throw error;
        }
      } else {
        setMonthlyIncome(data?.monthly_income || 0);
      }
    } catch (error) {
      console.error('Error fetching monthly income:', error);
      setMonthlyIncome(0);
    }
  };

  const fetchFixedBillsTotal = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        console.log('No user logged in');
        setFixedBillsTotal(0);
        return;
      }

      const { data, error } = await supabase
        .from('FixedBills')
        .select('bill_cost')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      const total = data?.reduce((sum, bill) => sum + (bill.bill_cost || 0), 0) || 0;
      setFixedBillsTotal(total);
    } catch (error) {
      console.error('Error fetching fixed bills total:', error);
      setFixedBillsTotal(0);
    }
  };

  const handleIncomeUpdate = (newIncome: number) => {
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
