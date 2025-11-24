import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Device } from '@/types/device';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DeviceCardProps {
  device: Device;
  onPress: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress }) => {
  const isOnline = device.status === 'online';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="leaf"
              size={24}
              color={isOnline ? COLORS.success : COLORS.textSecondary}
            />
            <View style={styles.deviceInfo}>
              <Text style={styles.name}>{device.name}</Text>
              {device.plantProfile && (
                <Text style={styles.plant}>{device.plantProfile.name}</Text>
              )}
            </View>
          </View>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: isOnline ? COLORS.success : COLORS.textSecondary }
          ]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {isOnline ? 'Онлайн' : 'Офлайн'}
            </Text>
          </View>
        </View>

        {device.location && (
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.locationText}>{device.location}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.lastSeen}>
            Обновлено: {formatDistanceToNow(new Date(device.lastSeen), {
              addSuffix: true,
              locale: ru,
            })}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  plant: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: '#fff',
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lastSeen: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});
