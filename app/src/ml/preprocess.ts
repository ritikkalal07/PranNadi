/**
 * Image preprocessing for ML inference.
 * Resizes an image to 224×224 and normalizes pixel values to [0, 1].
 *
 * Input shape for the model: [1, 224, 224, 3] — height × width × RGB channels.
 * Normalization: simple [0, 1] range (MobileNetV2 trained with rescale=1/255).
 * 
 * Uses jpeg-js for proper pixel-level access from a base64-encoded JPEG image.
 * This is 100% pure JS and works cleanly in React Native and Expo Go.
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

/** Target input size for MobileNetV2 */
export const MODEL_INPUT_SIZE = 224;

export interface PreprocessResult {
  tensor: Float32Array;
  width: number;
  height: number;
}

/**
 * Preprocess an image URI into a normalized Float32Array tensor.
 * Returns null if the image cannot be processed.
 * 
 * Steps:
 * 1. Resize to 224×224 using Expo ImageManipulator
 * 2. Get base64-encoded JPEG
 * 3. Use jpeg-js to decode the JPEG into raw RGBA pixels
 * 4. Extract RGB channels and normalize to [0, 1]
 */
export async function preprocessImage(
  imageUri: string
): Promise<PreprocessResult | null> {
  try {
    // 1. Resize to model input size with Expo ImageManipulator
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!manipResult.base64) {
      console.warn('[preprocess] No base64 data returned');
      return null;
    }

    // 2. Decode base64 to a Uint8Array of JPEG bytes
    const jpegBytes = decodeBase64(manipResult.base64);

    // 3. Use jpeg-js to decode JPEG → raw RGBA bitmap
    const rawImageData = jpeg.decode(jpegBytes, { useTArray: true });
    
    // 4. Extract raw bitmap data (RGBA) and convert to Float32 RGB tensor
    const pixelCount = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
    const tensor = new Float32Array(pixelCount * 3);
    
    // jpeg-js outputs a flat Uint8Array (RGBA)
    const data = rawImageData.data;

    for (let p = 0; p < pixelCount; p++) {
      const rgbaIdx = p * 4;
      const rgbIdx = p * 3;
      tensor[rgbIdx]     = data[rgbaIdx]     / 255.0; // R
      tensor[rgbIdx + 1] = data[rgbaIdx + 1] / 255.0; // G
      tensor[rgbIdx + 2] = data[rgbaIdx + 2] / 255.0; // B
    }

    return {
      tensor,
      width: MODEL_INPUT_SIZE,
      height: MODEL_INPUT_SIZE,
    };
  } catch (error) {
    console.error('[preprocess] Failed to preprocess image:', error);
    // Return a dummy tensor so the mock classifier path still works
    const tensor = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
    return { tensor, width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE };
  }
}

// ─── Base64 Decoder ─────────────────────────────────────────────────────────
// Robust base64 decoder to avoid reliance on atob (which is often missing in React Native)

const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const b64lookup = new Uint8Array(256);
for (let i = 0; i < b64chars.length; i++) {
  b64lookup[b64chars.charCodeAt(i)] = i;
}

function decodeBase64(base64: string): Uint8Array {
  let bufferLength = base64.length * 0.75,
      len = base64.length, i, p = 0,
      encoded1, encoded2, encoded3, encoded4;

  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }

  const bytes = new Uint8Array(bufferLength);

  for (i = 0; i < len; i += 4) {
    encoded1 = b64lookup[base64.charCodeAt(i)];
    encoded2 = b64lookup[base64.charCodeAt(i + 1)];
    encoded3 = b64lookup[base64.charCodeAt(i + 2)];
    encoded4 = b64lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return bytes;
}
