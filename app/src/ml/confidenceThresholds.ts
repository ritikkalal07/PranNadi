/**
 * Confidence thresholds for two-stage model routing.
 * Tune these against real validation data — the values below are starting points.
 */

/**
 * If the fast model's top-1 confidence meets or exceeds this threshold,
 * return its result directly. Below this, fall through to the accurate model.
 *
 * Too low → accurate model rarely runs (defeats its purpose)
 * Too high → every scan pays the accurate model's latency cost
 */
export const FAST_MODEL_CONFIDENCE_THRESHOLD = 0.75;

/**
 * If the accurate model's confidence is below this threshold,
 * the result is considered low-confidence and flagged to the user.
 * We still return the best-guess diagnosis but the UI shows a warning.
 */
export const ACCURATE_MODEL_LOW_CONFIDENCE_THRESHOLD = 0.45;

/**
 * Class index for the "not a plant" rejection class.
 * If either model outputs this class at any confidence, reject immediately.
 */
export const NOT_A_PLANT_CLASS_INDEX = 10;

/**
 * Model version strings — surfaced in Settings and stored with every scan.
 * Update these when shipping new .tflite files.
 */
export const MODEL_VERSIONS = {
  fast: '0.1.0-mock',       // Replace with real version when real model is shipped
  accurate: '0.1.0-mock',   // Replace with real version when real model is shipped
} as const;
