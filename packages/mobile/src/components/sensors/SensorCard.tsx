import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { SENSOR_THRESHOLDS, SensorType } from '@/constants/thresholds';

interface SensorCardProps {
  type: SensorType;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  value,
  icon,
  label,
}) => {
  const threshold = SENSOR_THRESHOLDS[type];
  
  const getStatus = (): 'normal' | 'warning' | 'critical' => {
    if (value <= threshold.CRITICAL_LOW || value >= threshold.CRITICAL_HIGH) {
      return 'critical';
    }
    if (value < threshold.MIN || value > threshold.MAX) {
      return 'warning';
    }
    return 'normal';
  };

  const status = getStatus();
  const statusColor = COLORS.sensor[status];

  return (
    <Card style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: statusColor + '20' }]}>
        <Ionicons name={icon} size={32} color={statusColor} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: statusColor }]}>
            {value.toFixed(1)}
          </Text>
          <Text style={styles.unit}>{threshold.UNIT}</Text>
        </View>
        
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeText}>
            Норма: {threshold.MIN}-{threshold.MAX} {threshold.UNIT}
          </Text>
        </View>
      </View>

      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
