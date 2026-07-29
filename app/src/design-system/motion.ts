/**
 * Design system motion tokens.
 * Every animation has a functional reason — not decoration.
 * Uses React Native Reanimated spring/timing configs.
 */

/** Duration constants (ms) */
export const Duration = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  scanLine: 800,      // Scan overlay sweep — tied to actual inference time
  countUp: 400,       // Confidence score count-up animation
  skeletonCycle: 1200, // Skeleton shimmer repeat cycle
} as const;

/** Reanimated withSpring config presets */
export const SpringConfig = {
  /** Result card reveal — medium damping, feels like information arriving */
  resultReveal: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
  },
  /** Button press — snappy, no bounce */
  buttonPress: {
    damping: 25,
    stiffness: 400,
    mass: 0.6,
    overshootClamping: true,
  },
  /** Sheet slide-up */
  sheetOpen: {
    damping: 22,
    stiffness: 280,
    mass: 0.9,
    overshootClamping: false,
  },
} as const;

/** Easing presets for withTiming */
export const Easing = {
  /** Standard ease-in-out */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Decelerate — elements entering */
  enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  /** Accelerate — elements leaving */
  exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
} as const;

/** Button micro-animation values */
export const ButtonAnimation = {
  pressedScale: 0.97,
  pressedOpacity: 0.88,
  duration: Duration.instant,
} as const;

/** Skeleton shimmer config */
export const SkeletonAnimation = {
  baseColor: '#E4E2DA',
  highlightColor: '#F1F0EB',
  cycleDuration: Duration.skeletonCycle,
} as const;

/** Scan overlay config */
export const ScanAnimation = {
  /** Sweep line height in px */
  lineHeight: 2,
  /** Default sweep duration — overridden by actual inference time */
  sweepDuration: Duration.scanLine,
  /** Line color */
  lineColor: 'rgba(47, 110, 78, 0.85)',
} as const;
