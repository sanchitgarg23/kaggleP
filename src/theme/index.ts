import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#1D9E75',
  danger: '#E24B4A',
  warning: '#EF9F27',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#17211E',
  muted: '#65746F',
  border: '#DDE5E1',
  darkRed: '#8F1D1C',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    error: colors.danger,
    background: colors.background,
    surface: colors.card,
    onSurface: colors.text,
  },
};
