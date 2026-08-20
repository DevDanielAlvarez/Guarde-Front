import { useColorScheme } from 'nativewind';
import { Switch } from 'react-native';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Switch
      value={isDark}
      onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
      trackColor={{ false: '#D1D5DB', true: '#0A84FF' }}
      thumbColor="#FFFFFF"
    />
  );
}
