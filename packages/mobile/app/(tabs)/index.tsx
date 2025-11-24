import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDevices, setSelectedDevice } from '@/store/slices/devicesSlice';
import { DeviceCard } from '@/components/ui';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Device } from '@/types/device';

// Временные моковые данные (позже заменим на API)
const MOCK_DEVICES: Device[] = [
  {
    id: 'device-1',
    name: 'Фикус в гостиной',
    type: 'plant',
    status: 'online',
    lastSeen: new Date().toISOString(),
    location: 'Гостиная',
    plantProfile: {
      id: 'plant-1',
      name: 'Фикус Бенджамина',
      species: 'Ficus benjamina',
      thresholds: {
        soilMoisture: { min: 40, max: 60 },
        temperature: { min: 18, max: 25 },
        airHumidity: { min: 50, max: 70 },
        light: { min: 8000, max: 15000 },
      },
    },
  },
  {
    id: 'device-2',
    name: 'Суккуленты на балконе',
    type: 'plant',
    status: 'online',
    lastSeen: new Date(Date.now() - 300000).toISOString(),
    location: 'Балкон',
    plantProfile: {
      id: 'plant-2',
      name: 'Эхеверия',
      species: 'Echeveria',
      thresholds: {
        soilMoisture: { min: 20, max: 40 },
        temperature: { min: 15, max: 30 },
        airHumidity: { min: 30, max: 50 },
        light: { min: 12000, max: 20000 },
      },
    },
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API запрос
      // const response = await apiClient.get('/api/v1/devices');
      // dispatch(setDevices(response.data.data));
      
      // Пока используем моковые данные
      setTimeout(() => {
        dispatch(setDevices(MOCK_DEVICES));
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading devices:', error);
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

  const renderDevice = ({ item }: { item: Device }) => (
    <DeviceCard device={item} onPress={() => handleDevicePress(item)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Привет, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Ваши растения сегодня</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Нет устройств</Text>
      <Text style={styles.emptyText}>
        Добавьте ваше первое устройство ESP32, чтобы начать мониторинг растений
      </Text>
    </View>
  );

  if (isLoading && devices.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  listContent: {
    padding: SPACING.md,
  },
  header: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
