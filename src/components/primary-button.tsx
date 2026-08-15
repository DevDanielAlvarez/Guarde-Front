import { Pressable, Text } from 'react-native';

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
      <Text className="text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
