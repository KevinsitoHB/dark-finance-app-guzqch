
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import CustomHeader from '@/components/CustomHeader';

export default function FixedBillsScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader title="Fixed Bills" />
      <View style={styles.content}>
        <Text style={styles.text}>Fixed Bills screen coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: colors.subtextGray,
    textAlign: 'center',
  },
});
