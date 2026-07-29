/**
 * Card component — elevated surface with consistent padding and corner radius.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../design-system/colors';
import { Radius, Spacing } from '../../design-system/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  elevated?: boolean;
}

export function Card({ children, style, padding = 'md', elevated = true }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.shadow, styles[`padding_${padding}`], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  shadow: {
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  padding_none: {},
  padding_sm: {
    padding: Spacing[3],
  },
  padding_md: {
    padding: Spacing[4],
  },
  padding_lg: {
    padding: Spacing[6],
  },
});
