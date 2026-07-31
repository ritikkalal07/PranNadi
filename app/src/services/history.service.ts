/**
 * History service — CRUD operations on the scans table.
 * Owns the image file lifecycle: copies to persistent directory, deletes on scan delete.
 */

import * as FileSystem from 'expo-file-system';
import { getDatabase } from '../data/db/seed';
import type { ScanRecord, HistoryFilter } from '../data/types';

function rowToScanRecord(row: any): ScanRecord {
  return {
    id: row.id,
    diseaseId: row.disease_id,
    confidence: row.confidence,
    cropType: row.crop_type,
    imageUri: row.image_uri,
    modelVersion: row.model_version,
    modelStage: row.model_stage,
    createdAt: row.created_at,
  };
}

/** Save a new scan record to history */
export async function saveScan(scan: ScanRecord): Promise<void> {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO scans
         (id, disease_id, confidence, crop_type, image_uri, model_version, model_stage, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        scan.id,
        scan.diseaseId,
        scan.confidence,
        scan.cropType,
        scan.imageUri,
        scan.modelVersion,
        scan.modelStage,
        scan.createdAt,
      ]
    );
  } catch (err) {
    console.warn('[history.service] Failed to save scan (Web/DB init error):', err);
  }
}

/** Retrieve paginated scan history with optional filters */
export async function getHistory(
  filters: HistoryFilter = {},
  limit = 50,
  offset = 0
): Promise<ScanRecord[]> {
  try {
    const db = await getDatabase();

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.cropType) {
      conditions.push('crop_type = ?');
      params.push(filters.cropType);
    }

    if (filters.startDate) {
      conditions.push('created_at >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('created_at <= ?');
      params.push(filters.endDate);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await db.getAllAsync<any>(
      `SELECT * FROM scans ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    let records = rows.map(rowToScanRecord);

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      records = records.filter(r => r.diseaseId.toLowerCase().includes(q));
    }

    return records;
  } catch (err) {
    console.warn('[history.service] Failed to get history (Web/DB init error):', err);
    return [];
  }
}

/** Get a single scan by ID */
export async function getScanById(id: string): Promise<ScanRecord | null> {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync<any>('SELECT * FROM scans WHERE id = ?', [id]);
    return row ? rowToScanRecord(row) : null;
  } catch (err) {
    return null;
  }
}

/** Delete a scan and its associated image file */
export async function deleteScan(id: string): Promise<void> {
  try {
    const db = await getDatabase();

    const row = await db.getFirstAsync<{ image_uri: string }>(
      'SELECT image_uri FROM scans WHERE id = ?',
      [id]
    );

    if (row?.image_uri) {
      const exists = await FileSystem.getInfoAsync(row.image_uri);
      if (exists.exists) {
        await FileSystem.deleteAsync(row.image_uri, { idempotent: true });
      }
    }

    await db.runAsync('DELETE FROM scans WHERE id = ?', [id]);
  } catch (err) {
    console.warn('[history.service] Failed to delete scan:', err);
  }
}

/** Get total scan count */
export async function getScanCount(): Promise<number> {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM scans');
    return row?.count ?? 0;
  } catch (err) {
    return 0;
  }
}
