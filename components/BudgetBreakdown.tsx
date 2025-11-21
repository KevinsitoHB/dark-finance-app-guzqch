
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BudgetCard from './BudgetCard';
import { colors } from '@/styles/commonStyles';

export default function BudgetBreakdown() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Budget Breakdown</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        <BudgetCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={colors.red}
          label="Fixed Bills:"
          value="$0"
          valueColor={colors.red}
          dotColor={colors.red}
        />
        <BudgetCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={colors.yellow}
          label="Remaining:"
          value="$0"
          valueColor={colors.yellow}
          dotColor={colors.yellow}
        />
        <BudgetCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={colors.green}
          label="Income:"
          value="$0"
          valueColor={colors.green}
          dotColor={colors.green}
        />
      </ScrollView>
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
    color: colors.text,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingRight: 16,
  },
});
