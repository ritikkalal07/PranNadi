import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Leaf, History, Activity, Settings } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius } from '../../src/design-system/spacing';
import { Card } from '../../src/components/ui/Card';
import { useAppStore } from '../../src/store/useAppStore';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedCrop = useAppStore(s => s.selectedCrop) || 'general';

  // Format date for greeting
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('greeting.morning') || 'Good Morning');
    else if (hour < 18) setGreeting(t('greeting.afternoon') || 'Good Afternoon');
    else setGreeting(t('greeting.evening') || 'Good Evening');
  }, [t]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {t('home.farmer') || 'Farmer'}!</Text>
          <Text style={styles.subtitle}>{t('home.subtitle') || "Let's keep your crops healthy today."}</Text>
        </View>

        {/* Current Crop Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.activeCrop') || 'Active Crop'}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} activeOpacity={0.8}>
            <Card style={styles.cropCard}>
              <View style={styles.cropIconBg}>
                <Leaf size={24} color={Colors.brand.primary} />
              </View>
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{t(`crops.${selectedCrop}`) || (selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1))}</Text>
                <Text style={styles.cropStatus}>{t('home.monitoringActive') || 'Monitoring active'}</Text>
              </View>
              <View style={styles.changeBtn}>
                <Text style={styles.changeBtnText}>{t('home.change') || 'Change'}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions') || 'Quick Actions'}</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => router.push('/scan')}
            >
              <View style={[styles.actionIconBg, { backgroundColor: Colors.brand.primary }]}>
                <Leaf size={24} color={Colors.bg.surface} />
              </View>
              <Text style={styles.actionText}>{t('home.newScan') || 'New Scan'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => router.push('/history')}
            >
              <View style={[styles.actionIconBg, { backgroundColor: Colors.text.tertiary }]}>
                <History size={24} color={Colors.bg.surface} />
              </View>
              <Text style={styles.actionText}>{t('home.viewHistory') || 'View History'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Disease Outbreak Alerts (Mock) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.localAlerts') || 'Local Alerts'}</Text>
          <Card style={styles.alertCard}>
            <Activity size={24} color={Colors.status.severe} />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>{t('home.blightWarning') || 'Blight Warning'}</Text>
              <Text style={styles.alertDesc}>{t('home.blightDesc') || 'High risk of blight reported in your area due to recent humidity.'}</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
  scrollContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  header: {
    marginBottom: Spacing[6],
  },
  greeting: {
    fontFamily: FontFamily.heading.bold,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
    marginBottom: Spacing[4],
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
  },
  cropIconBg: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.brand.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[4],
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
  },
  cropStatus: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
    marginTop: 2,
  },
  changeBtn: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.bg.base,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  changeBtnText: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    alignItems: 'center',
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  actionText: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[4],
    backgroundColor: '#FEF2F2', // Light red surface
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  alertInfo: {
    flex: 1,
    marginLeft: Spacing[4],
  },
  alertTitle: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.base,
    color: Colors.status.severe,
    marginBottom: Spacing[2],
  },
  alertDesc: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
