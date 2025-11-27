
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BudgetCard from './BudgetCard';
import { colors, fonts } from '@/styles/commonStyles';
import { formatCurrency } from '@/utils/formatters';

interface BudgetBreakdownProps {
  monthlyIncome?: number;
  fixedBillsTotal?: number;
  remainingAfterBills?: number;
  totalAccountsDebt?: number;
}

export default function BudgetBreakdown({
  monthlyIncome = 0,
  fixedBillsTotal = 0,
  remainingAfterBills = 0,
  totalAccountsDebt = 0,
}: BudgetBreakdownProps) {
  // Calculate percentages for the progress bar
  const percentSpent = monthlyIncome > 0 ? (fixedBillsTotal / monthlyIncome) * 100 : 0;
  const percentAvailable = monthlyIncome > 0 ? (remainingAfterBills / monthlyIncome) * 100 : 0;
  
  // Calculate Debt-to-Income ratio (DTI)
  const dtiRatio = monthlyIncome > 0 ? (totalAccountsDebt / (monthlyIncome * 12)) * 100 : 0;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Budget Breakdown</Text>
      
      {/* Budget Cards Container */}
      <View style={styles.cardsContainer}>
        <BudgetCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={colors.red}
          label="Fixed Bills:"
          value={`$${formatCurrency(fixedBillsTotal)}`}
          valueColor={colors.red}
          dotColor={colors.red}
        />
        <BudgetCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={colors.yellow}
          label="Remaining:"
          value={`$${formatCurrency(remainingAfterBills)}`}
          valueColor={colors.yellow}
          dotColor={colors.yellow}
        />
        <BudgetCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={colors.green}
          label="Income:"
          value={`$${formatCurrency(monthlyIncome)}`}
          valueColor={colors.green}
          dotColor={colors.green}
        />
      </View>

      {/* Progress Bar Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          {/* Red section for spent */}
          <View 
            style={[
              styles.progressSegment, 
              { 
                width: `${percentSpent}%`, 
                backgroundColor: colors.red,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }
            ]} 
          />
          {/* Green section for available */}
          <View 
            style={[
              styles.progressSegment, 
              { 
                width: `${percentAvailable}%`, 
                backgroundColor: colors.green,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }
            ]} 
          />
        </View>
        
        {/* Progress Labels */}
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            {percentSpent.toFixed(0)}% Spent, DTI {dtiRatio.toFixed(0)}%
          </Text>
          <Text style={styles.progressLabel}>
            {percentAvailable.toFixed(0)}% available
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressSegment: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.subtextGray,
    fontWeight: '500',
  },
});
