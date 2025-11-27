
import React from 'react';
import { Tabs } from 'expo-router/unstable-native-tabs';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GlassView } from 'expo-glass-effect';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.subtextGray,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 20,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <GlassView 
              style={StyleSheet.absoluteFill}
              glassEffectStyle="regular"
              tintColor="rgba(12, 26, 18, 0.85)"
            />
            <View style={styles.borderTop} />
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'chart.bar.fill',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="fixedbills"
        options={{
          title: 'Fixed Bills',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'receipt.fill',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: 'Planning',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'lightbulb.fill',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'wallet.pass.fill',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="myaccount"
        options={{
          title: 'My Account',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'person.fill',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="edit-bill"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-bill"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
