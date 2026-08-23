import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AppointmentStatus } from '@/services/appointments';

type AppointmentCardProps = {
  title: string;
  date: string;
  status: AppointmentStatus;
  onPress: () => void;
};

export function AppointmentCard({ title, date, status, onPress }: AppointmentCardProps) {
  const theme = useTheme();
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-hairline px-4 py-3 dark:border-neutral-800">
      <View
        className={`h-5 w-5 items-center justify-center rounded-md border ${
          isCompleted ? 'border-primary bg-primary' : 'border-hairline dark:border-neutral-600'
        }`}>
        {isCompleted && (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            tintColor="#FFFFFF"
            size={12}
          />
        )}
      </View>

      <View className="flex-1 gap-0.5">
        <Text
          style={{ fontFamily: Fonts.semiBold }}
          className={`text-base ${
            isCancelled ? 'text-muted line-through' : 'text-black dark:text-white'
          }`}>
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
    </Pressable>
  );
}
