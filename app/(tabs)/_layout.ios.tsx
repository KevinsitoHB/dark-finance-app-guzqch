
import { Tabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.subtextGray,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
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
