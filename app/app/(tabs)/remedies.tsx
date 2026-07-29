/**
 * Remedy Library screen — browse all diseases offline, searchable by name or crop.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Search, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { SeverityBadge } from '../../src/components/result/SeverityBadge';
import { RemedyItemSkeleton } from '../../src/components/ui/Skeleton';
import { listAllDiseases } from '../../src/services/remedy.service';
import type { Disease, CropType } from '../../src/data/types';
import { useAppStore } from '../../src/store/useAppStore';

const CROP_FILTERS: Array<{ key: CropType | 'all'; label: string }> = [
  { key: 'all', label: 'remedies.allCrops' },
  { key: 'tomato', label: 'crops.tomato' },
  { key: 'rice', label: 'crops.rice' },
  { key: 'wheat', label: 'crops.wheat' },
  { key: 'maize', label: 'crops.maize' },
  { key: 'cotton', label: 'crops.cotton' },
  { key: 'potato', label: 'crops.potato' },
  { key: 'chilli', label: 'crops.chilli' },
  { key: 'groundnut', label: 'crops.groundnut' },
  { key: 'sugarcane', label: 'crops.sugarcane' },
];

export default function RemediesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useAppStore(s => s.language);

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filtered, setFiltered] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('all');

  useEffect(() => {
    setLoading(true);
    listAllDiseases(undefined, language).then(d => {
      setDiseases(d);
      setFiltered(d);
      setLoading(false);
    });
  }, [language]);

  useEffect(() => {
    let result = diseases;
    if (selectedCrop !== 'all') {
      result = result.filter(d => d.cropType === selectedCrop);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        d => d.name.toLowerCase().includes(q) || d.cropType.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, selectedCrop, diseases]);

  const renderItem = ({ item }: { item: Disease }) => (
    <TouchableOpacity
      testID={`remedy-item-${item.id}`}
      onPress={() => router.push(`/remedy/${item.id}`)}
      activeOpacity={0.75}
    >
      <Card style={styles.item} padding="md">
        <View style={styles.itemRow}>
          <View style={styles.itemContent}>
            <Text style={styles.diseaseName}>{item.name}</Text>
            <Text style={styles.cropType}>{t(`crops.${item.cropType}`)}</Text>
            <SeverityBadge
              severity={item.severityDefault}
              label={t(`severity.${item.severityDefault}`)}
              size="sm"
            />
          </View>
          <ChevronRight size={20} color={Colors.text.tertiary} strokeWidth={1.5} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('remedies.title')}</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.text.tertiary} strokeWidth={1.5} />
          <TextInput
            testID="remedy-search"
            style={styles.searchInput}
            placeholder={t('remedies.search')}
            placeholderTextColor={Colors.text.tertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Crop filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          {CROP_FILTERS.map(f => (
            <Chip
              key={f.key}
              testID={`crop-filter-${f.key}`}
              label={t(f.label)}
              selected={selectedCrop === f.key}
              onPress={() => setSelectedCrop(f.key)}
              style={{ marginRight: Spacing[2] }}
            />
          ))}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4].map(k => <RemedyItemSkeleton key={k} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
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
    paddingBottom: Spacing[4],
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
  filtersRow: { marginBottom: -Spacing[2] },
  list: { padding: Layout.screenPaddingHorizontal, paddingBottom: Spacing[8] },
  skeletonList: { padding: Layout.screenPaddingHorizontal, gap: Spacing[3] },
  item: { overflow: 'hidden' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: { flex: 1, gap: Spacing[2] },
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
});
