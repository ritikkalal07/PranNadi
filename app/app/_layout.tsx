/**
 * Root layout — initializes fonts, SQLite DB, i18n, and navigation.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../src/i18n';
import { initializeDatabase } from '../src/data/db/seed';
import { useAppStore } from '../src/store/useAppStore';
import { Colors } from '../src/design-system/colors';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const language = useAppStore(s => s.language);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  useEffect(() => {
    initializeDatabase()
      .then(() => setDbReady(true))
      .catch(err => {
        console.error('[Root] DB init failed:', err);
        setDbReady(true); // Don't block UI on DB error
      });
  }, []);

  if (!fontsLoaded || !dbReady) {
    return <View style={styles.splash} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bg.base} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen
            name="result/[scanId]"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
});
