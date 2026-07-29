/**
 * Sync service — the only service allowed to make network requests.
 * Both responsibilities fail silently when offline — never block the rest of the app.
 */

import * as Network from 'expo-network';
import { useAppStore } from '../store/useAppStore';

/** Check if device is online */
async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected === true && state.isInternetReachable !== false;
  } catch {
    return false;
  }
}

/**
 * Check for a newer model version and download it if available.
 * No-op when offline. Fails silently.
 */
export async function checkForModelUpdate(): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  try {
    // TODO: Replace with your actual model update endpoint
    // const response = await fetch('https://your-api.com/model-version');
    // const { version, url } = await response.json();
    // if (version > MODEL_VERSIONS.fast) { ... download and replace .tflite }
    console.log('[sync] Model update check — endpoint not yet configured');
  } catch (error) {
    // Fail silently — app works without model updates
    console.log('[sync] Model update check skipped:', error);
  }
}

/**
 * Upload an anonymized scan when community sync is enabled.
 * Only called when: (1) user has explicitly opted in, (2) device is online.
 */
export async function uploadAnonymizedScan(
  diseaseId: string,
  confidence: number,
  cropType: string,
  modelVersion: string
): Promise<void> {
  const { communitySync } = useAppStore.getState();
  if (!communitySync) return;

  const online = await isOnline();
  if (!online) return;

  try {
    // TODO: Replace with your actual sync endpoint
    // await fetch('https://your-api.com/scans', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ diseaseId, confidence, cropType, modelVersion }),
    // });
    console.log('[sync] Anonymized scan upload — endpoint not yet configured');
  } catch (error) {
    // Fail silently — sync failure should never affect the main app flow
    console.log('[sync] Upload skipped (offline or error):', error);
  }
}

/**
 * Fetch NDVI (Normalized Difference Vegetation Index) for a field location.
 * Only called when user has set a field location and device is online.
 * Returns null when offline or on error.
 */
export async function fetchFieldNDVI(
  latitude: number,
  longitude: number
): Promise<{ value: number; vigor: 'normal' | 'watch' | 'declining' } | null> {
  const online = await isOnline();
  if (!online) return null;

  try {
    // TODO: Integrate Sentinel Hub or Google Earth Engine API
    // Free tier is sufficient for this use case
    // const bbox = `${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`;
    // const url = `https://services.sentinel-hub.com/api/v1/statistics?...`;
    // const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    // const data = await response.json();
    // const ndvi = data.data[0].outputs.data.bands.B0.stats.mean;

    // Mock for demo purposes
    const mockNDVI = 0.65 + Math.random() * 0.15;
    const vigor = mockNDVI > 0.7 ? 'normal' : mockNDVI > 0.5 ? 'watch' : 'declining';

    console.log('[sync] NDVI fetch — using mock value:', mockNDVI);
    return { value: mockNDVI, vigor };
  } catch (error) {
    console.log('[sync] NDVI fetch failed:', error);
    return null;
  }
}
