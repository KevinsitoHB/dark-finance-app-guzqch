
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, financeTheme } from '@/styles/commonStyles';

interface SummaryCardProps {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  iosIconName: string;
  androidIconName: any;
  value: string;
  subtext: string;
}

export default function SummaryCard({
  backgroundColor,
  borderColor,
  iconColor,
  iosIconName,
  androidIconName,
  value,
  subtext,
}: SummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }, financeTheme.shadow]}>
      <IconSymbol
        ios_icon_name={iosIconName}
        android_material_icon_name={androidIconName}
        size={28}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: colors.subtextGray,
  },
});
