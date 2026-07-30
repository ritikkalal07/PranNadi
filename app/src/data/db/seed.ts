/**
 * Database seed script.
 * Loads bundled JSON data into SQLite tables on first launch.
 * Only runs once — guarded by a version check in settings table.
 */

import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ALL_SCHEMA_STATEMENTS, SCHEMA_VERSION } from './schema';
import remediesEn from '../remedies/remedies.en.json';
import remediesHi from '../remedies/remedies.hi.json';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('prannadi.db');
  return db;
}

export async function initializeDatabase(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('[Root] Skipping SQLite init on Web');
    return;
  }
  
  const database = await getDatabase();

  // Create settings table first so we can read the version
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Check if already seeded at current version
  const versionRow = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    ['db_version']
  );

  const currentVersion = versionRow ? parseInt(versionRow.value, 10) : 0;

  if (currentVersion >= SCHEMA_VERSION) {
    // Already seeded at this version
    return;
  }

  if (currentVersion > 0 && currentVersion < SCHEMA_VERSION) {
    // Drop existing tables for fresh schema seed
    await database.execAsync(`
      DROP TABLE IF EXISTS scans;
      DROP TABLE IF EXISTS remedies;
      DROP TABLE IF EXISTS diseases;
    `);
  }

  // Create all tables
  for (const statement of ALL_SCHEMA_STATEMENTS) {
    await database.execAsync(statement);
  }

  // Seed diseases + remedies from bundled JSON
  await seedDiseases(database);
  await seedRemedies(database, remediesEn, 'en');
  await seedRemedies(database, remediesHi, 'hi');

  // Mark as seeded
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['db_version', String(SCHEMA_VERSION)]
  );
}

async function seedDiseases(database: SQLite.SQLiteDatabase): Promise<void> {
  const entries = Object.values(remediesEn) as any[];

  for (const entry of entries) {
    await database.runAsync(
      `INSERT OR REPLACE INTO diseases (id, crop_type, name, symptoms, severity_default, explanation)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.cropType,
        entry.name,
        JSON.stringify(entry.symptoms),
        entry.severityDefault,
        entry.explanation,
      ]
    );
  }
}

async function seedRemedies(
  database: SQLite.SQLiteDatabase,
  remedyData: Record<string, any>,
  locale: string
): Promise<void> {
  for (const [diseaseId, entry] of Object.entries(remedyData)) {
    const remedyId = `${diseaseId}_${locale}`;
    const remedy = (entry as any).remedy;

    await database.runAsync(
      `INSERT OR REPLACE INTO remedies (id, disease_id, steps, preventive_tips, locale)
       VALUES (?, ?, ?, ?, ?)`,
      [
        remedyId,
        diseaseId,
        JSON.stringify(remedy.steps),
        JSON.stringify(remedy.preventiveTips),
        locale,
      ]
    );
  }
}
