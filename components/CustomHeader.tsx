
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface CustomHeaderProps {
  title: string;
}

export default function CustomHeader({ title }: CustomHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
  },
});
