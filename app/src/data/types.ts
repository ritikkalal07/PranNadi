/**
 * Shared TypeScript types used across all layers.
 * This is the single source of truth for data shapes.
 * Never redefine these in individual files.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Severity = 'low' | 'moderate' | 'severe';

export type ModelStage = 'fast' | 'accurate' | 'mock';

export type Locale = 'en' | 'hi';

export type CropType =
  | 'tomato'
  | 'rice'
  | 'wheat'
  | 'maize'
  | 'cotton'
  | 'potato'
  | 'chilli'
  | 'groundnut'
  | 'sugarcane'
  | 'general';

// ─── Core domain models ────────────────────────────────────────────────────────

export interface Disease {
  id: string;               // e.g. "tomato_early_blight"
  cropType: CropType;
  name: string;             // English display name
  symptoms: string[];       // Array of symptom descriptions
  severityDefault: Severity;
  explanation: string;      // "Why this diagnosis" text
}

export interface Remedy {
  id: string;
  diseaseId: string;
  steps: string[];          // Ordered remedy steps
  preventiveTips: string[]; // Preventive measures
  locale: Locale;
}

export interface ScanRecord {
  id: string;
  diseaseId: string;
  confidence: number;       // 0.0 – 1.0
  cropType: CropType;
  imageUri: string;         // Local file path, never a remote URL
  modelVersion: string;
  modelStage: ModelStage;
  createdAt: number;        // Unix timestamp (ms)
}

// ─── Service return types ──────────────────────────────────────────────────────

export interface DiagnosisResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number;       // 0.0 – 1.0
  severity: Severity;
  cropType: CropType;
  modelVersion: string;
  modelStage: ModelStage;
  remedy: RemedyWithDisease;
  timestamp: number;
}

export interface RemedyWithDisease {
  disease: Disease;
  remedy: Remedy;
}

// ─── History filter ────────────────────────────────────────────────────────────

export interface HistoryFilter {
  cropType?: CropType;
  severity?: Severity;
  searchQuery?: string;
  startDate?: number;
  endDate?: number;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  language: Locale;
  selectedCrop?: CropType;
  onboardingComplete: boolean;
  communitySync: boolean;
  fieldLatitude?: number;
  fieldLongitude?: number;
}

// ─── BLE Mesh packet ──────────────────────────────────────────────────────────

export interface OutbreakPacket {
  diseaseId: string;
  diseaseName: string;
  geoHash: string;          // Coarse location, not exact GPS
  confidence: number;
  timestamp: number;
  hopCount: number;         // 0 = originated here, n = relayed n times
}

export interface NearbyOutbreak {
  packet: OutbreakPacket;
  receivedAt: number;
  rssi?: number;            // Bluetooth signal strength (approx distance)
}

// ─── NDVI field vigor ─────────────────────────────────────────────────────────

export type FieldVigor = 'normal' | 'watch' | 'declining';

export interface NDVIReading {
  value: number;            // 0.0 – 1.0
  vigor: FieldVigor;
  fetchedAt: number;
  source: string;
}
