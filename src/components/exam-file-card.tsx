import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type ExamFileCardProps = {
  name: string;
  date: string;
  type: 'image' | 'document';
  wide?: boolean;
};

export function ExamFileCard({ name, date, type, wide }: ExamFileCardProps) {
  return (
    <Pressable className={wide ? 'w-full gap-2' : 'w-[48%] gap-2'}>
      <View
        className={`items-center justify-center overflow-hidden rounded-2xl bg-black dark:bg-neutral-900 ${
          wide ? 'aspect-[16/9]' : 'aspect-square'
        }`}>
        <SymbolView
          name={
            type === 'image'
              ? { ios: 'photo.fill', android: 'image', web: 'image' }
              : { ios: 'doc.text.fill', android: 'description', web: 'description' }
          }
          tintColor="#FFFFFF"
          size={wide ? 36 : 28}
        />
      </View>

      <View className="gap-0.5 px-0.5">
        <Text
          numberOfLines={1}
          style={{ fontFamily: Fonts.semiBold }}
          className="text-sm text-black dark:text-white">
          {name}
        </Text>
        <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
          {date}
        </Text>
      </View>
    </Pressable>
  );
}
