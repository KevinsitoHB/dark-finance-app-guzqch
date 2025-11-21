
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

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
      <View style={[styles.iconCircle, { backgroundColor: `${iconColor}30` }]}>
        <IconSymbol
          ios_icon_name={iconName}
          android_material_icon_name={iconName}
          size={24}
          color={iconColor}
        />
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.subtext} numberOfLines={2}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 140,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 11,
    color: colors.subtextGray,
    lineHeight: 14,
  },
});
