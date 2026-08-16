import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type TabButtonProps = TabTriggerSlotProps & {
  icon: SymbolViewProps['name'];
  activeIcon: SymbolViewProps['name'];
};

const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon, activeIcon, isFocused, href: _href, ...props },
  ref
) {
  const theme = useTheme();

  return (
    <Pressable ref={ref} {...props} className="flex-1 items-center justify-center py-2">
      <View
        className={`h-10 w-10 items-center justify-center rounded-2xl ${
          isFocused ? 'bg-primary' : ''
        }`}>
        <SymbolView
          name={isFocused ? activeIcon : icon}
          tintColor={isFocused ? '#FFFFFF' : theme.textSecondary}
          size={22}
        />
      </View>
    </Pressable>
  );
});

export function AppTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t border-hairline bg-surface dark:border-neutral-800 dark:bg-black"
      style={{ paddingBottom: insets.bottom }}>
      <TabTrigger name="index" asChild>
        <TabButton
          icon={{ ios: 'house', android: 'home', web: 'home' }}
          activeIcon={{ ios: 'house.fill', android: 'home', web: 'home' }}
        />
      </TabTrigger>
      <TabTrigger name="files" asChild>
        <TabButton
          icon={{ ios: 'folder', android: 'folder', web: 'folder' }}
          activeIcon={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
        />
      </TabTrigger>

      <View className="flex-1 items-center justify-center">
        <Pressable
          onPress={() => router.push('/chat')}
          style={styles.fabWrapper}
          className="shadow-lg shadow-black/30">
          <LinearGradient colors={['#2FA8FF', '#00C2FF']} style={styles.fab}>
            <SymbolView
              name={{ ios: 'bubble.left.and.bubble.right.fill', android: 'chat', web: 'chat' }}
              tintColor="#FFFFFF"
              size={22}
            />
          </LinearGradient>
        </Pressable>
      </View>

      <TabTrigger name="calendar" asChild>
        <TabButton
          icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          activeIcon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
        />
      </TabTrigger>
      <TabTrigger name="profile" asChild>
        <TabButton
          icon={{ ios: 'person', android: 'person', web: 'person' }}
          activeIcon={{ ios: 'person.fill', android: 'person', web: 'person' }}
        />
      </TabTrigger>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    marginTop: -28,
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
