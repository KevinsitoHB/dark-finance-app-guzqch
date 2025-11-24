
import React from 'react';
import { Tabs } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { View } from 'react-native';

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

  // For Android and Web, use Tabs with custom floating tab bar to prevent remounting
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          lazy: false, // Prevent lazy loading to keep components mounted
          unmountOnBlur: false, // Keep screens mounted when navigating away
        }}
        tabBar={() => null} // Hide default tab bar
      >
        <Tabs.Screen 
          name="(home)" 
          options={{
            href: '/(tabs)/(home)/',
          }}
        />
        <Tabs.Screen 
          name="fixedbills"
          options={{
            href: '/(tabs)/fixedbills',
          }}
        />
        <Tabs.Screen 
          name="planning"
          options={{
            href: '/(tabs)/planning',
          }}
        />
        <Tabs.Screen 
          name="accounts"
          options={{
            href: '/(tabs)/accounts',
          }}
        />
        <Tabs.Screen 
          name="myaccount"
          options={{
            href: '/(tabs)/myaccount',
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
      </Tabs>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
