/**
 * Confidence meter — animated count-up over ~400ms, tabular numerals.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { Colors } from '../../design-system/colors';
import { FontFamily, FontSize } from '../../design-system/typography';
import { Spacing, Radius } from '../../design-system/spacing';
import { Duration } from '../../design-system/motion';
import type { Severity } from '../../data/types';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 – 1.0
  severity: Severity;
  label?: string;
}

const trackColors: Record<Severity, string> = {
  low: Colors.status.healthyLight,
  moderate: Colors.status.moderateLight,
  severe: Colors.status.severeLight,
};

const fillColors: Record<Severity, string> = {
  low: Colors.status.healthy,
  moderate: Colors.status.moderate,
  severe: Colors.status.severe,
};

export function ConfidenceMeter({ confidence, severity, label = 'Confidence' }: ConfidenceMeterProps) {
  const percent = Math.round(confidence * 100);
  const displayValue = useSharedValue(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    displayValue.value = withTiming(percent, {
      duration: Duration.countUp,
      easing: Easing.out(Easing.cubic),
    });
    barWidth.value = withTiming(confidence, {
      duration: Duration.countUp,
      easing: Easing.out(Easing.cubic),
    });
  }, [confidence]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <AnimatedPercent displayValue={displayValue} />
      </View>
      <View style={[styles.track, { backgroundColor: trackColors[severity] }]}>
        <AnimatedBar barWidth={barWidth} fillColor={fillColors[severity]} />
      </View>
    </View>
  );
}

// Sub-components to use animatedProps cleanly

const AnimatedText = Animated.createAnimatedComponent(Text);

function AnimatedPercent({ displayValue }: { displayValue: SharedValue<number> }) {
  // Re-render approach: use a derived value displayed as text
  const [displayed, setDisplayed] = React.useState(0);

  useEffect(() => {
    // Animate via JS timer for text — Reanimated text doesn't support direct interpolation simply
    const start = performance.now();
    const duration = Duration.countUp;
    const from = 0;
    const to = displayValue.value;

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [displayValue.value]);

  return <Text style={styles.percent}>{displayed}%</Text>;
}

function AnimatedBar({
  barWidth,
  fillColor,
}: {
  barWidth: SharedValue<number>;
  fillColor: string;
}) {
  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: fillColor,
    height: '100%',
    borderRadius: Radius.full,
    width: `${Math.round(barWidth.value * 100)}%`,
  }));
  return <Animated.View style={animStyle} />;
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[2],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  percent: {
    fontFamily: FontFamily.body.semibold,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
    fontVariant: ['tabular-nums'] as any,
  },
  track: {
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
});
