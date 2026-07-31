/**
 * Result screen — shows diagnosis result with animations.
 * Deep-linkable from history: /result/[scanId]
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../src/design-system/colors';
import { ResultCard } from '../../src/components/result/ResultCard';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { useScanStore } from '../../src/store/useScanStore';
import { useAppStore } from '../../src/store/useAppStore';
import { getRemedyForDisease } from '../../src/services/remedy.service';
import { getScanById } from '../../src/services/history.service';
import type { DiagnosisResult } from '../../src/data/types';
import { Spacing, Layout } from '../../src/design-system/spacing';

export default function ResultScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const language = useAppStore(s => s.language);

  const storeResult = useScanStore(s => s.result);
  const [result, setResult] = useState<DiagnosisResult | null>(storeResult);
  const [loading, setLoading] = useState(!storeResult);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (storeResult) {
      setResult(storeResult);
      setLoading(false);
      return;
    }

    // Re-hydrate from history DB if coming from a deep link
    if (scanId) {
      getScanById(scanId)
        .then(async scan => {
          if (!scan) return;
          const remedyWithDisease = await getRemedyForDisease(scan.diseaseId, language);
          setResult({
            diseaseId: scan.diseaseId,
            diseaseName: remedyWithDisease.disease.name,
            confidence: scan.confidence,
            severity: remedyWithDisease.disease.severityDefault,
            cropType: scan.cropType,
            modelVersion: scan.modelVersion,
            modelStage: scan.modelStage,
            remedy: remedyWithDisease,
            timestamp: scan.createdAt,
          });
        })
        .finally(() => setLoading(false));
    }
    
    return () => {
      Speech.stop();
      setIsSpeaking(false);
    };
  }, [scanId]);

  const handleViewRemedy = () => {
    if (!result) return;
    Speech.stop();
    setIsSpeaking(false);
    router.push(`/remedy/${result.diseaseId}`);
  };

  const handleScanAgain = () => {
    Speech.stop();
    setIsSpeaking(false);
    router.replace('/(tabs)/scan');
  };

  const handleListen = useCallback(async () => {
    if (!result) return;
    
    const speaking = await Speech.isSpeakingAsync();
    if (speaking || isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const text = `${result.diseaseName}. ${t('result.confidence')}: ${Math.round(result.confidence * 100)} percent. ${result.remedy.disease.explanation}`;
    setIsSpeaking(true);
    Speech.speak(text, {
      language,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [result, language, isSpeaking, t]);

  if (loading || !result) {
    return (
      <SafeAreaView style={styles.loading}>
        <View style={{ gap: Spacing[4], padding: Layout.screenPaddingHorizontal }}>
          <Skeleton height={32} width="70%" />
          <Skeleton height={20} width="40%" />
          <Skeleton height={8} />
          <Skeleton height={80} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dark overlay */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {/* Result card — springs up from bottom */}
      <View style={styles.cardContainer}>
        <ResultCard
          result={result}
          onViewRemedy={handleViewRemedy}
          onScanAgain={handleScanAgain}
          onListen={handleListen}
          isSpeaking={isSpeaking}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text.primary,
  },
  overlay: {
    backgroundColor: 'rgba(28, 31, 27, 0.5)',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: '25%',
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
});
