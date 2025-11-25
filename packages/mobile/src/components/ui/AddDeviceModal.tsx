import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button } from '@/components/ui';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, location: string) => Promise<string>; // Возвращает deviceId
  loading?: boolean;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Название устройства обязательно');
      return;
    }

    try {
      await onSubmit(name.trim(), location.trim() || 'Не указано');
      
      // Очищаем форму
      setName('');
      setLocation('');
      setError('');
    } catch (err) {
      // Ошибка уже обработана в родительском компоненте
      console.error('Submit error:', err);
    }
  };

  const handleClose = () => {
    setName('');
    setLocation('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Новое устройство</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Input
              label="Название устройства *"
              placeholder="Фикус в гостиной"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              error={error}
              icon="leaf"
              autoFocus
            />

            <Input
              label="Местоположение (необязательно)"
              placeholder="Гостиная"
              value={location}
              onChangeText={setLocation}
              icon="location"
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Отмена"
              variant="outline"
              onPress={handleClose}
              style={styles.button}
              disabled={loading}
            />
            <Button
              title="Создать"
              onPress={handleSubmit}
              style={styles.button}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
  },
});
