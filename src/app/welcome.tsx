import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

type Slide = {
  key: string;
  image?: ImageSource;
  title: string;
  emphasis: string;
  description?: string;
};

const SLIDES: Slide[] = [
  {
    key: 'intro',
    title: 'Sua saúde, organizada e',
    emphasis: 'sempre com você',
  },
  {
    key: 'exams',
    image: require('@/assets/images/welcome/exams_folder.png'),
    title: 'Seus Exames, Sua Saúde,',
    emphasis: 'Seu Controle',
    description: 'Organize, visualize e compartilhe seus exames com segurança.',
  },
  {
    key: 'ai',
    image: require('@/assets/images/welcome/ia.png'),
    title: 'Seu Assistente de',
    emphasis: 'IA Sempre Com Você',
    description:
      'Respostas personalizadas com base no seu histórico clínico, sempre que você precisar.',
  },
];

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isLast = index === SLIDES.length - 1;

  function goToLogin() {
    router.replace('/login');
  }

  function goNext() {
    if (isLast) {
      goToLogin();
      return;
    }
    const nextIndex = index + 1;
    // Set the index ourselves instead of waiting for onMomentumScrollEnd — on web,
    // that event doesn't reliably fire for a programmatic (non-drag) scrollTo, which
    // left `index` stuck and made a second tap of the arrow re-scroll to the same page.
    setIndex(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}>
        {SLIDES.map((slide) => (
          <View key={slide.key} style={{ width }} className="flex-1">
            {slide.key === 'intro' ? (
              <Image
                source={require('@/assets/images/welcome/bg-logo-decorator.png')}
                style={{ width: width * 1.1, height: width * 1.1 }}
                className="absolute -bottom-10 -right-16 opacity-40"
                contentFit="contain"
              />
            ) : null}

            <SafeAreaView className="flex-1" edges={['top']}>
              {slide.key === 'intro' ? (
                <View className="flex-1 gap-6 px-8 pt-6">
                  <Image
                    source={require('@/assets/images/branding/logo.png')}
                    style={{ width: 48, height: 48 }}
                    contentFit="contain"
                  />
                  <Text
                    style={{ fontFamily: Fonts.extraBold }}
                    className="text-4xl leading-tight text-black dark:text-white">
                    {slide.title}{' '}
                    <Text style={{ fontFamily: Fonts.extraBold }} className="text-primary">
                      {slide.emphasis}
                    </Text>
                  </Text>
                </View>
              ) : (
                <>
                  <View className="flex-1 items-center justify-center px-10">
                    <Image
                      source={slide.image}
                      style={{ width: width * 0.72, height: width * 0.72 }}
                      contentFit="contain"
                    />
                  </View>

                  <View className="gap-3 px-8 pb-6">
                    <Text
                      style={{ fontFamily: Fonts.extraBold }}
                      className="text-4xl leading-tight text-black dark:text-white">
                      {slide.title}{' '}
                      <Text style={{ fontFamily: Fonts.extraBold }} className="text-primary">
                        {slide.emphasis}
                      </Text>
                    </Text>
                    <Text style={{ fontFamily: Fonts.regular }} className="text-base text-muted">
                      {slide.description}
                    </Text>
                  </View>
                </>
              )}
            </SafeAreaView>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']}>
        <View className="flex-row items-center justify-between px-8 pb-4 pt-2">
          <Pressable onPress={goToLogin} hitSlop={8}>
            <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-muted">
              Skip
            </Text>
          </Pressable>

          <View className="flex-row gap-1.5">
            {SLIDES.map((slide, slideIndex) => (
              <View
                key={slide.key}
                className={`h-1.5 rounded-full ${
                  slideIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-primary/25'
                }`}
              />
            ))}
          </View>

          <Pressable
            onPress={goNext}
            className="h-12 w-12 items-center justify-center rounded-full bg-primary"
            style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <SymbolView
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              tintColor="#FFFFFF"
              size={20}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
