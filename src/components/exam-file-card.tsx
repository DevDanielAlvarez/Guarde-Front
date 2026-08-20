import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type ExamFileCardProps = {
  name: string;
  date: string;
  type: 'image' | 'document';
  wide?: boolean;
  uri?: string;
  token?: string | null;
  onPress?: () => void;
};

export function ExamFileCard({ name, date, type, wide, uri, token, onPress }: ExamFileCardProps) {
  return (
    <Pressable onPress={onPress} className={wide ? 'w-full gap-2' : 'w-[48%] gap-2'}>
      <View
        className={`items-center justify-center overflow-hidden rounded-2xl bg-black dark:bg-neutral-900 ${
          wide ? 'aspect-[16/9]' : 'aspect-square'
        }`}>
        {uri ? (
          <Image
            source={{ uri, headers: token ? { Authorization: `Bearer ${token}` } : undefined }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <SymbolView
            name={
              type === 'image'
                ? { ios: 'photo.fill', android: 'image', web: 'image' }
                : { ios: 'doc.text.fill', android: 'description', web: 'description' }
            }
            tintColor="#FFFFFF"
            size={wide ? 36 : 28}
          />
        )}
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
