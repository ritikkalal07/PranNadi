/**
 * Design system spacing tokens.
 * Base unit: 4px. All values are multiples of 4.
 * Touch targets: minimum 44×44px.
 */

/** 4px base unit spacing scale */
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** Corner radii */
export const Radius = {
  sm: 8,
  md: 12,   // Smaller elements: chips, buttons
  lg: 16,   // Primary content cards
  xl: 20,
  full: 9999, // Fully rounded (pill buttons, badges)
} as const;

/** Touch target sizes — minimum 44×44px, outdoor use */
export const TouchTarget = {
  min: 44,
  md: 48,
  lg: 56,
} as const;

/** Layout constants */
export const Layout = {
  screenPaddingHorizontal: 20,
  screenPaddingVertical: 24,
  cardPaddingHorizontal: 16,
  cardPaddingVertical: 16,
  sectionGap: 24,
  itemGap: 12,
  tabBarHeight: 56,
  headerHeight: 56,
} as const;

/** Z-index layers */
export const ZIndex = {
  base: 0,
  card: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
} as const;
