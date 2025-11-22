
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  onPress?: () => void;
}

export default function SummaryCard({
  backgroundColor,
  borderColor,
  iconName,
  iconColor,
  value,
  valueColor,
  subtext,
  onPress,
}: SummaryCardProps) {
  const CardContent = (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.contentContainer}>
        <View style={[styles.iconCircle, { backgroundColor: `${iconColor}30` }]}>
          <IconSymbol
            ios_icon_name={iconName}
            android_material_icon_name={iconName}
            size={28}
            color={iconColor}
          />
        </View>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        <Text style={styles.subtext} numberOfLines={2}>{subtext}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{CardContent}</View>;
}

const styles = StyleSheet.create({
  touchable: {
    width: '48%',
    marginBottom: 10,
  },
  card: {
    width: '100%',
    minHeight: 140,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 11,
    color: colors.subtextGray,
    lineHeight: 14,
    textAlign: 'center',
  },
});
