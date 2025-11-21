
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
          borderColor={`${colors.red}66`}
          label="Fixed Bills:"
          value="$6,778,319"
          valueColor={colors.red}
          dotColor={colors.red}
        />
        <BudgetCard
          backgroundColor="rgba(255, 194, 71, 0.08)"
          borderColor={`${colors.yellow}66`}
          label="Remaining:"
          value="-$6,773,819"
          valueColor={colors.yellow}
          dotColor={colors.yellow}
        />
        <BudgetCard
          backgroundColor="rgba(46, 255, 139, 0.08)"
          borderColor={`${colors.green}66`}
          label="Income:"
          value="$4,500"
          valueColor={colors.green}
          dotColor={colors.green}
        />
      </ScrollView>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.red }]} />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingRight: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
  },
});
