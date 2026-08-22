import { useFonts } from 'expo-font';
import { NavigationBar } from 'expo-navigation-bar';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

SplashScreen.preventAutoHideAsync();

const PUBLIC_SEGMENTS = ['welcome', 'login', 'register'];

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const segment = segments[0] ?? '';
    const inPublicGroup = PUBLIC_SEGMENTS.includes(segment);
    if (!isAuthenticated && !inPublicGroup) {
      router.replace('/welcome');
    } else if (isAuthenticated && segment === 'welcome') {
      // Only the welcome screen auto-redirects once authenticated (e.g. app
      // reopened with a saved session). Login and register own their own
      // post-auth navigation (register sends the user into onboarding
      // instead of home) — redirecting them here too raced against that.
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationBar hidden />
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding-allergies" />
        <Stack.Screen name="onboarding-conditions" />
        <Stack.Screen name="onboarding-blood-type" />
        <Stack.Screen name="onboarding-continuous-medications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
        <Stack.Screen name="medical-summary" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-exam" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Imported by exact file path (instead of the '@expo-google-fonts/inter' barrel)
    // so Metro only bundles the weights we actually use.
    Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    Inter_800ExtraBold: require('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
    // expo-symbols loads this itself per-icon on Android/web, but that's async and
    // per-instance — preloading it here means it's already cached by the time any
    // SymbolView mounts, instead of racing (and sometimes losing) on first paint.
    MaterialSymbols_400Regular: require('@expo-google-fonts/material-symbols/400Regular/MaterialSymbols_400Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
