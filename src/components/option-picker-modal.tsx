import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PickerOption = { id: string; label: string };

type OptionPickerModalProps = {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
};

export function OptionPickerModal({
  visible,
  title,
  options,
  selectedIds,
  onToggle,
  onClose,
}: OptionPickerModalProps) {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-surface-subtle dark:bg-black">
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-xl text-black dark:text-white">
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="h-9 w-9 items-center justify-center rounded-full bg-surface dark:bg-neutral-900">
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor={theme.text}
                size={16}
              />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3 mx-6 mt-2 rounded-full border border-transparent bg-surface-subtle px-5 py-3 dark:bg-neutral-800">
            <SymbolView
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor={theme.textSecondary}
              size={18}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar..."
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              style={{ fontFamily: Fonts.regular }}
              className="flex-1 text-base text-black dark:text-white"
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-1 p-6"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text
                style={{ fontFamily: Fonts.regular }}
                className="pt-8 text-center text-sm text-muted">
                Nenhum resultado para essa busca.
              </Text>
            }
            renderItem={({ item }) => {
              const selected = selectedIds.includes(item.id);
              return (
                <Pressable
                  onPress={() => onToggle(item.id)}
                  className="flex-row items-center justify-between rounded-2xl px-3 py-3.5"
                  style={({ pressed }) => pressed && { opacity: 0.7 }}>
                  <Text
                    style={{ fontFamily: Fonts.regular }}
                    className="flex-1 text-base text-black dark:text-white">
                    {item.label}
                  </Text>
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selected ? 'border-primary bg-primary' : 'border-hairline dark:border-neutral-700'
                    }`}>
                    {selected ? (
                      <SymbolView
                        name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                        tintColor="#FFFFFF"
                        size={14}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />

          <View className="px-6 pb-4 pt-2">
            <Pressable
              onPress={onClose}
              className="items-center rounded-full bg-primary py-4"
              style={({ pressed }) => pressed && { opacity: 0.85 }}>
              <Text style={{ fontFamily: Fonts.semiBold }} className="text-base text-white">
                {selectedIds.length > 0 ? `Aplicar (${selectedIds.length})` : 'Concluir'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
