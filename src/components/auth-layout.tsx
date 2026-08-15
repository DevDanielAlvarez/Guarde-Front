import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Image source={heroImage} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
        locations={[0, 0.4, 1]}
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.select({ ios: 'padding', default: undefined })}>
          <ScrollView contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
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
              <Text className="text-xs font-semibold uppercase tracking-[3px] text-white/80">
                {navLabel}
              </Text>
            </View>

            <View className="flex-1 items-center justify-center gap-3 px-8 pb-10">
              <Image
                source={require('@/assets/images/branding/logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
              <Text
                style={{ fontFamily: Fonts.serif }}
                className="text-5xl font-bold text-white">
                {title}
              </Text>
              {subtitle ? (
                <Text className="text-center text-base text-white/85">{subtitle}</Text>
              ) : null}
            </View>

            <View className="mx-5 mb-6 gap-5 rounded-[32px] bg-surface p-6 shadow-2xl dark:bg-neutral-900">
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
    width: 68,
    height: 68,
  },
});
