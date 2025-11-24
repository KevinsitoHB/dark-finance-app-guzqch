
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
    flex: 1,
    aspectRatio: 1.1,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 12,
  },
  textContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: colors.subtextGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
