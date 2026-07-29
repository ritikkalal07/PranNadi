/**
 * History screen — chronological scan list with filter and search.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Card } from '../../src/components/ui/Card';
import { ScanItemSkeleton } from '../../src/components/ui/Skeleton';
import { SeverityBadge } from '../../src/components/result/SeverityBadge';
import { Chip } from '../../src/components/ui/Chip';
import { getHistory } from '../../src/services/history.service';
import { getRemedyForDisease } from '../../src/services/remedy.service';
import { useAppStore } from '../../src/store/useAppStore';
import { useScanStore } from '../../src/store/useScanStore';
import type { ScanRecord, Severity } from '../../src/data/types';

interface EnrichedScan extends ScanRecord {
  diseaseName: string;
  severity: Severity;
}

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useAppStore(s => s.language);
  const lastResult = useScanStore(s => s.result);

  const [scans, setScans] = useState<EnrichedScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const records = await getHistory({ searchQuery }, 50, 0);
      const enriched = await Promise.all(
        records.map(async r => {
          try {
            const rwd = await getRemedyForDisease(r.diseaseId, language);
            return {
              ...r,
              diseaseName: rwd.disease.name,
              severity: rwd.disease.severityDefault,
            };
          } catch {
            return { ...r, diseaseName: r.diseaseId, severity: 'moderate' as Severity };
          }
        })
      );
      setScans(enriched);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, language, lastResult]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleScanPress = (scan: EnrichedScan) => {
    useScanStore.setState({ result: null }); // Force re-hydration from DB
    router.push(`/result/${scan.id}`);
  };

  const renderItem = ({ item }: { item: EnrichedScan }) => (
    <TouchableOpacity onPress={() => handleScanPress(item)} activeOpacity={0.75}>
      <Card style={styles.scanCard} padding="sm">
        <View style={styles.scanRow}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
          )}
          <View style={styles.scanInfo}>
            <Text style={styles.diseaseName} numberOfLines={1}>
              {item.diseaseName}
            </Text>
            <Text style={styles.cropType}>
              {t(`crops.${item.cropType}`)} · {Math.round(item.confidence * 100)}%
            </Text>
            <View style={styles.row}>
              <SeverityBadge severity={item.severity} label={t(`severity.${item.severity}`)} size="sm" />
              <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('history.title')}</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.text.tertiary} strokeWidth={1.5} />
          <TextInput
            testID="history-search"
            style={styles.searchInput}
            placeholder={t('history.search')}
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map(k => <ScanItemSkeleton key={k} />)}
        </View>
      ) : scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t('history.empty')}</Text>
          <Text style={styles.emptySubtitle}>{t('history.emptySub')}</Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.base },
  header: {
    padding: Layout.screenPaddingHorizontal,
    gap: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
  },
  title: { ...TextStyles.displayMedium, color: Colors.text.primary },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.bg.subtle,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  list: { padding: Layout.screenPaddingHorizontal, paddingBottom: Spacing[8] },
  skeletonList: { padding: Layout.screenPaddingHorizontal, gap: Spacing[3] },
  scanCard: { overflow: 'hidden' },
  scanRow: { flexDirection: 'row', gap: Spacing[3], alignItems: 'center' },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.subtle,
  },
  thumbnailPlaceholder: { backgroundColor: Colors.bg.subtle },
  scanInfo: { flex: 1, gap: Spacing[1] },
  diseaseName: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  cropType: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timestamp: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing[3] },
  emptyTitle: { ...TextStyles.headingMedium, color: Colors.text.primary },
  emptySubtitle: { ...TextStyles.bodyMedium, color: Colors.text.secondary, textAlign: 'center' },
});
