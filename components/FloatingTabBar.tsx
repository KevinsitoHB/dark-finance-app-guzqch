
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';

export interface TabBarItem {
  name: string;
  route: string;
  icon: any;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname === route || pathname.startsWith(route);
  };

  const TabBarContent = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <IconSymbol
              ios_icon_name={tab.icon}
              android_material_icon_name={tab.icon}
              size={24}
              color={active ? colors.green : colors.subtextGray}
            />
            <Text style={[styles.label, { color: active ? colors.green : colors.subtextGray }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <GlassView 
          glassEffectStyle="regular" 
          style={styles.glassContainer}
          tintColor="rgba(12, 26, 18, 0.7)"
        >
          <View style={styles.borderTop} />
          <TabBarContent />
        </GlassView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <View style={styles.borderTop} />
        <TabBarContent />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  glassContainer: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  blurContainer: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
