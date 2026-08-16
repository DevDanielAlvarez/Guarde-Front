import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    // Imported by exact file path (instead of the '@expo-google-fonts/inter' barrel)
    // so Metro only bundles the weights we actually use.
    Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    Inter_800ExtraBold: require('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
