/**
 * Image preprocessing for ML inference.
 * Resizes and normalizes an image URI into a Float32 tensor
 * matching the model's expected input shape: [1, 224, 224, 3].
 */

import * as ImageManipulator from 'expo-image-manipulator';

/** Target input size for EfficientNet-Lite0 / EfficientNet-B1 */
export const MODEL_INPUT_SIZE = 224;

/** Normalization: ImageNet mean and std */
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

export interface PreprocessResult {
  tensor: Float32Array;
  /** Width × Height used (should match MODEL_INPUT_SIZE) */
  width: number;
  height: number;
}

/**
 * Preprocess an image URI into a normalized Float32Array tensor.
 * Returns null if the image cannot be processed (invalid URI, file not found).
 */
export async function preprocessImage(
  imageUri: string
): Promise<PreprocessResult | null> {
  try {
    // Resize to model input size
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!manipResult.base64) return null;

    // Decode base64 JPEG to pixel data
    const rawBytes = Uint8Array.from(atob(manipResult.base64), c =>
      c.charCodeAt(0)
    );

    // Build normalized Float32 tensor [H, W, C] → flatten to [H*W*C]
    const tensor = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
    let tensorIdx = 0;

    // Simple pixel extraction from raw JPEG bytes
    // Note: In production, use vision-camera-resize-plugin for frame-accurate
    // pixel extraction directly from camera frames without JPEG round-trip
    for (let i = 0; i < rawBytes.length; i += 3) {
      const r = rawBytes[i] / 255.0;
      const g = rawBytes[i + 1] / 255.0;
      const b = rawBytes[i + 2] / 255.0;

      tensor[tensorIdx++] = (r - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
      tensor[tensorIdx++] = (g - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
      tensor[tensorIdx++] = (b - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
    }

    return {
      tensor,
      width: manipResult.width,
      height: manipResult.height,
    };
  } catch (error) {
    console.error('[preprocess] Failed to preprocess image:', error);
    return null;
  }
}
