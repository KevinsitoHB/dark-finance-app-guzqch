
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SummaryCard from './SummaryCard';
import { colors } from '@/styles/commonStyles';

export default function FinancialOverview() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.grid}>
        <SummaryCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={`${colors.green}66`}
          iconColor={colors.green}
          iosIconName="wallet.pass.fill"
          androidIconName="account_balance_wallet"
          value="$0"
          subtext="Monthly Income, $0/year"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={`${colors.red}66`}
          iconColor={colors.red}
          iosIconName="receipt.fill"
          androidIconName="receipt"
          value="$0"
          subtext="Fixed Bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={`${colors.yellow}66`}
          iconColor={colors.yellow}
          iosIconName="dollarsign.circle.fill"
          androidIconName="attach_money"
          value="$0"
          subtext="Remaining After Fixed Bills"
        />
        <SummaryCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={`${colors.red}66`}
          iconColor={colors.red}
          iosIconName="creditcard.fill"
          androidIconName="credit_card"
          value="$0"
          subtext="Total Accounts Debt, 0 accounts"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
