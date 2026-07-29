/**
 * Zustand store — app-level persistent state.
 * Language, selected crop, onboarding status, and field location.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings, Locale, CropType } from '../data/types';

interface AppStore extends AppSettings {
  setLanguage: (lang: Locale) => void;
  setSelectedCrop: (crop: CropType | undefined) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setCommunitySync: (enabled: boolean) => void;
  setFieldLocation: (lat: number, lng: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Defaults
      language: 'en',
      selectedCrop: undefined,
      onboardingComplete: false,
      communitySync: false,
      fieldLatitude: undefined,
      fieldLongitude: undefined,

      setLanguage: (language) => set({ language }),
      setSelectedCrop: (selectedCrop) => set({ selectedCrop }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setCommunitySync: (communitySync) => set({ communitySync }),
      setFieldLocation: (lat, lng) =>
        set({ fieldLatitude: lat, fieldLongitude: lng }),
    }),
    {
      name: 'prannadi-app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
