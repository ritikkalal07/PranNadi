/**
 * Design system typography tokens.
 * Sora for headings, Inter for body/UI text.
 * Type scale: 12 / 14 / 16 / 20 / 25 / 31 / 39px (1.25 modular ratio, base 16)
 */

export const FontFamily = {
  heading: {
    semibold: 'Sora_600SemiBold',
    bold: 'Sora_700Bold',
  },
  body: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
  },
} as const;

/** Modular type scale — base 16px, ratio 1.25 */
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 25,
  '2xl': 31,
  '3xl': 39,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const LetterSpacing = {
  tight: -0.3,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
} as const;

/** Pre-composed text styles for common use cases */
export const TextStyles = {
  displayLarge: {
    fontFamily: FontFamily.heading.bold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displayMedium: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  headingLarge: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
  },
  headingMedium: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.snug,
  },
  headingSmall: {
    fontFamily: FontFamily.heading.semibold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.snug,
  },
  bodyLarge: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
  },
  bodyMedium: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodySmall: {
    fontFamily: FontFamily.body.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  labelMedium: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.snug,
    letterSpacing: LetterSpacing.wide,
  },
  labelSmall: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.snug,
    letterSpacing: LetterSpacing.wider,
  },
  numeralLarge: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    // tabular figures via fontVariant
  },
  numeralMedium: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.tight,
  },
} as const;
