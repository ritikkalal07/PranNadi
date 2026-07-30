/**
 * Inference service — the single entry point for all diagnosis operations.
 * Orchestrates: preprocess → ML classify → remedy lookup → history write.
 * Nothing outside this service knows that two models exist.
 */

import { File, Directory, Paths } from 'expo-file-system';
import { preprocessImage } from '../ml/preprocess';
import { useDiseaseClassifier } from '../ml/useDiseaseClassifier';
import { getRemedyForDisease } from './remedy.service';
import { saveScan } from './history.service';
import type { DiagnosisResult, CropType, Locale } from '../data/types';
import remediesEn from '../data/remedies/remedies.en.json';

/** Copy captured image to a persistent local path and return new URI */
async function persistImage(tempUri: string): Promise<string> {
  const fileName = `scan_${Date.now()}.jpg`;
  const destDir = new Directory(Paths.document, 'scans');
  destDir.create({ intermediates: true, idempotent: true });
  
  const destFile = new File(destDir, fileName);
  new File(tempUri).copy(destFile);
  
  return destFile.uri;
}

/**
 * Main diagnosis function.
 * Takes an image URI (from camera or gallery), runs inference, looks up remedy,
 * persists history record, and returns a complete DiagnosisResult.
 */
export async function diagnose(
  imageUri: string,
  cropType: CropType = 'general',
  locale: Locale = 'en',
  classify: (tensorBuffer: Float32Array | null, cropType?: CropType) => Promise<any>
): Promise<DiagnosisResult> {
  // 1. Preprocess image
  const preprocessed = await preprocessImage(imageUri);

  // 2. Run classifier (using the hook provided by the component)
  const classResult = await classify(preprocessed?.tensor ?? null, cropType);

  // 3. Look up remedy from local DB
  const diseaseId = classResult.isRejected ? 'not_a_plant' : classResult.diseaseId;
  const remedyWithDisease = await getRemedyForDisease(diseaseId, locale);

  // 4. Persist image to local document directory
  const persistedImageUri = await persistImage(imageUri);

  // 5. Build result
  const timestamp = Date.now();
  const severity = (remediesEn as any)[diseaseId]?.severityDefault ?? 'moderate';

  const result: DiagnosisResult = {
    diseaseId: classResult.diseaseId,
    diseaseName: remedyWithDisease.disease.name,
    confidence: classResult.confidence,
    severity,
    cropType,
    modelVersion: classResult.modelVersion,
    modelStage: classResult.modelStage,
    remedy: remedyWithDisease,
    timestamp,
  };

  // 6. Save scan to history
  await saveScan({
    id: `scan_${timestamp}`,
    diseaseId: classResult.diseaseId,
    confidence: classResult.confidence,
    cropType,
    imageUri: persistedImageUri,
    modelVersion: classResult.modelVersion,
    modelStage: classResult.modelStage,
    createdAt: timestamp,
  });

  return result;
}
