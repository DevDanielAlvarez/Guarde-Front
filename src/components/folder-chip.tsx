import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type FolderChipProps = {
  name: string;
};

export function FolderChip({ name }: FolderChipProps) {
  return (
    <Pressable className="w-20 items-center gap-2">
      <View className="h-16 w-20 items-center justify-center rounded-2xl bg-primary/15 dark:bg-primary/20">
        <SymbolView
          name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
          tintColor="#0A84FF"
          size={28}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{ fontFamily: Fonts.medium }}
        className="text-xs text-black dark:text-white">
        {name}
      </Text>
    </Pressable>
  );
}
