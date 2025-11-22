
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SummaryCard from './SummaryCard';
import CurrencyInputModal from './CurrencyInputModal';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function FinancialOverview() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [fixedBillsTotal, setFixedBillsTotal] = useState(0);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Dashboard focused, refreshing financial data...');
      fetchFinancialData();
    }, [])
  );

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchMonthlyIncome(),
        fetchFixedBillsTotal(),
      ]);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      Alert.alert('Error', 'Failed to load financial data');
    } finally {
      setLoading(false);
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
          // No record found, that's okay
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

  const handleIncomeCardPress = () => {
    setShowIncomeModal(true);
  };

  const handleIncomeSave = (value: number) => {
    setMonthlyIncome(value);
  };

  const remainingAfterBills = monthlyIncome - fixedBillsTotal;
  const yearlyIncome = monthlyIncome * 12;

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
          iconName="credit_card"
          iconColor={colors.red}
          value="$0"
          valueColor={colors.red}
          subtext="Total Accounts Debt, 0 accounts"
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
