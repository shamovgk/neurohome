import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '@/store/hooks';
import { ControlSwitch, SliderControl } from '@/components/ui';
import { socketService } from '@/services/websocket/socketService';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ControlState {
  pump: boolean;
  growLight: boolean;
  fan: boolean;
  pumpDuration: number;
  lightIntensity: number;
}

export default function ControlsScreen() {
  const selectedDevice = useAppSelector((state) => state.devices.selectedDevice);
  const [controls, setControls] = useState<ControlState>({
    pump: false,
    growLight: false,
    fan: false,
    pumpDuration: 5,
    lightIntensity: 100,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDevice) {
      // Загрузить текущее состояние устройства
      loadDeviceState();
    }
  }, [selectedDevice?.id]);

  const loadDeviceState = async () => {
    setIsLoading(true);
    try {
      // TODO: Загрузить состояние с Backend API
      // const response = await apiClient.get(`/api/v1/devices/${selectedDevice.id}/controls`);
      // setControls(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading device state:', error);
      setIsLoading(false);
    }
  };

  const handleControlChange = async (
    controlName: keyof ControlState,
    value: boolean | number
  ) => {
    if (!selectedDevice) return;

    // Haptic feedback при изменении
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Обновляем локальное состояние
    setControls((prev) => ({
      ...prev,
      [controlName]: value,
    }));

    // Отправляем команду через WebSocket
    socketService.sendControl(selectedDevice.id, controlName, value);

    // Показываем уведомление
    if (typeof value === 'boolean') {
      Alert.alert(
        'Команда отправлена',
        `${getControlLabel(controlName)} ${value ? 'включен' : 'выключен'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const getControlLabel = (controlName: keyof ControlState): string => {
    const labels = {
      pump: 'Полив',
      growLight: 'Фитолампа',
      fan: 'Вентилятор',
      pumpDuration: 'Длительность полива',
      lightIntensity: 'Яркость света',
    };
    return labels[controlName];
  };

  const handleManualWatering = () => {
    Alert.alert(
      'Запустить полив?',
      `Полив будет активен ${controls.pumpDuration} секунд`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Запустить',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            socketService.sendControl(selectedDevice!.id, 'pump', {
              enabled: true,
              duration: controls.pumpDuration * 1000,
            });
            Alert.alert('Полив запущен', `Завершится через ${controls.pumpDuration} сек.`);
          },
        },
      ]
    );
  };

  if (!selectedDevice) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="construct-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Выберите устройство</Text>
        <Text style={styles.emptyText}>
          Перейдите на главный экран и выберите устройство для управления
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Загрузка состояния устройства...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>{selectedDevice.name}</Text>
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

      {selectedDevice.status === 'offline' && (
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Устройство не в сети. Управление недоступно.
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Автоматическое управление</Text>
        <Text style={styles.sectionDescription}>
          Устройства управляются автоматически на основе показателей датчиков
        </Text>

        <ControlSwitch
          label="Автополив"
          description="Включается при низкой влажности почвы"
          icon="water"
          value={controls.pump}
          onValueChange={(value) => handleControlChange('pump', value)}
          disabled={selectedDevice.status === 'offline'}
        />

        <ControlSwitch
          label="Фитолампа"
          description="Включается при недостатке освещения"
          icon="sunny"
          value={controls.growLight}
          onValueChange={(value) => handleControlChange('growLight', value)}
          disabled={selectedDevice.status === 'offline'}
        />

        <ControlSwitch
          label="Вентилятор"
          description="Включается при высокой температуре"
          icon="cloud"
          value={controls.fan}
          onValueChange={(value) => handleControlChange('fan', value)}
          disabled={selectedDevice.status === 'offline'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки управления</Text>

        <SliderControl
          label="Длительность полива"
          icon="time"
          value={controls.pumpDuration}
          min={1}
          max={30}
          step={1}
          unit="сек"
          onValueChange={(value) => setControls((prev) => ({ ...prev, pumpDuration: value }))}
          disabled={selectedDevice.status === 'offline'}
        />

        <SliderControl
          label="Яркость фитолампы"
          icon="bulb"
          value={controls.lightIntensity}
          min={0}
          max={100}
          step={10}
          unit="%"
          onValueChange={(value) => setControls((prev) => ({ ...prev, lightIntensity: value }))}
          disabled={selectedDevice.status === 'offline'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ручное управление</Text>
        
        <View style={styles.manualControlCard}>
          <View style={styles.manualControlHeader}>
            <Ionicons name="hand-left" size={32} color={COLORS.primary} />
            <View style={styles.manualControlText}>
              <Text style={styles.manualControlTitle}>Ручной полив</Text>
              <Text style={styles.manualControlDescription}>
                Запустить полив на {controls.pumpDuration} секунд
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.manualButton,
              selectedDevice.status === 'offline' && styles.manualButtonDisabled
            ]}
            onPress={handleManualWatering}
            disabled={selectedDevice.status === 'offline'}
            activeOpacity={0.7}
          >
            <Ionicons name="water" size={20} color="#fff" />
            <Text style={styles.manualButtonText}>Запустить полив</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Все команды отправляются на устройство ESP32 в реальном времени через MQTT
        </Text>
      </View>
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
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deviceName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  warningText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  manualControlCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  manualControlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  manualControlText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  manualControlTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  manualControlDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  manualButtonDisabled: {
    opacity: 0.5,
  },
  manualButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#fff',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
});
