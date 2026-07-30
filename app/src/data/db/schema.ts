/**
 * SQLite schema — table definitions.
 * These are read by seed.ts and schema migrations.
 */

export const CREATE_DISEASES_TABLE = `
  CREATE TABLE IF NOT EXISTS diseases (
    id TEXT PRIMARY KEY,
    crop_type TEXT NOT NULL,
    name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    severity_default TEXT NOT NULL CHECK(severity_default IN ('low', 'moderate', 'severe')),
    explanation TEXT NOT NULL
  );
`;

export const CREATE_REMEDIES_TABLE = `
  CREATE TABLE IF NOT EXISTS remedies (
    id TEXT PRIMARY KEY,
    disease_id TEXT NOT NULL REFERENCES diseases(id),
    steps TEXT NOT NULL,
    preventive_tips TEXT NOT NULL,
    locale TEXT NOT NULL CHECK(locale IN ('en', 'hi'))
  );
`;

export const CREATE_SCANS_TABLE = `
  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    disease_id TEXT NOT NULL REFERENCES diseases(id),
    confidence REAL NOT NULL,
    crop_type TEXT NOT NULL,
    image_uri TEXT NOT NULL,
    model_version TEXT NOT NULL,
    model_stage TEXT NOT NULL CHECK(model_stage IN ('fast', 'accurate', 'mock')),
    created_at INTEGER NOT NULL
  );
`;

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

/** All table creation statements in dependency order */
export const ALL_SCHEMA_STATEMENTS = [
  CREATE_DISEASES_TABLE,
  CREATE_REMEDIES_TABLE,
  CREATE_SCANS_TABLE,
  CREATE_SETTINGS_TABLE,
] as const;

/** Current schema version — increment when schema changes */
export const SCHEMA_VERSION = 2;
