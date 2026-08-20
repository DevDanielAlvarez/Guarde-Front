import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileSection } from '@/components/profile-section';
import { ThemeToggle } from '@/components/theme-toggle';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();

  function handleLogout() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  }

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full bg-surface dark:bg-neutral-900">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              tintColor={theme.text}
              size={18}
            />
          </Pressable>
          <Text style={{ fontFamily: Fonts.extraBold }} className="text-2xl text-black dark:text-white">
            Configurações
          </Text>
        </View>

        <ScrollView
          style={{ marginBottom: BottomTabInset }}
          contentContainerClassName="gap-4 p-4 pb-8"
          showsVerticalScrollIndicator={false}>
          <ProfileSection
            title="Aparência"
            icon={{ ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }}>
            <View className="flex-row items-center justify-between">
              <View className="gap-0.5">
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-sm text-black dark:text-white">
                  Tema escuro
                </Text>
                <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                  Substitui o tema do sistema
                </Text>
              </View>
              <ThemeToggle />
            </View>
          </ProfileSection>

          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40"
            style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <SymbolView
              name={{
                ios: 'rectangle.portrait.and.arrow.right',
                android: 'logout',
                web: 'logout',
              }}
              tintColor="#DC2626"
              size={18}
            />
            <Text
              style={{ fontFamily: Fonts.semiBold }}
              className="text-red-600 dark:text-red-400">
              Sair da conta
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
