import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { AppProvider } from '../state/AppProvider';
import { palette } from '../components/ui';
export default function RootLayout() {
  const [loaded, error] = useFonts({ GolosRegular: require('../../assets/fonts/GolosText-Regular.ttf'), GolosMedium: require('../../assets/fonts/GolosText-Medium.ttf'), GolosSemiBold: require('../../assets/fonts/GolosText-SemiBold.ttf'), ...Feather.font });
  return <SafeAreaProvider><StatusBar style="dark" />{!loaded || error ? <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }}>{error ? <Text>Не удалось загрузить шрифт. Перезапустите приложение.</Text> : <ActivityIndicator color={palette.green} />}</View> : <AppProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.white } }} /></AppProvider>}</SafeAreaProvider>;
}
