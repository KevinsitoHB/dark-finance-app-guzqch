
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      name: 'fixedbills',
      route: '/(tabs)/fixedbills',
      icon: 'receipt',
      label: 'Fixed Bills',
    },
    {
      name: 'planning',
      route: '/(tabs)/planning',
      icon: 'lightbulb',
      label: 'Planning',
    },
    {
      name: 'accounts',
      route: '/(tabs)/accounts',
      icon: 'account_balance_wallet',
      label: 'Accounts',
    },
    {
      name: 'myaccount',
      route: '/(tabs)/myaccount',
      icon: 'person',
      label: 'My Account',
    },
  ];

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="fixedbills" name="fixedbills" />
        <Stack.Screen key="planning" name="planning" />
        <Stack.Screen key="accounts" name="accounts" />
        <Stack.Screen key="myaccount" name="myaccount" />
        <Stack.Screen 
          key="edit-bill" 
          name="edit-bill"
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          key="add-bill" 
          name="add-bill"
          options={{
            presentation: 'card',
          }}
        />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
