
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SummaryCard from './SummaryCard';
import { colors } from '@/styles/commonStyles';

export default function FinancialOverview() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.cardsGrid}>
        <SummaryCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={colors.green}
          iconName="wallet"
          iconColor={colors.green}
          value="$0"
          valueColor={colors.green}
          subtext="Monthly Income, $0/year"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={colors.red}
          iconName="receipt"
          iconColor={colors.red}
          value="$0"
          valueColor={colors.red}
          subtext="Fixed Bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={colors.yellow}
          iconName="payments"
          iconColor={colors.yellow}
          value="$0"
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
