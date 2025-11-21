
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BudgetCardProps {
  backgroundColor: string;
  borderColor: string;
  label: string;
  value: string;
  valueColor: string;
  dotColor: string;
}

export default function BudgetCard({
  backgroundColor,
  borderColor,
  label,
  value,
  valueColor,
  dotColor,
}: BudgetCardProps) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.content}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 180,
    height: 90,
    borderRadius: 18,
    borderWidth: 2,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.subtextGray,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
