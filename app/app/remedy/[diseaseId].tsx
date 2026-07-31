/**
 * Remedy detail screen — full remedy for a diagnosed disease.
 * Accessible from result and remedy library.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { ArrowLeft, Volume2, VolumeX, CheckCircle, Shield, Leaf } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Card } from '../../src/components/ui/Card';
import { SeverityBadge } from '../../src/components/result/SeverityBadge';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { getRemedyForDisease } from '../../src/services/remedy.service';
import { useAppStore } from '../../src/store/useAppStore';
import type { RemedyWithDisease } from '../../src/data/types';

export default function RemedyDetailScreen() {
  const { diseaseId } = useLocalSearchParams<{ diseaseId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const language = useAppStore(s => s.language);
  const [data, setData] = useState<RemedyWithDisease | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!diseaseId) return;
    getRemedyForDisease(diseaseId, language)
      .then(setData)
      .finally(() => setLoading(false));
      
    return () => {
      Speech.stop();
      setIsSpeaking(false);
    };
  }, [diseaseId, language]);

  const handleListen = useCallback(async () => {
    if (!data) return;
    
    // Check if currently speaking
    const speaking = await Speech.isSpeakingAsync();
    if (speaking || isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const text = [
      data.disease.name,
      t('remedy.symptoms') + ': ' + data.disease.symptoms.join('. '),
      t('remedy.steps') + ': ' + data.remedy.steps.join('. '),
    ].join('. ');
    
    setIsSpeaking(true);
    Speech.speak(text, {
      language,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [data, language, isSpeaking, t]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ padding: Layout.screenPaddingHorizontal, gap: Spacing[4] }}>
          <Skeleton height={32} width="65%" />
          <Skeleton height={12} width="40%" />
          <Skeleton height={120} />
          <Skeleton height={200} />
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const { disease, remedy } = data;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity testID="back-button" onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text.primary} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerLabel} numberOfLines={1}>{disease.name}</Text>
        <TouchableOpacity testID="listen-button" onPress={handleListen} style={[styles.listenBtn, isSpeaking && styles.listenBtnActive]}>
          {isSpeaking ? (
            <VolumeX size={20} color={Colors.status.severe} strokeWidth={1.5} />
          ) : (
            <Volume2 size={20} color={Colors.brand.primary} strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Disease title + severity */}
        <View style={styles.titleSection}>
          <Text style={styles.diseaseName}>{disease.name}</Text>
          <View style={styles.meta}>
            <SeverityBadge
              severity={disease.severityDefault}
              label={t(`severity.${disease.severityDefault}`)}
            />
            <Text style={styles.cropType}>{t(`crops.${disease.cropType}`)}</Text>
          </View>
        </View>

        {/* Symptoms */}
        <Card padding="md">
          <SectionHeader icon={<Leaf size={16} color={Colors.brand.primary} strokeWidth={1.5} />} title={t('remedy.symptoms')} />
          {disease.symptoms.map((s, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{s}</Text>
            </View>
          ))}
        </Card>

        {/* Remedy steps */}
        <Card padding="md">
          <SectionHeader icon={<CheckCircle size={16} color={Colors.status.healthy} strokeWidth={1.5} />} title={t('remedy.steps')} />
          {remedy.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>

        {/* Preventive tips */}
        <Card padding="md">
          <SectionHeader icon={<Shield size={16} color={Colors.status.moderate} strokeWidth={1.5} />} title={t('remedy.prevention')} />
          {remedy.preventiveTips.map((tip, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: Colors.status.moderate }]} />
              <Text style={styles.bulletText}>{tip}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View style={headerStyles.row}>
      {icon}
      <Text style={headerStyles.label}>{title}</Text>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[4] },
  label: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    gap: Spacing[3],
  },
  backBtn: { padding: Spacing[1] },
  headerLabel: {
    flex: 1,
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  listenBtn: { padding: Spacing[1] },
  listenBtnActive: {
    backgroundColor: Colors.status.severeLight,
    borderRadius: Radius.full,
    padding: Spacing[2],
  },
  content: {
    padding: Layout.screenPaddingHorizontal,
    gap: Spacing[4],
    paddingBottom: Spacing[12],
  },
  titleSection: { gap: Spacing[3] },
  diseaseName: { ...TextStyles.headingLarge, color: Colors.text.primary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  cropType: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand.primary,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize.xs,
    color: Colors.brand.primary,
  },
  stepText: {
    flex: 1,
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
});
