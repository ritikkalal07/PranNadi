/**
 * Settings screen — language, model info, community sync, field location.
 */

import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../src/i18n';
import { Globe, Cpu, Users, MapPin, Info } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { useAppStore } from '../../src/store/useAppStore';
import { MODEL_VERSIONS } from '../../src/ml/confidenceThresholds';
import type { Locale } from '../../src/data/types';

const LANGUAGES: Array<{ key: Locale; label: string; nativeLabel: string }> = [
  { key: 'en', label: 'English', nativeLabel: 'English' },
  { key: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
];

function SettingRow({ icon, title, subtitle, children }: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={settingStyles.row}>
      <View style={settingStyles.iconWrap}>{icon}</View>
      <View style={settingStyles.labelWrap}>
        <Text style={settingStyles.title}>{title}</Text>
        {subtitle && <Text style={settingStyles.subtitle}>{subtitle}</Text>}
      </View>
      {children && <View style={settingStyles.control}>{children}</View>}
    </View>
  );
}

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[4],
    gap: Spacing[3],
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: { flex: 1, gap: 2 },
  title: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  subtitle: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  control: {},
});

export default function SettingsScreen() {
  const { t } = useTranslation();
  const language = useAppStore(s => s.language);
  const communitySync = useAppStore(s => s.communitySync);
  const setLanguage = useAppStore(s => s.setLanguage);
  const setCommunitySync = useAppStore(s => s.setCommunitySync);

  const handleLanguageChange = (lang: Locale) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.pageTitle}>{t('settings.title')}</Text>

        {/* Language */}
        <Card style={styles.section} padding="md">
          <SettingRow
            icon={<Globe size={18} color={Colors.brand.primary} strokeWidth={1.5} />}
            title={t('settings.language')}
          />
          <View style={styles.languageChips}>
            {LANGUAGES.map(lang => (
              <Chip
                testID={`language-${lang.key}`}
                key={lang.key}
                label={lang.nativeLabel}
                selected={language === lang.key}
                onPress={() => handleLanguageChange(lang.key)}
              />
            ))}
          </View>
        </Card>

        {/* Model info */}
        <Card style={styles.section} padding="md">
          <SettingRow
            icon={<Cpu size={18} color={Colors.brand.primary} strokeWidth={1.5} />}
            title={t('settings.modelInfo')}
          />
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.modelVersion')}</Text>
              <Text style={styles.infoValue}>{MODEL_VERSIONS.fast}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.dataVersion')}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </Card>

        {/* Community sync */}
        <Card style={styles.section} padding="md">
          <SettingRow
            icon={<Users size={18} color={Colors.brand.primary} strokeWidth={1.5} />}
            title={t('settings.communitySync')}
            subtitle={t('settings.communitySyncSub')}
          >
            <Switch
              testID="community-sync-toggle"
              value={communitySync}
              onValueChange={setCommunitySync}
              trackColor={{
                false: Colors.border.default,
                true: Colors.brand.primaryLight,
              }}
              thumbColor={communitySync ? Colors.brand.primary : Colors.text.tertiary}
            />
          </SettingRow>
        </Card>

        {/* About */}
        <Card style={styles.section} padding="md">
          <SettingRow
            icon={<Info size={18} color={Colors.brand.primary} strokeWidth={1.5} />}
            title={t('settings.about')}
          />
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.version')}</Text>
              <Text style={styles.infoValue}>1.0.0 (build 1)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Competition</Text>
              <Text style={styles.infoValue}>Maverick Effect AI 2026</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.base },
  content: {
    padding: Layout.screenPaddingHorizontal,
    gap: Spacing[4],
    paddingBottom: Spacing[12],
  },
  pageTitle: {
    ...TextStyles.displayMedium,
    color: Colors.text.primary,
    marginBottom: Spacing[2],
  },
  section: {},
  languageChips: {
    flexDirection: 'row',
    gap: Spacing[2],
    paddingTop: Spacing[2],
  },
  infoList: { gap: Spacing[1] },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing[2],
  },
  infoLabel: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.default,
  },
});
