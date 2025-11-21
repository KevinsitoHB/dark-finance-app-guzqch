
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
          borderColor={`${colors.green}66`}
          iconName="wallet"
          iconColor={colors.green}
          value="$4,500"
          valueColor={colors.green}
          subtext="Monthly Income, $54,000/year"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={`${colors.red}66`}
          iconName="receipt"
          iconColor={colors.red}
          value="$6,778,319"
          valueColor={colors.red}
          subtext="Fixed Bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={`${colors.yellow}66`}
          iconName="payments"
          iconColor={colors.yellow}
          value="-$6,773,819"
          valueColor={colors.yellow}
          subtext="Remaining After fixed bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={`${colors.red}66`}
          iconName="credit_card"
          iconColor={colors.red}
          value="$20,678"
          valueColor={colors.red}
          subtext="Total Accounts Debt, 8 accounts"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
