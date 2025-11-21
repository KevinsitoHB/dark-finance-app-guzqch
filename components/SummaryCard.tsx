
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, financeTheme } from '@/styles/commonStyles';

interface SummaryCardProps {
  backgroundColor: string;
  borderColor: string;
  iconName: string;
  iconColor: string;
  value: string;
  valueColor: string;
  subtext: string;
}

export default function SummaryCard({
  backgroundColor,
  borderColor,
  iconName,
  iconColor,
  value,
  valueColor,
  subtext,
}: SummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={[styles.iconCircle, { backgroundColor: `${iconColor}20` }]}>
        <IconSymbol
          ios_icon_name={iconName}
          android_material_icon_name={iconName}
          size={28}
          color={iconColor}
        />
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtext: {
    fontSize: 13,
    color: colors.subtextGray,
    lineHeight: 18,
  },
});
