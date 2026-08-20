import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { type PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

type AuthLayoutProps = PropsWithChildren<{
  heroImage: ImageSource;
  navLabel: string;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}>;

export function AuthLayout({
  heroImage,
  navLabel,
  title,
  subtitle,
  showBack,
  children,
}: AuthLayoutProps) {
  // Fixed pixel height (not a %-based className) — percentage heights don't
  // resolve reliably for a child of a ScrollView's auto-sized content container.
  const { height: windowHeight } = useWindowDimensions();
  const heroHeight = Math.max(200, Math.round(windowHeight * 0.34));

  return (
    <View className="flex-1 bg-surface dark:bg-black">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.select({ ios: 'padding', default: undefined })}>
          <ScrollView
            contentContainerClassName="flex-grow"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={{ height: heroHeight }}>
              <Image
                source={heroImage}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                contentPosition="top"
              />
              <View className="flex-row items-center justify-center px-6 pt-2">
                {showBack && (
                  <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    className="absolute left-6 h-9 w-9 items-center justify-center rounded-full bg-black/30">
                    <SymbolView
                      name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                      tintColor="#FFFFFF"
                      size={18}
                    />
                  </Pressable>
                )}
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-xs uppercase tracking-[3px] text-white/80">
                  {navLabel}
                </Text>
              </View>
            </View>

            <View className="-mt-8 flex-1 gap-5 rounded-t-[32px] bg-surface px-6 pb-8 pt-8 dark:bg-neutral-900">
              <View className="items-center gap-2 pb-2">
                <Image
                  source={require('@/assets/images/branding/logo.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
                <Text
                  style={{ fontFamily: Fonts.extraBold }}
                  className="text-3xl text-black dark:text-white">
                  {title}
                </Text>
                {subtitle ? (
                  <Text
                    style={{ fontFamily: Fonts.regular }}
                    className="text-center text-sm text-muted">
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 56,
    height: 56,
  },
});
