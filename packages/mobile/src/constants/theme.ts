export const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  danger: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  
  // Sensor status colors
  sensor: {
    normal: '#4CAF50',
    warning: '#FF9800',
    critical: '#F44336',
  },
  
  // UI colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;
