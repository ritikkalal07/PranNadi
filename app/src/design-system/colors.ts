/**
 * Design system color tokens.
 * Every color used in the app must come from this file.
 * Never hardcode a hex value in a screen or component.
 */

export const Colors = {
  // ─── Backgrounds ──────────────────────────────────────────
  bg: {
    base: '#FAF9F6',      // App background — warm off-white
    surface: '#FFFFFF',   // Cards, sheets, elevated surfaces
    subtle: '#F1F0EB',    // Secondary backgrounds, input fields
  },

  // ─── Borders ──────────────────────────────────────────────
  border: {
    default: '#E4E2DA',   // Hairline borders on cards/inputs
  },

  // ─── Text ─────────────────────────────────────────────────
  text: {
    primary: '#1C1F1B',   // Headings, primary content — near-black
    secondary: '#5C6259', // Supporting text, captions
    tertiary: '#8B9186',  // Timestamps, placeholder text
    inverse: '#FFFFFF',   // Text on dark backgrounds
  },

  // ─── Brand ────────────────────────────────────────────────
  brand: {
    primary: '#2F6E4E',       // Deep forest green — primary actions
    primaryHover: '#265A40',  // Pressed/hover state of primary
    primaryLight: '#EAF3EE',  // Light tint for backgrounds/chips
  },

  // ─── Accent ───────────────────────────────────────────────
  accent: {
    warm: '#C97B3D',        // Terracotta — secondary accent, used sparingly
    warmLight: '#FBF0E6',   // Light tint
  },

  // ─── Status ───────────────────────────────────────────────
  status: {
    healthy: '#3D8B5F',        // Healthy / low-severity result
    healthyLight: '#E8F5EE',
    moderate: '#C98A2C',       // Moderate severity
    moderateLight: '#FBF3E3',
    severe: '#C24E3A',         // High severity — muted brick-red
    severeLight: '#FAEAE7',
  },

  // ─── Focus ────────────────────────────────────────────────
  focus: {
    ring: 'rgba(47, 110, 78, 0.30)', // Accessibility focus outlines
  },

  // ─── Overlay ──────────────────────────────────────────────
  overlay: {
    dark: 'rgba(28, 31, 27, 0.60)',
    light: 'rgba(250, 249, 246, 0.85)',
  },
} as const;

export type ColorToken = typeof Colors;
