/**
 * Capture button — large, accessible, with spring press animation.
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../design-system/colors';
import { SpringConfig } from '../../design-system/motion';

interface CaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function CaptureButton({ onPress, disabled = false }: CaptureButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, SpringConfig.buttonPress);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfig.buttonPress);
  };

  return (
    <AnimatedTouchable
      testID="capture-button"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.outer, animatedStyle, disabled && styles.disabled]}
    >
      <View style={styles.ring}>
        <View style={styles.inner} />
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bg.surface,
  },
  disabled: {
    opacity: 0.5,
  },
});
