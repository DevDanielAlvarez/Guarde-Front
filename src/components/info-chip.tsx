import { Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type InfoChipProps = {
  label: string;
  tone?: 'default' | 'danger';
};

export function InfoChip({ label, tone = 'default' }: InfoChipProps) {
  const isDanger = tone === 'danger';

  return (
    <View
      className={`rounded-full border px-3 py-1.5 ${
        isDanger
          ? 'border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/40'
          : 'border-hairline bg-primary/10 dark:border-neutral-800 dark:bg-primary/15'
      }`}>
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className={`text-xs ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}>
        {label}
      </Text>
    </View>
  );
}
