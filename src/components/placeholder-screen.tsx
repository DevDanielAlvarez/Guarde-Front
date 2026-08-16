import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.two,
          paddingHorizontal: Spacing.four,
        }}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
          {description}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
