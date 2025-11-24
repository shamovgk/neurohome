import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Card } from './Card';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface SliderControlProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  unit,
  onValueChange,
  disabled = false,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {value} {unit}
          </Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={COLORS.primary}
        maximumTrackTintColor={COLORS.border}
        thumbTintColor={COLORS.primary}
        disabled={disabled}
      />

      <View style={styles.range}>
        <Text style={styles.rangeText}>
          {min} {unit}
        </Text>
        <Text style={styles.rangeText}>
          {max} {unit}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  value: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});
