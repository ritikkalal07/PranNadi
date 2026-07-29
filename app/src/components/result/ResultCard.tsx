/**
 * ResultCard — animated card that rises from bottom with spring physics.
 * Shows disease name, confidence, severity, explanation, and links to remedy.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Info, Cpu } from 'lucide-react-native';
import { Colors } from '../../design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../design-system/typography';
import { Spacing, Radius } from '../../design-system/spacing';
import { SpringConfig } from '../../design-system/motion';
import { ConfidenceMeter } from './ConfidenceMeter';
import { SeverityBadge, SeverityAmbient } from './SeverityBadge';
import { Button } from '../ui/Button';
import type { DiagnosisResult } from '../../data/types';

interface ResultCardProps {
  result: DiagnosisResult;
  onViewRemedy: () => void;
  onScanAgain: () => void;
  onListen: () => void;
}

export function ResultCard({ result, onViewRemedy, onScanAgain, onListen }: ResultCardProps) {
  const { t } = useTranslation();

  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, SpringConfig.resultReveal);
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const severityLabel = t(`severity.${result.severity}`);
  const modelLabel = t(`modelStage.${result.modelStage}`);

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <SeverityAmbient severity={result.severity} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.diseaseName} numberOfLines={2}>
              {result.diseaseName}
            </Text>
            <SeverityBadge severity={result.severity} label={severityLabel} />
          </View>
          <Text style={styles.cropType}>
            {t(`crops.${result.cropType}`)} · {new Date(result.timestamp).toLocaleDateString()}
          </Text>
        </View>

        {/* Confidence meter */}
        <View style={styles.section}>
          <ConfidenceMeter
            confidence={result.confidence}
            severity={result.severity}
            label={t('result.confidence')}
          />
        </View>

        {/* Why this diagnosis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={16} color={Colors.text.secondary} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>{t('result.whyThis')}</Text>
          </View>
          <Text style={styles.explanation}>{result.remedy.disease.explanation}</Text>
        </View>

        {/* Disclaimer for severe results */}
        {result.severity === 'severe' && (
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{t('result.disclaimer')}</Text>
          </View>
        )}

        {/* Model used indicator */}
        <View style={styles.modelRow}>
          <Cpu size={12} color={Colors.text.tertiary} strokeWidth={1.5} />
          <Text style={styles.modelLabel}>{t('result.modelUsed')}: {modelLabel}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label={t('result.remedy')}
            onPress={onViewRemedy}
            variant="primary"
            size="lg"
            fullWidth
            testID="view-remedy-button"
          />
          <View style={styles.secondaryActions}>
            <Button
              label={t('result.listen')}
              onPress={onListen}
              variant="secondary"
              size="md"
              style={styles.flex1}
              testID="listen-button"
            />
            <Button
              label={t('result.scanAgain')}
              onPress={onScanAgain}
              variant="ghost"
              size="md"
              style={styles.flex1}
              testID="scan-again-button"
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing[6],
    gap: Spacing[6],
  },
  header: {
    gap: Spacing[2],
  },
  titleRow: {
    gap: Spacing[3],
  },
  diseaseName: {
    ...TextStyles.displayMedium,
    color: Colors.text.primary,
  },
  cropType: {
    ...TextStyles.bodySmall,
    color: Colors.text.tertiary,
  },
  section: {
    gap: Spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionTitle: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  explanation: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  disclaimer: {
    backgroundColor: Colors.status.severeLight,
    borderRadius: Radius.md,
    padding: Spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: Colors.status.severe,
  },
  disclaimerText: {
    ...TextStyles.bodySmall,
    color: Colors.status.severe,
    lineHeight: 20,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  modelLabel: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  actions: {
    gap: Spacing[3],
    paddingBottom: Spacing[4],
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  flex1: { flex: 1 },
});
