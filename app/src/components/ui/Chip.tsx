/**
 * Chip component — compact tag/filter element.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../design-system/colors';
import { FontFamily, FontSize } from '../../design-system/typography';
import { Spacing, Radius } from '../../design-system/spacing';
import type { Severity } from '../../data/types';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function Chip({ label, selected = false, onPress, style, testID }: ChipProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Severity-colored chip */
interface SeverityChipProps {
  severity: Severity;
  label: string;
}

const severityColors: Record<Severity, { bg: string; text: string; border: string }> = {
  low: { bg: Colors.status.healthyLight, text: Colors.status.healthy, border: Colors.status.healthy },
  moderate: { bg: Colors.status.moderateLight, text: Colors.status.moderate, border: Colors.status.moderate },
  severe: { bg: Colors.status.severeLight, text: Colors.status.severe, border: Colors.status.severe },
};

export function SeverityChip({ severity, label }: SeverityChipProps) {
  const colors = severityColors[severity];
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

import { View } from 'react-native';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.subtle,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignSelf: 'flex-start',
  },
  selected: {
    backgroundColor: Colors.brand.primaryLight,
    borderColor: Colors.brand.primary,
  },
  label: {
    fontFamily: FontFamily.body.medium,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  selectedLabel: {
    color: Colors.brand.primary,
  },
});
