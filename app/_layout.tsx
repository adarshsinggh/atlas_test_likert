import { useEffect } from 'react';
import { Slot, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (fontsLoaded) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (!user?.isProfileComplete) {
        router.replace('/auth/profile');
      }
    }
  }, [fontsLoaded, isAuthenticated, user?.isProfileComplete]);

  if (!fontsLoaded) {
    return <Slot />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}