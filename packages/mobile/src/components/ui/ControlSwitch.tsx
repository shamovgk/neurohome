import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface ControlSwitchProps {
  label: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ControlSwitch: React.FC<ControlSwitchProps> = ({
  label,
  description,
  icon,
  value,
  onValueChange,
  disabled = false,
}) => {
  const handleChange = async (newValue: boolean) => {
    // Haptic feedback при переключении
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onValueChange(newValue);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: value ? COLORS.primary + '20' : COLORS.border }
        ]}>
          <Ionicons
            name={icon}
            size={28}
            color={value ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
          <Text style={[styles.status, { color: value ? COLORS.success : COLORS.textSecondary }]}>
            {value ? 'Включено' : 'Выключено'}
          </Text>
        </View>

        <Switch
          value={value}
          onValueChange={handleChange}
          disabled={disabled}
          trackColor={{
            false: COLORS.border,
            true: COLORS.primary,
          }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
          ios_backgroundColor={COLORS.border}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  status: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
});
