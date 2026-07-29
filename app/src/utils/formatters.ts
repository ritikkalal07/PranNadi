/**
 * Date and number formatters — locale-aware using Intl APIs.
 */

import type { Locale } from '../data/types';

const LOCALE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

/** Format a unix timestamp as a readable date */
export function formatDate(timestamp: number, locale: Locale = 'en'): string {
  return new Intl.DateTimeFormat(LOCALE_MAP[locale] ?? 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

/** Format a unix timestamp as date + time */
export function formatDateTime(timestamp: number, locale: Locale = 'en'): string {
  return new Intl.DateTimeFormat(LOCALE_MAP[locale] ?? 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

/** Format relative time (e.g., "3 minutes ago") */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Format confidence as percentage string */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/** Format NDVI value with one decimal place */
export function formatNDVI(value: number): string {
  return value.toFixed(2);
}
