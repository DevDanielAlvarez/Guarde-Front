import { Pressable, Text } from 'react-native';

import { Fonts } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center rounded-full py-4 ${disabled ? 'bg-primary/40' : 'bg-primary'}`}
      style={({ pressed }) => pressed && { opacity: 0.85 }}>
      <Text style={{ fontFamily: Fonts.semiBold }} className="text-base text-white">
        {label}
      </Text>
    </Pressable>
  );
}
