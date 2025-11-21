
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import FinancialOverview from '@/components/FinancialOverview';
import BudgetBreakdown from '@/components/BudgetBreakdown';
import { colors } from '@/styles/commonStyles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title="Dashboard" />
        <FinancialOverview />
        <BudgetBreakdown />
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
