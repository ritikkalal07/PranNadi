/**
 * Severity badge — compact colored chip with icon.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react-native';
import { Colors } from '../../design-system/colors';
import { FontFamily, FontSize } from '../../design-system/typography';
import { Spacing, Radius } from '../../design-system/spacing';
import type { Severity } from '../../data/types';

interface SeverityBadgeProps {
  severity: Severity;
  label: string;
  size?: 'sm' | 'md';
}

const config: Record<Severity, {
  bg: string;
  text: string;
  border: string;
  Icon: React.ComponentType<any>;
}> = {
  low: {
    bg: Colors.status.healthyLight,
    text: Colors.status.healthy,
    border: Colors.status.healthy,
    Icon: CheckCircle,
  },
  moderate: {
    bg: Colors.status.moderateLight,
    text: Colors.status.moderate,
    border: Colors.status.moderate,
    Icon: AlertTriangle,
  },
  severe: {
    bg: Colors.status.severeLight,
    text: Colors.status.severe,
    border: Colors.status.severe,
    Icon: AlertOctagon,
  },
};

export function SeverityBadge({ severity, label, size = 'md' }: SeverityBadgeProps) {
  const { bg, text, border, Icon } = config[severity];
  const iconSize = size === 'sm' ? 12 : 16;
  const fontSize = size === 'sm' ? FontSize.xs : FontSize.sm;

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.sm,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <Icon size={iconSize} color={text} strokeWidth={2} />
      <Text style={[styles.label, { color: text, fontSize }]}>{label}</Text>
    </View>
  );
}

/** Large ambient severity tint — radial background behind the result card */
export function SeverityAmbient({ severity }: { severity: Severity }) {
  const colors: Record<Severity, string> = {
    low: 'rgba(61, 139, 95, 0.06)',
    moderate: 'rgba(201, 138, 44, 0.07)',
    severe: 'rgba(194, 78, 58, 0.08)',
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colors[severity] },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing[2],
  },
  label: {
    fontFamily: FontFamily.body.semibold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
