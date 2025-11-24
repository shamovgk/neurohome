import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { SensorCard, SensorGauge } from '@/components/sensors';
import { socketService } from '@/services/websocket/socketService';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MonitoringScreen() {
  const selectedDevice = useAppSelector((state) => state.devices.selectedDevice);
  const sensorData = useAppSelector((state) => state.sensors.currentData);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (selectedDevice) {
      // Подключаемся к WebSocket для real-time данных
      socketService.connect(selectedDevice.id);
      setIsConnecting(false);

      return () => {
        // Отписываемся при размонтировании
        socketService.unsubscribe(selectedDevice.id);
      };
    }
  }, [selectedDevice?.id]);

  if (!selectedDevice) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="leaf-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Выберите устройство</Text>
        <Text style={styles.emptyText}>
          Перейдите на главный экран и выберите устройство для мониторинга
        </Text>
      </View>
    );
  }

  if (isConnecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Подключение к устройству...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>{selectedDevice.name}</Text>
        {selectedDevice.plantProfile && (
          <Text style={styles.plantName}>{selectedDevice.plantProfile.name}</Text>
        )}
        <View style={[
          styles.statusBadge,
          { backgroundColor: selectedDevice.status === 'online' ? COLORS.success : COLORS.danger }
        ]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {selectedDevice.status === 'online' ? 'Подключено' : 'Отключено'}
          </Text>
        </View>
      </View>

      {sensorData ? (
        <>
          {/* Датчики в виде карточек */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Текущие показатели</Text>
            
            <SensorCard
              type="SOIL_MOISTURE"
              value={sensorData.soilMoisture}
              icon="water"
              label="Влажность почвы"
            />
            
            <SensorCard
              type="TEMPERATURE"
              value={sensorData.temperature}
              icon="thermometer"
              label="Температура"
            />
            
            <SensorCard
              type="AIR_HUMIDITY"
              value={sensorData.airHumidity}
              icon="cloud"
              label="Влажность воздуха"
            />
            
            <SensorCard
              type="LIGHT"
              value={sensorData.lightLevel}
              icon="sunny"
              label="Освещенность"
            />
          </View>

          {/* Датчики в виде gauge */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Визуализация</Text>
            <View style={styles.gaugesContainer}>
              <SensorGauge
                value={sensorData.soilMoisture}
                min={0}
                max={100}
                label="Влажность"
                unit="%"
              />
              <SensorGauge
                value={sensorData.temperature}
                min={0}
                max={40}
                label="Температура"
                unit="°C"
              />
            </View>
            <View style={styles.gaugesContainer}>
              <SensorGauge
                value={sensorData.waterLevel}
                min={0}
                max={100}
                label="Уровень воды"
                unit="%"
              />
              <SensorGauge
                value={sensorData.lightLevel}
                min={0}
                max={25000}
                label="Свет"
                unit="lux"
              />
            </View>
          </View>

          <View style={styles.timestampContainer}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.timestamp}>
              Обновлено: {new Date(sensorData.timestamp).toLocaleTimeString('ru-RU')}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.noDataText}>Ожидание данных от устройства...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deviceName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  plantName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  gaugesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  timestamp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  noDataText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
