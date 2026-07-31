/**
 * Remedy service — looks up remedy and disease data from local SQLite.
 * Never makes a network call. All data comes from the bundled seed dataset.
 */

import { getDatabase } from '../data/db/seed';
import type { Disease, Remedy, RemedyWithDisease, Locale, CropType } from '../data/types';
import remediesEn from '../data/remedies/remedies.en.json';
import remediesHi from '../data/remedies/remedies.hi.json';

const localizedData: Record<string, Record<string, any>> = {
  en: remediesEn,
  hi: remediesHi,
};

function parseJsonField<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getRemedyForDisease(
  diseaseId: string,
  locale: Locale = 'en'
): Promise<RemedyWithDisease> {
  const data = localizedData[locale] || localizedData['en'];
  let entry = data[diseaseId];
  let usedLocale = locale;
  
  // Fallback to English if translation is missing
  if (!entry && locale !== 'en') {
    entry = localizedData['en'][diseaseId];
    usedLocale = 'en';
  }

  // Final fallback to a generic healthy state if disease is completely unknown
  if (!entry) {
    console.warn(`[remedy.service] Remedy not found for disease: ${diseaseId}, falling back to general_healthy`);
    entry = localizedData['en']['general_healthy'];
    usedLocale = 'en';
  }

  const disease: Disease = {
    id: entry.id,
    cropType: entry.cropType as CropType,
    name: entry.name,
    symptoms: entry.symptoms || [],
    severityDefault: entry.severityDefault as any,
    explanation: entry.explanation,
  };

  const remedy: Remedy = {
    id: `${entry.id}-${usedLocale}`,
    diseaseId: entry.id,
    steps: entry.remedy?.steps || [],
    preventiveTips: entry.remedy?.preventiveTips || [],
    locale: usedLocale,
  };

  return { disease, remedy };
}

/**
 * List all diseases, optionally filtered by crop type.
 * Used by the Remedy Library browse screen.
 */
export async function listAllDiseases(cropType?: CropType, locale: Locale = 'en'): Promise<Disease[]> {
  const data = localizedData[locale] || localizedData['en'];
  const entries = Object.values(data);
  
  const filtered = cropType ? entries.filter(e => e.cropType === cropType) : entries;
  
  return filtered.map(entry => ({
    id: entry.id,
    cropType: entry.cropType as CropType,
    name: entry.name,
    symptoms: entry.symptoms || [],
    severityDefault: entry.severityDefault as any,
    explanation: entry.explanation,
  })).sort((a, b) => a.name.localeCompare(b.name));
}
