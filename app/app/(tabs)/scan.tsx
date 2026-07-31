/**
 * Scan screen — camera view, capture, gallery import, and inference flow.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { Image as ImageIcon, Zap } from 'lucide-react-native';
import { Colors } from '../../src/design-system/colors';
import { FontFamily, FontSize, TextStyles } from '../../src/design-system/typography';
import { Spacing, Radius, Layout } from '../../src/design-system/spacing';
import { Button } from '../../src/components/ui/Button';
import { CaptureButton } from '../../src/components/scan/CaptureButton';
import { useScanStore } from '../../src/store/useScanStore';
import { useAppStore } from '../../src/store/useAppStore';
import { diagnose } from '../../src/services/inference.service';
import { useDiseaseClassifier } from '../../src/ml/useDiseaseClassifier';

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<ExpoCameraView>(null);

  const selectedCrop = useAppStore(s => s.selectedCrop);
  const language = useAppStore(s => s.language);
  const { setCapturing, setInferring, setResult, setError } = useScanStore();
  const { classify } = useDiseaseClassifier();

  const handleCapture = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      // Take photo
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (!photo?.uri) throw new Error('No photo captured');

      setCapturing(photo.uri);
      setInferring();

      // Run inference
      const result = await diagnose(photo.uri, selectedCrop ?? 'general', language, classify);
      setResult(result);

      // Navigate to result
      router.push(`/result/${result.timestamp}`);
    } catch (err: any) {
      setError(err.message ?? 'Diagnosis failed');
      Alert.alert('Error', 'Could not process the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGallery = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (pickerResult.canceled || !pickerResult.assets[0]) return;

    const uri = pickerResult.assets[0].uri;
    setIsAnalyzing(true);
    setCapturing(uri);
    setInferring();

    try {
      const result = await diagnose(uri, selectedCrop ?? 'general', language, classify);
      setResult(result);
      router.push(`/result/${result.timestamp}`);
    } catch (err: any) {
      setError(err.message ?? 'Diagnosis failed');
      Alert.alert('Error', 'Could not process the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Camera permission not granted
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>{t('onboarding.permissionsTitle')}</Text>
          <Text style={styles.permissionSub}>{t('onboarding.permissionsSub')}</Text>
          <Button
            label={t('onboarding.grantPermission')}
            onPress={requestPermission}
            variant="primary"
            size="lg"
            fullWidth
          />
          <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
            <Text style={[styles.permissionSub, { marginBottom: 16 }]}>Or</Text>
            <Button
              label={t('scan.gallery')}
              onPress={handleGallery}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <ExpoCameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        flash="off"
      />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerWrapper} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="none">
          <Text style={styles.headerTitle}>{t('scan.title')}</Text>
          <Text style={styles.headerSub}>{t('scan.subtitle')}</Text>
        </View>
        
        {/* NDVI & Outbreak Mini Widgets (Mocked for Expo Go) */}
        <View style={styles.widgetsContainer} pointerEvents="none">
          <View style={styles.widgetCard}>
            <Text style={styles.widgetTitle}>Field NDVI</Text>
            <Text style={styles.widgetValue}>0.76 (Healthy)</Text>
          </View>
          <View style={styles.widgetCard}>
            <Text style={styles.widgetTitle}>Local Alerts</Text>
            <Text style={styles.widgetValueAlert}>2 Blight cases</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Scan frame overlay */}
      <View style={styles.frameOverlay} pointerEvents="none">
        <View style={styles.corner_tl} />
        <View style={styles.corner_tr} />
        <View style={styles.corner_bl} />
        <View style={styles.corner_br} />
      </View>

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <View style={styles.analyzingBanner} pointerEvents="none">
          <Zap size={16} color={Colors.brand.primary} strokeWidth={2} />
          <Text style={styles.analyzingText}>{t('scan.analyzing')}</Text>
        </View>
      )}

      {/* Controls */}
      <SafeAreaView edges={['bottom']} style={styles.controlsWrapper} pointerEvents="box-none">
        <View style={styles.controls} pointerEvents="box-none">
          {/* Gallery button */}
          <TouchableOpacity
            testID="gallery-button"
            onPress={handleGallery}
            style={styles.sideButton}
            disabled={isAnalyzing}
          >
            <ImageIcon size={24} color={Colors.bg.surface} strokeWidth={1.5} />
            <Text style={styles.sideButtonLabel}>{t('scan.gallery')}</Text>
          </TouchableOpacity>

          {/* Capture button */}
          <CaptureButton onPress={handleCapture} disabled={isAnalyzing} />

          {/* Spacer */}
          <View style={styles.sideButton} pointerEvents="none" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;
const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.text.primary },
  camera: { flex: 1 },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.bg.base,
    justifyContent: 'center',
  },
  permissionContent: {
    padding: Layout.screenPaddingHorizontal,
    gap: Spacing[6],
    alignItems: 'center',
  },
  permissionTitle: {
    ...TextStyles.headingLarge,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  permissionSub: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  header: {
    padding: Spacing[4],
    gap: Spacing[1],
  },
  headerTitle: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.lg,
    color: Colors.bg.surface,
  },
  headerSub: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  headerWrapper: {
    paddingBottom: Spacing[4],
  },
  widgetsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
    marginTop: Spacing[3],
  },
  widgetCard: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Radius.md,
    padding: Spacing[3],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  widgetTitle: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing[1],
  },
  widgetValue: {
    fontFamily: FontFamily.heading.bold,
    fontSize: FontSize.sm,
    color: Colors.brand.primaryLight,
  },
  widgetValueAlert: {
    fontFamily: FontFamily.heading.bold,
    fontSize: FontSize.sm,
    color: Colors.status.severe,
  },
  frameOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    marginTop: -FRAME_SIZE / 2,
    marginLeft: -FRAME_SIZE / 2,
  },
  corner_tl: {
    position: 'absolute', top: 0, left: 0,
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderColor: Colors.bg.surface,
  },
  corner_tr: {
    position: 'absolute', top: 0, right: 0,
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderColor: Colors.bg.surface,
  },
  corner_bl: {
    position: 'absolute', bottom: 0, left: 0,
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderColor: Colors.bg.surface,
  },
  corner_br: {
    position: 'absolute', bottom: 0, right: 0,
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderColor: Colors.bg.surface,
  },
  analyzingBanner: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.bg.surface,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    marginTop: FRAME_SIZE / 2 + 16,
  },
  analyzingText: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
  },
  controlsWrapper: { flex: 1, justifyContent: 'flex-end' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[8],
    paddingBottom: Spacing[8],
  },
  sideButton: {
    width: 56,
    alignItems: 'center',
    gap: Spacing[1],
  },
  sideButtonLabel: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
});
