import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDevices, setSelectedDevice } from '@/store/slices/devicesSlice';
import { DeviceCard, Button } from '@/components/ui';
import { AddDeviceModal } from '@/components/ui/AddDeviceModal';
import { deviceService } from '@/services/api';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Device } from '@/types/device';
import Clipboard from '@react-native-clipboard/clipboard';

export default function HomeScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const fetchedDevices = await deviceService.getDevices();
      dispatch(setDevices(fetchedDevices));
    } catch (error: any) {
      console.error('Error loading devices:', error);
      Alert.alert(
        'Ошибка загрузки',
        error.response?.data?.error || 'Не удалось загрузить устройства'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const handleDevicePress = (device: Device) => {
    dispatch(setSelectedDevice(device));
    router.push('/(tabs)/monitoring');
  };

const handleAddDevice = async (name: string, location: string): Promise<string> => {
  try {
    setIsLoading(true);
    const newDevice = await deviceService.createDevice({
      name,
      type: 'plant',
      location,
    });
    
    // Обновляем список устройств
    await loadDevices();
    
    setShowAddModal(false);
    
    // Показываем инструкцию по настройке ESP32
    Alert.alert(
      'Устройство создано',
      `Устройство "${name}" успешно создано!\n\n` +
      `ID устройства: ${newDevice.id}\n\n` +
      `Для подключения ESP32:\n` +
      `1. Скопируйте ID устройства\n` +
      `2. Настройте WiFi в коде ESP32\n` +
      `3. Вставьте ID устройства в config.h\n` +
      `4. Загрузите прошивку на ESP32`,
      [
        {
          text: 'Скопировать ID',
          onPress: () => {
            console.log('Device ID:', newDevice.id);
            Clipboard.setString(newDevice.id);
            Alert.alert('Скопировано', 'Device ID скопирован в буфер обмена');
          }
        },
        { text: 'OK' }
      ]
    );
    
    return newDevice.id;
  } catch (error: any) {
    Alert.alert(
      'Ошибка',
      error.response?.data?.error || 'Не удалось создать устройство'
    );
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const renderDevice = ({ item }: { item: Device }) => (
    <DeviceCard device={item} onPress={() => handleDevicePress(item)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Привет, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>
          {devices.length === 0
            ? 'Добавьте первое устройство'
            : `Устройств: ${devices.length}`}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => setShowAddModal(true)} 
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={32} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Нет устройств</Text>
      <Text style={styles.emptyText}>
        Нажмите на "+" чтобы добавить ваше первое устройство ESP32
      </Text>
      <Button
        title="Добавить устройство"
        onPress={() => setShowAddModal(true)}
        style={styles.addDeviceButton}
      />
    </View>
  );

  if (isLoading && devices.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Загрузка устройств...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      <AddDeviceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDevice}
        loading={isLoading}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  addButton: {
    padding: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.xl,
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
    marginBottom: SPACING.xl,
  },
  addDeviceButton: {
    marginTop: SPACING.md,
    minWidth: 200,
  },
});
