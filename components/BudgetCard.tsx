
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BudgetCardProps {
  backgroundColor: string;
  borderColor: string;
  valueColor: string;
  label: string;
  value: string;
}

export default function BudgetCard({
  backgroundColor,
  borderColor,
  valueColor,
  label,
  value,
}: BudgetCardProps) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 70,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
    minWidth: 120,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: colors.subtextGray,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
