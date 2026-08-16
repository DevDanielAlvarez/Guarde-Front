import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProfileSectionProps = {
  title: string;
  icon: SymbolViewProps['name'];
  children: ReactNode;
};

export function ProfileSection({ title, icon, children }: ProfileSectionProps) {
  const theme = useTheme();

  return (
    <View className="gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <View className="flex-row items-center gap-2">
        <SymbolView name={icon} tintColor={theme.textSecondary} size={16} />
        <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-muted">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
