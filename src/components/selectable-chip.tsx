import { Pressable, Text } from 'react-native';

import { Fonts } from '@/constants/theme';

type SelectableChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2.5 ${
        selected
          ? 'border-primary bg-primary'
          : 'border-hairline bg-primary/10 dark:border-neutral-800 dark:bg-primary/15'
      }`}>
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className={`text-sm ${selected ? 'text-white' : 'text-primary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
