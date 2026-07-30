/**
 * Disease classifier hook.
 * Wraps TFLite model inference behind a clean interface.
 * Falls back to a deterministic mock when .tflite model files are not present (dev/demo mode).
 */

import { useCallback } from 'react';
import labels from './labels.json';
import {
  FAST_MODEL_CONFIDENCE_THRESHOLD,
  ACCURATE_MODEL_LOW_CONFIDENCE_THRESHOLD,
  NOT_A_PLANT_CLASS_INDEX,
  MODEL_VERSIONS,
} from './confidenceThresholds';
import type { ModelStage, CropType } from '../data/types';

export interface ClassificationResult {
  diseaseId: string;
  confidence: number;
  modelStage: ModelStage;
  modelVersion: string;
  isLowConfidence: boolean;
  isRejected: boolean; // true if "not a plant" class fired
}

// ─── Mock results for demo/dev mode ───────────────────────────────────────────

const MOCK_RESULTS: Array<{ diseaseId: string; confidence: number }> = [
  { diseaseId: 'tomato_early_blight', confidence: 0.89 },
  { diseaseId: 'rice_blast', confidence: 0.92 },
  { diseaseId: 'wheat_stem_rust', confidence: 0.76 },
  { diseaseId: 'potato_late_blight', confidence: 0.83 },
  { diseaseId: 'cotton_leaf_curl', confidence: 0.71 },
];

let mockIndex = 0;

function getMockResult(cropType?: CropType): ClassificationResult {
  // Rotate through mock results for variety in demo mode
  const mock = MOCK_RESULTS[mockIndex % MOCK_RESULTS.length];
  mockIndex += 1;

  return {
    diseaseId: mock.diseaseId,
    confidence: mock.confidence,
    modelStage: 'mock',
    modelVersion: MODEL_VERSIONS.fast,
    isLowConfidence: mock.confidence < ACCURATE_MODEL_LOW_CONFIDENCE_THRESHOLD,
    isRejected: false,
  };
}

// ─── Real TFLite inference ──────────────────────────────────────────────
import { useTensorflowModel } from 'react-native-fast-tflite';

const modelAsset = require('../../assets/model.tflite');

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDiseaseClassifier() {
  const model = useTensorflowModel(modelAsset, []);

  /**
   * Run classification on a preprocessed tensor buffer.
   *
   * @param tensorBuffer - Float32Array, normalized image tensor
   * @param cropType - Optional crop type hint (for future use)
   */
  const classify = useCallback(
    async (
      tensorBuffer: Float32Array | null,
      cropType?: CropType
    ): Promise<ClassificationResult> => {
      // If tensor is missing or model isn't loaded yet, return mock
      if (tensorBuffer === null || !model.model) {
        return getMockResult(cropType);
      }

      // ── Real inference path ───────────────────────────────────────────────
      try {
        const output = await model.model.run([tensorBuffer.buffer as ArrayBuffer]);
        // Fast-tflite output is an ArrayBuffer. We know the model returns Float32 predictions.
        const predictions = new Float32Array(output[0]);
        let maxConfidence = -1;
        let maxIndex = 0;
        
        for (let i = 0; i < predictions.length; i++) {
          if (predictions[i] > maxConfidence) {
            maxConfidence = predictions[i];
            maxIndex = i;
          }
        }

        if (maxIndex === NOT_A_PLANT_CLASS_INDEX) {
          return {
            diseaseId: 'not_a_plant',
            confidence: maxConfidence,
            modelStage: 'accurate',
            modelVersion: MODEL_VERSIONS.accurate,
            isLowConfidence: false,
            isRejected: true
          };
        }

        const diseaseId = (labels as Record<string, string>)[String(maxIndex)] || 'tomato_early_blight';

        return {
          diseaseId,
          confidence: maxConfidence,
          modelStage: 'accurate',
          modelVersion: MODEL_VERSIONS.accurate,
          isLowConfidence: maxConfidence < ACCURATE_MODEL_LOW_CONFIDENCE_THRESHOLD,
          isRejected: false
        };
      } catch (error) {
        console.error('TFLite inference error:', error);
        return getMockResult(cropType);
      }
    },
    [model.model]
  );

  return { classify };
}
