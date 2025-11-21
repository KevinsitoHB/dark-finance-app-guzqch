
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BudgetCard from './BudgetCard';
import { colors } from '@/styles/commonStyles';

export default function BudgetBreakdown() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Budget Breakdown</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BudgetCard
          backgroundColor="rgba(255, 77, 77, 0.08)"
          borderColor={`${colors.red}66`}
          valueColor={colors.red}
          label="Fixed Bills"
          value="$0"
        />
        <BudgetCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={`${colors.yellow}66`}
          valueColor={colors.yellow}
          label="Remaining"
          value="$0"
        />
        <BudgetCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={`${colors.green}66`}
          valueColor={colors.green}
          label="Income"
          value="$0"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
});
