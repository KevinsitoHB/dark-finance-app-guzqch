
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import FinancialOverview from '@/components/FinancialOverview';
import BudgetBreakdown from '@/components/BudgetBreakdown';
import { colors } from '@/styles/commonStyles';

export default function HomeScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <CustomHeader title="Dashboard" />
      <FinancialOverview />
      <BudgetBreakdown />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});
