import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface SensorGaugeProps {
  value: number;
  min: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit: string;
}

export const SensorGauge: React.FC<SensorGaugeProps> = ({
  value,
  min,
  max,
  size = 120,
  strokeWidth = 12,
  label,
  unit,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = ((value - min) / (max - min)) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (): string => {
    if (percentage < 30) return COLORS.danger;
    if (percentage < 70) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={styles.value}>{value.toFixed(1)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: SPACING.sm,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  unit: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  label: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
});
