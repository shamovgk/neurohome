import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать, {user?.name}!</Text>
      <Text style={styles.subtitle}>Здесь будет дашборд с вашими устройствами</Text>
      
      <Button
        title="Выйти"
        variant="outline"
        onPress={logout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    marginTop: SPACING.xl,
  },
});
