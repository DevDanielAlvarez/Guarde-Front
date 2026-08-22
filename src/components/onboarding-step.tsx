import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

type OnboardingStepProps = PropsWithChildren<{
  stepIndex: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onSkip: () => void;
  onContinue: () => void;
  continueLabel?: string;
  isSubmitting?: boolean;
}>;

export function OnboardingStep({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  onSkip,
  onContinue,
  continueLabel,
  isSubmitting,
  children,
}: OnboardingStepProps) {
  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {router.canGoBack() ? (
          <View className="px-6 pt-2">
            <Pressable onPress={() => router.back()} hitSlop={8} className="self-start">
              <SymbolView
                name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                tintColor="#0B0B0C"
                size={20}
              />
            </Pressable>
          </View>
        ) : null}

        <ScrollView
          contentContainerClassName="gap-6 px-6 pb-6 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View className="gap-2">
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-3xl text-black dark:text-white">
              {title}
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-base text-muted">
              {subtitle}
            </Text>
          </View>

          {children}
        </ScrollView>

        <View className="flex-row items-center justify-between px-8 pb-4 pt-2">
          <Pressable onPress={onSkip} hitSlop={8}>
            <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-muted">
              Pular
            </Text>
          </Pressable>

          <View className="flex-row gap-1.5">
            {Array.from({ length: totalSteps }).map((_, dotIndex) => (
              <View
                key={dotIndex}
                className={`h-1.5 rounded-full ${
                  dotIndex === stepIndex ? 'w-6 bg-primary' : 'w-1.5 bg-primary/25'
                }`}
              />
            ))}
          </View>

          {continueLabel ? (
            <Pressable
              onPress={onContinue}
              disabled={isSubmitting}
              className={`rounded-full px-5 py-3 ${isSubmitting ? 'bg-primary/40' : 'bg-primary'}`}
              style={({ pressed }) => pressed && { opacity: 0.85 }}>
              <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-white">
                {continueLabel}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={onContinue}
              disabled={isSubmitting}
              className={`h-12 w-12 items-center justify-center rounded-full ${
                isSubmitting ? 'bg-primary/40' : 'bg-primary'
              }`}
              style={({ pressed }) => pressed && { opacity: 0.85 }}>
              <SymbolView
                name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                tintColor="#FFFFFF"
                size={20}
              />
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
