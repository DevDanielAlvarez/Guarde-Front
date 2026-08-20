import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

const TAB_ICONS: Record<
  string,
  { icon: SymbolViewProps['name']; activeIcon: SymbolViewProps['name'] }
> = {
  index: {
    icon: { ios: 'house', android: 'home', web: 'home' },
    activeIcon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  files: {
    icon: { ios: 'folder', android: 'folder', web: 'folder' },
    activeIcon: { ios: 'folder.fill', android: 'folder', web: 'folder' },
  },
  calendar: {
    icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
    activeIcon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  },
  profile: {
    icon: { ios: 'person', android: 'person', web: 'person' },
    activeIcon: { ios: 'person.fill', android: 'person', web: 'person' },
  },
};

type TabBarItemProps = {
  routeName: string;
  selectedTab: string;
  navigate: (routeName: string) => void;
};

export function TabBarItem({ routeName, selectedTab, navigate }: TabBarItemProps) {
  const theme = useTheme();
  const isFocused = routeName === selectedTab;
  const { icon, activeIcon } = TAB_ICONS[routeName] ?? TAB_ICONS.index;

  return (
    <Pressable
      onPress={() => navigate(routeName)}
      className="flex-1 items-center justify-center py-2">
      <View
        className={`h-10 w-14 items-center justify-center rounded-full ${
          isFocused ? 'bg-primary shadow-sm shadow-primary/40' : ''
        }`}>
        <SymbolView
          name={isFocused ? activeIcon : icon}
          tintColor={isFocused ? '#FFFFFF' : theme.textSecondary}
          size={22}
        />
      </View>
    </Pressable>
  );
}

export function ChatCircleButton() {
  return (
    <View style={styles.fabWrapper} className="shadow-lg shadow-black/30">
      <Pressable onPress={() => router.push('/chat')} style={styles.fabPressable}>
        <LinearGradient colors={['#2FA8FF', '#00C2FF']} style={styles.fab}>
          <SymbolView
            name={{ ios: 'bubble.left.and.bubble.right.fill', android: 'chat', web: 'chat' }}
            tintColor="#FFFFFF"
            size={22}
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabPressable: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
