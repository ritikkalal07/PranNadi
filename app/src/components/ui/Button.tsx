/**
 * Generic Button component — uses design system tokens.
 * Includes press micro-animation (scale + opacity dip, 100ms).
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../design-system/colors';
import { FontFamily, FontSize } from '../../design-system/typography';
import { Spacing, Radius, TouchTarget } from '../../design-system/spacing';
import { ButtonAnimation } from '../../design-system/motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  testID,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(ButtonAnimation.pressedScale, { damping: 25, stiffness: 400 });
    opacity.value = withTiming(ButtonAnimation.pressedOpacity, { duration: ButtonAnimation.duration });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 25, stiffness: 400 });
    opacity.value = withTiming(1, { duration: ButtonAnimation.duration });
  };

  const containerStyle = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    styles[`label_${variant}`],
    styles[`label_${size}`],
  ];

  return (
    <AnimatedTouchable
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[animatedStyle, containerStyle]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.text.inverse : Colors.brand.primary}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyle}>{label}</Text>
          {rightIcon}
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    borderRadius: Radius.md,
    minHeight: TouchTarget.min,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },

  // Variants
  variant_primary: {
    backgroundColor: Colors.brand.primary,
  },
  variant_secondary: {
    backgroundColor: Colors.brand.primaryLight,
    borderWidth: 1,
    borderColor: Colors.brand.primary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: Colors.status.severeLight,
    borderWidth: 1,
    borderColor: Colors.status.severe,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.sm,
  },
  size_md: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
  size_lg: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    borderRadius: Radius.lg,
  },

  // Label base
  label: {
    fontFamily: FontFamily.body.semibold,
    letterSpacing: 0.2,
  },
  label_primary: { color: Colors.text.inverse },
  label_secondary: { color: Colors.brand.primary },
  label_ghost: { color: Colors.brand.primary },
  label_danger: { color: Colors.status.severe },
  label_sm: { fontSize: FontSize.sm },
  label_md: { fontSize: FontSize.base },
  label_lg: { fontSize: FontSize.lg },
});
