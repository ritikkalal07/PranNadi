/**
 * Skeleton loader — communicates "content is arriving here" rather than a spinner.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Radius, Spacing } from '../../design-system/spacing';
import { SkeletonAnimation, Duration } from '../../design-system/motion';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = Radius.sm, style }: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: Duration.skeletonCycle }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [SkeletonAnimation.baseColor, SkeletonAnimation.highlightColor]
    ),
  }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius }, animatedStyle, style]}
    />
  );
}

/** Pre-composed scan history item skeleton */
export function ScanItemSkeleton() {
  return (
    <View style={skeletonStyles.row}>
      <Skeleton width={56} height={56} borderRadius={Radius.md} />
      <View style={skeletonStyles.content}>
        <Skeleton height={16} width="70%" />
        <Skeleton height={12} width="45%" style={{ marginTop: Spacing[2] }} />
        <Skeleton height={12} width="30%" style={{ marginTop: Spacing[1] }} />
      </View>
    </View>
  );
}

/** Pre-composed remedy list item skeleton */
export function RemedyItemSkeleton() {
  return (
    <View style={skeletonStyles.remedyRow}>
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="40%" style={{ marginTop: Spacing[2] }} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    padding: Spacing[4],
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  remedyRow: {
    padding: Spacing[4],
  },
});
