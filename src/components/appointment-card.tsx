import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppointmentCardProps = {
  title: string;
  date: string;
};

export function AppointmentCard({ title, date }: AppointmentCardProps) {
  const [checked, setChecked] = useState(false);
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-hairline px-4 py-3 dark:border-neutral-800">
      <Pressable
        onPress={() => setChecked((prev) => !prev)}
        hitSlop={8}
        className={`h-5 w-5 items-center justify-center rounded-md border ${
          checked ? 'border-primary bg-primary' : 'border-hairline dark:border-neutral-600'
        }`}>
        {checked && (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            tintColor="#FFFFFF"
            size={12}
          />
        )}
      </Pressable>

      <View className="flex-1 gap-0.5">
        <Text
          style={{ fontFamily: Fonts.semiBold }}
          className="text-base text-black dark:text-white">
          {title}
        </Text>
        <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
          {date}
        </Text>
      </View>

      <SymbolView
        name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
        tintColor={theme.textSecondary}
        size={18}
      />
    </View>
  );
}
