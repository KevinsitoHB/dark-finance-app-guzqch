
import { Tabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';
import { GlassView } from 'expo-glass-effect';
import { StyleSheet } from 'react-native';

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
        },
        tabBarBackground: () => (
          <GlassView 
            style={StyleSheet.absoluteFill}
            glassEffectStyle="regular"
            tintColor="rgba(12, 26, 18, 0.7)"
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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
            sfSymbol: 'calendar',
            hierarchicalColor: color,
          }),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => ({
            sfSymbol: 'building.columns.fill',
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
    </Tabs>
  );
}
