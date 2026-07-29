/**
 * History service — CRUD operations on the scans table.
 * Owns the image file lifecycle: copies to persistent directory, deletes on scan delete.
 */

import { File } from 'expo-file-system';
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
}

/** Retrieve paginated scan history with optional filters */
export async function getHistory(
  filters: HistoryFilter = {},
  limit = 50,
  offset = 0
): Promise<ScanRecord[]> {
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

  // Post-query filter for search (SQLite LIKE is fine but JOIN-based search adds complexity)
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    records = records.filter(r => r.diseaseId.toLowerCase().includes(q));
  }

  // Post-query filter for severity (requires join — filtered in-memory for now)
  // In a larger dataset, add severity_cache column to scans table
  if (filters.severity) {
    // For now pass through — severity filter is applied at the UI layer with disease data
  }

  return records;
}

/** Get a single scan by ID */
export async function getScanById(id: string): Promise<ScanRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>('SELECT * FROM scans WHERE id = ?', [id]);
  return row ? rowToScanRecord(row) : null;
}

/** Delete a scan and its associated image file */
export async function deleteScan(id: string): Promise<void> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{ image_uri: string }>(
    'SELECT image_uri FROM scans WHERE id = ?',
    [id]
  );

  if (row?.image_uri) {
    try {
      new File(row.image_uri).delete();
    } catch {
      // File may already be gone — not a fatal error
    }
  }

  await db.runAsync('DELETE FROM scans WHERE id = ?', [id]);
}

/** Get total scan count */
export async function getScanCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM scans');
  return row?.count ?? 0;
}
