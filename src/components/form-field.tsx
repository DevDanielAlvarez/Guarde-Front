import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = {
  label: string;
  icon: SymbolViewProps['name'];
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureToggle?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  autoComplete?: TextInputProps['autoComplete'];
};

export function FormField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  secureToggle,
  keyboardType,
  maxLength,
  autoCapitalize = 'sentences',
  textContentType,
  autoComplete,
}: FormFieldProps) {
  const [hidden, setHidden] = useState(secureToggle);
  const theme = useTheme();

  return (
    <View className="gap-1.5">
      <Text className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</Text>
      <View
        className={`flex-row items-center gap-3 rounded-full border bg-surface-subtle px-5 py-3.5 dark:bg-neutral-800 ${
          error ? 'border-red-400' : 'border-transparent'
        }`}>
        <SymbolView name={icon} tintColor={theme.textSecondary} size={18} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoComplete={autoComplete}
          className="flex-1 text-base text-black dark:text-white"
        />
        {secureToggle && (
          <Pressable onPress={() => setHidden((prev) => !prev)} hitSlop={8}>
            <SymbolView
              name={
                hidden
                  ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                  : { ios: 'eye', android: 'visibility', web: 'visibility' }
              }
              tintColor={theme.textSecondary}
              size={18}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
