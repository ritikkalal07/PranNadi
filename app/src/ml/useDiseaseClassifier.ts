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

// ─── Real TFLite inference (uncomment when model files are available) ─────────

/*
import { useTensorflowModel } from 'react-native-fast-tflite';

const fastModelAsset = require('./models/fast-classifier.tflite');
const accurateModelAsset = require('./models/accurate-classifier.tflite');
*/

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDiseaseClassifier() {
  /**
   * Run classification on a preprocessed tensor buffer.
   * In mock mode, returns a deterministic result for UI development.
   *
   * @param tensorBuffer - Float32Array, normalized image tensor
   * @param cropType - Optional crop type hint (for future use)
   */
  const classify = useCallback(
    async (
      tensorBuffer: Float32Array | null,
      cropType?: CropType
    ): Promise<ClassificationResult> => {
      // ── Mock path (model files not present) ──────────────────────────────
      // TODO: Replace this block with real TFLite inference when models ship
      if (tensorBuffer === null || __DEV__) {
        // Simulate inference latency so UI animations look realistic
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        return getMockResult(cropType);
      }

      // ── Real inference path ───────────────────────────────────────────────
      // This is the production path. Uncomment + integrate react-native-fast-tflite here.
      //
      // const fastModel = useTensorflowModel(fastModelAsset);
      // const fastOutput = await fastModel.run([tensorBuffer]);
      // const fastConfidence = Math.max(...fastOutput[0]);
      // const fastClassIndex = fastOutput[0].indexOf(fastConfidence);
      //
      // if (fastClassIndex === NOT_A_PLANT_CLASS_INDEX) {
      //   return { diseaseId: 'not_a_plant', confidence: fastConfidence,
      //            modelStage: 'fast', modelVersion: MODEL_VERSIONS.fast,
      //            isLowConfidence: false, isRejected: true };
      // }
      //
      // if (fastConfidence >= FAST_MODEL_CONFIDENCE_THRESHOLD) {
      //   const diseaseId = (labels as Record<string, string>)[String(fastClassIndex)];
      //   return { diseaseId, confidence: fastConfidence,
      //            modelStage: 'fast', modelVersion: MODEL_VERSIONS.fast,
      //            isLowConfidence: false, isRejected: false };
      // }
      //
      // // Fall through to accurate model
      // const accurateModel = useTensorflowModel(accurateModelAsset);
      // const accurateOutput = await accurateModel.run([tensorBuffer]);
      // const accurateConfidence = Math.max(...accurateOutput[0]);
      // const accurateClassIndex = accurateOutput[0].indexOf(accurateConfidence);
      // const diseaseId = (labels as Record<string, string>)[String(accurateClassIndex)];
      //
      // return { diseaseId, confidence: accurateConfidence,
      //          modelStage: 'accurate', modelVersion: MODEL_VERSIONS.accurate,
      //          isLowConfidence: accurateConfidence < ACCURATE_MODEL_LOW_CONFIDENCE_THRESHOLD,
      //          isRejected: accurateClassIndex === NOT_A_PLANT_CLASS_INDEX };

      // Fallback for now
      return getMockResult(cropType);
    },
    []
  );

  return { classify };
}
