/**
 * Remedy service — looks up remedy and disease data from local SQLite.
 * Never makes a network call. All data comes from the bundled seed dataset.
 */

import { getDatabase } from '../data/db/seed';
import type { Disease, Remedy, RemedyWithDisease, Locale, CropType } from '../data/types';
import remediesEn from '../data/remedies/remedies.en.json';
import remediesHi from '../data/remedies/remedies.hi.json';
import remediesGu from '../data/remedies/remedies.gu.json';

const localizedData: Record<string, Record<string, any>> = {
  en: remediesEn,
  hi: remediesHi,
  gu: remediesGu,
};

function parseJsonField<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get the full disease + remedy record for a given disease ID and locale.
 * Falls back to English if the requested locale is not available.
 */
export async function getRemedyForDisease(
  diseaseId: string,
  locale: Locale = 'en'
): Promise<RemedyWithDisease> {
  const db = await getDatabase();

  // Fetch disease from DB (which is seeded in English by default)
  const diseaseRow = await db.getFirstAsync<{
    id: string;
    crop_type: string;
    name: string;
    symptoms: string;
    severity_default: string;
    explanation: string;
  }>('SELECT * FROM diseases WHERE id = ?', [diseaseId]);

  if (!diseaseRow) {
    throw new Error(`[remedy.service] Disease not found: ${diseaseId}`);
  }

  // Override with exact localized text from JSON if available
  const loc = localizedData[locale]?.[diseaseId] || remediesEn[diseaseId as keyof typeof remediesEn];

  const disease: Disease = {
    id: diseaseRow.id,
    cropType: diseaseRow.crop_type as CropType,
    name: loc?.name || diseaseRow.name,
    symptoms: loc?.symptoms || parseJsonField<string[]>(diseaseRow.symptoms, []),
    severityDefault: diseaseRow.severity_default as any,
    explanation: loc?.explanation || diseaseRow.explanation,
  };

  // Fetch remedy for requested locale, fall back to 'en'
  let remedyRow = await db.getFirstAsync<{
    id: string;
    disease_id: string;
    steps: string;
    preventive_tips: string;
    locale: string;
  }>(
    'SELECT * FROM remedies WHERE disease_id = ? AND locale = ?',
    [diseaseId, locale]
  );

  if (!remedyRow && locale !== 'en') {
    remedyRow = await db.getFirstAsync<any>(
      'SELECT * FROM remedies WHERE disease_id = ? AND locale = ?',
      [diseaseId, 'en']
    );
  }

  if (!remedyRow) {
    throw new Error(`[remedy.service] Remedy not found for disease: ${diseaseId}`);
  }

  const remedy: Remedy = {
    id: remedyRow.id,
    diseaseId: remedyRow.disease_id,
    steps: parseJsonField<string[]>(remedyRow.steps, []),
    preventiveTips: parseJsonField<string[]>(remedyRow.preventive_tips, []),
    locale: remedyRow.locale as Locale,
  };

  return { disease, remedy };
}

/**
 * List all diseases, optionally filtered by crop type.
 * Used by the Remedy Library browse screen.
 */
export async function listAllDiseases(cropType?: CropType, locale: Locale = 'en'): Promise<Disease[]> {
  const db = await getDatabase();

  const rows = cropType
    ? await db.getAllAsync<any>(
        'SELECT * FROM diseases WHERE crop_type = ? ORDER BY name ASC',
        [cropType]
      )
    : await db.getAllAsync<any>('SELECT * FROM diseases ORDER BY crop_type, name ASC');

  const locData = localizedData[locale] || remediesEn;

  return rows.map(row => {
    const loc = locData[row.id] || (remediesEn as any)[row.id];
    return {
      id: row.id,
      cropType: row.crop_type as CropType,
      name: loc?.name || row.name,
      symptoms: loc?.symptoms || parseJsonField<string[]>(row.symptoms, []),
      severityDefault: row.severity_default as any,
      explanation: loc?.explanation || row.explanation,
    };
  });
}
