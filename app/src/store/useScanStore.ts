/**
 * Zustand store — in-progress scan state.
 * Holds the current scan's status and result, cleared between scans.
 */

import { create } from 'zustand';
import type { DiagnosisResult } from '../data/types';

type ScanStatus = 'idle' | 'capturing' | 'inferring' | 'done' | 'error';

interface ScanStore {
  status: ScanStatus;
  currentImageUri: string | null;
  result: DiagnosisResult | null;
  error: string | null;

  setCapturing: (imageUri: string) => void;
  setInferring: () => void;
  setResult: (result: DiagnosisResult) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  status: 'idle',
  currentImageUri: null,
  result: null,
  error: null,

  setCapturing: (imageUri) =>
    set({ status: 'capturing', currentImageUri: imageUri, error: null }),
  setInferring: () => set({ status: 'inferring' }),
  setResult: (result) => set({ status: 'done', result }),
  setError: (error) => set({ status: 'error', error }),
  reset: () =>
    set({ status: 'idle', currentImageUri: null, result: null, error: null }),
}));
