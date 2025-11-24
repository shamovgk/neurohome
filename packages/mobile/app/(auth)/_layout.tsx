import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем loading пока проверяем auth статус
  if (isLoading) {
    return null; // Или можно показать splash screen
  }

  // Если уже авторизован, редирект на главную
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
