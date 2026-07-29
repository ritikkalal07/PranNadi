/**
 * Onboarding screen — first launch: language selection, permissions, crop selection.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCameraPermissions } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Leaf, ChevronRight } from 'lucide-react-native';
import i18n from '../../src/i18n';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { useAppStore } from '../../src/store/useAppStore';
import type { Locale, CropType } from '../../src/data/types';

type Step = 'language' | 'permissions' | 'crop';

const LANGUAGES: Array<{ key: Locale; label: string }> = [
  { key: 'en', label: 'English' },
  { key: 'hi', label: 'हिन्दी' },
  { key: 'gu', label: 'ગુજરાતી' },
];

const CROPS: Array<{ key: CropType; emoji: string }> = [
  { key: 'tomato', emoji: '🍅' },
  { key: 'rice', emoji: '🌾' },
  { key: 'wheat', emoji: '🌿' },
  { key: 'maize', emoji: '🌽' },
  { key: 'cotton', emoji: '☁️' },
  { key: 'potato', emoji: '🥔' },
  { key: 'chilli', emoji: '🌶️' },
  { key: 'groundnut', emoji: '🥜' },
  { key: 'sugarcane', emoji: '🎋' },
  { key: 'general', emoji: '🌱' },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('language');

  const setLanguage = useAppStore(s => s.setLanguage);
  const setSelectedCrop = useAppStore(s => s.setSelectedCrop);
  const setOnboardingComplete = useAppStore(s => s.setOnboardingComplete);
  const language = useAppStore(s => s.language);
  const selectedCrop = useAppStore(s => s.selectedCrop);

  const finish = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)/scan');
  };

  const handleLanguageSelect = (lang: Locale) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const renderStep = () => {
    switch (step) {
      case 'language':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('onboarding.languageTitle')}</Text>
            <View style={styles.langOptions}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l.key}
                  testID={`lang-${l.key}`}
                  style={[styles.langOption, language === l.key && styles.langOptionSelected]}
                  onPress={() => handleLanguageSelect(l.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langLabel, language === l.key && styles.langLabelSelected]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              testID="next-language"
              label={t('onboarding.next')}
              onPress={() => setStep('permissions')}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        );

      case 'permissions':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('onboarding.permissionsTitle')}</Text>
            <Text style={styles.stepSubtitle}>{t('onboarding.permissionsSub')}</Text>
            <Button
              testID="grant-permission"
              label={permission?.granted ? t('onboarding.next') : t('onboarding.grantPermission')}
              onPress={async () => {
                if (!permission?.granted) {
                  await requestPermission();
                }
                setStep('crop');
              }}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              testID="skip-permission"
              label={t('onboarding.skip')}
              onPress={() => setStep('crop')}
              variant="ghost"
              size="md"
              fullWidth
            />
          </View>
        );

      case 'crop':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('onboarding.cropTitle')}</Text>
            <Text style={styles.stepSubtitle}>{t('onboarding.cropSub')}</Text>
            <View style={styles.cropGrid}>
              {CROPS.map(c => (
                <TouchableOpacity
                  key={c.key}
                  testID={`crop-${c.key}`}
                  style={[styles.cropOption, selectedCrop === c.key && styles.cropOptionSelected]}
                  onPress={() => setSelectedCrop(c.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cropEmoji}>{c.emoji}</Text>
                  <Text style={[styles.cropLabel, selectedCrop === c.key && styles.cropLabelSelected]}>
                    {t(`crops.${c.key}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              testID="get-started"
              label={t('onboarding.getStarted')}
              onPress={finish}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <Leaf size={40} color={Colors.bg.surface} strokeWidth={1.5} />
        </View>
        <Text style={styles.appName}>{t('onboarding.welcome')}</Text>
        <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {(['language', 'permissions', 'crop'] as Step[]).map((s, i) => (
          <View
            key={s}
            style={[styles.dot, step === s && styles.dotActive]}
          />
        ))}
      </View>

      {/* Step content */}
      <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepInner}>
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.base },
  hero: {
    backgroundColor: Colors.brand.primary,
    padding: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing[10],
    alignItems: 'center',
    gap: Spacing[2],
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  appName: {
    fontFamily: FontFamily.heading.bold,
    fontSize: FontSize['2xl'],
    color: Colors.bg.surface,
  },
  tagline: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.8)',
  },
  subtitle: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: Spacing[2],
    justifyContent: 'center',
    paddingVertical: Spacing[4],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border.default,
  },
  dotActive: {
    backgroundColor: Colors.brand.primary,
    width: 20,
  },
  stepContainer: { flex: 1 },
  stepInner: { padding: Layout.screenPaddingHorizontal, gap: Spacing[5] },
  stepContent: { gap: Spacing[5] },
  stepTitle: { ...TextStyles.headingLarge, color: Colors.text.primary },
  stepSubtitle: { ...TextStyles.bodyMedium, color: Colors.text.secondary, lineHeight: 24 },
  langOptions: { gap: Spacing[3] },
  langOption: {
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
  },
  langOptionSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primaryLight,
  },
  langLabel: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  langLabelSelected: { color: Colors.brand.primary },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  cropOption: {
    width: '45%',
    padding: Spacing[3],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    alignItems: 'center',
    gap: Spacing[1],
  },
  cropOptionSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primaryLight,
  },
  cropEmoji: { fontSize: 24 },
  cropLabel: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  cropLabelSelected: { color: Colors.brand.primary },
});
