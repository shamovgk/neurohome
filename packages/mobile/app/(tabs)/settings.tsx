import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconColor?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  iconColor = COLORS.primary,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.item}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </Card>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Устройства</Text>
        
        <SettingsItem
          icon="add-circle"
          title="Добавить устройство"
          subtitle="Подключить новый ESP32"
          onPress={() => Alert.alert('В разработке', 'Скоро появится')}
        />
        
        <SettingsItem
          icon="list"
          title="Мои устройства"
          subtitle="Управление подключенными устройствами"
          onPress={() => router.push('/(tabs)')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        
        <SettingsItem
          icon="notifications"
          title="Уведомления"
          subtitle="Настройка push-уведомлений"
          onPress={() => Alert.alert('В разработке', 'Скоро появится')}
        />
        
        <SettingsItem
          icon="color-palette"
          title="Внешний вид"
          subtitle="Тема приложения"
          onPress={() => Alert.alert('В разработке', 'Скоро появится')}
        />
        
        <SettingsItem
          icon="language"
          title="Язык"
          subtitle="Русский"
          onPress={() => Alert.alert('В разработке', 'Скоро появится')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        
        <SettingsItem
          icon="help-circle"
          title="Помощь и поддержка"
          onPress={() => Alert.alert('В разработке', 'Скоро появится')}
          iconColor={COLORS.secondary}
        />
        
        <SettingsItem
          icon="information-circle"
          title="О приложении"
          subtitle="Версия 1.0.0"
          onPress={() => Alert.alert('NeuroHome', 'Версия 1.0.0\n\nIoT система для ухода за растениями')}
          iconColor={COLORS.secondary}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

      <Text style={styles.version}>NeuroHome v1.0.0</Text>
    </ScrollView>
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
  content: {
    padding: SPACING.md,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger + '10',
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.danger,
  },
  version: {
    textAlign: 'center',
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
});
