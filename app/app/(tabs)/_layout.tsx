/**
 * Tab navigator — Scan / History / Remedies / Settings.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scan, History, BookOpen, Settings } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize } from '../../src/design-system/typography';
import { Layout } from '../../src/design-system/spacing';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: Colors.bg.surface,
          borderTopColor: Colors.border.default,
          height: Layout.tabBarHeight + 16,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.body.medium,
          fontSize: FontSize.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('tabs.scan'),
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.brand.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -32,
                shadowColor: Colors.brand.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Scan size={32} color={Colors.bg.surface} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="remedies"
        options={{
          title: t('tabs.remedies'),
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
