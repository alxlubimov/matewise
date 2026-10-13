import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useApp } from '../state/AppProvider';
import { Icon, Notice, Txt, palette } from './ui';
const tabs: { path: '/' | '/groups' | '/chats' | '/profile'; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { path: '/', label: 'Поиск', icon: 'search' }, { path: '/groups', label: 'Группы', icon: 'users' },
  { path: '/chats', label: 'Чаты', icon: 'message-circle' }, { path: '/profile', label: 'Профиль', icon: 'user' },
];
export function ScreenFrame({ children, title }: { children: React.ReactNode; title?: string }) {
  const { ready, error } = useApp(); const router = useRouter(); const path = usePathname(); const insets = useSafeAreaInsets();
  if (!ready) return <View style={s.loading}><ActivityIndicator size="large" color={palette.green} /><Txt tone="muted">Открываем Matewise…</Txt></View>;
  return <View style={s.root}><SafeAreaView style={s.frame} edges={['top', 'left', 'right']}>
    <View style={s.header}>{title ? <View style={s.headerTitle}><Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={s.back}><Icon name="arrow-left" /></Pressable><Txt style={{ fontFamily: 'GolosMedium', fontSize: 16 }}>{title}</Txt></View> : <View style={s.brand}><View style={s.brandIcon}><Txt style={s.brandM}>m</Txt><View style={s.dot} /></View><Txt style={s.brandText}>matewise.</Txt></View>}
      <Txt tone="label" style={s.demo}>Демо</Txt></View>
    {error && <View style={{ paddingHorizontal: 16 }}><Notice warning>{error}</Notice></View>}
    <View style={{ flex: 1 }}>{children}</View>
    <View style={[s.tabs, { paddingBottom: Math.max(insets.bottom, 9) }]}>{tabs.map(tab => {
      const selected = tab.path === '/' ? path === '/' || path.startsWith('/person/') || path.startsWith('/room/') : path.startsWith(tab.path) || (tab.path === '/groups' && (path.startsWith('/group/') || path === '/create')) || (tab.path === '/chats' && path.startsWith('/chat/'));
      return <Pressable key={tab.path} accessibilityRole="tab" accessibilityLabel={tab.label} accessibilityState={{ selected }} onPress={() => router.replace(tab.path)} style={s.tab}><Icon name={tab.icon} size={22} color={selected ? palette.green : palette.muted} /><Txt style={[s.tabLabel, selected && { color: palette.green, fontFamily: 'GolosMedium' }]}>{tab.label}</Txt></Pressable>;
    })}</View>
  </SafeAreaView></View>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f5f1', alignItems: 'center' }, frame: { flex: 1, width: '100%', maxWidth: 540, backgroundColor: palette.white }, loading: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 30, gap: 18, backgroundColor: palette.white },
  header: { paddingHorizontal: 22, paddingVertical: 15, minHeight: 67, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: palette.mint, alignItems: 'center', justifyContent: 'center' }, brandM: { fontFamily: 'GolosSemiBold', fontSize: 31, lineHeight: 34, marginTop: -4, letterSpacing: -2 }, dot: { position: 'absolute', right: 5, top: 5, width: 4, height: 4, borderRadius: 2, backgroundColor: palette.ink }, brandText: { fontFamily: 'GolosSemiBold', fontSize: 25, lineHeight: 32, letterSpacing: -1 }, demo: { backgroundColor: palette.soft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 10 }, headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }, back: { paddingVertical: 12, paddingRight: 12, minWidth: 38, minHeight: 44 },
  tabs: { flexDirection: 'row', paddingTop: 9, borderTopWidth: 1, borderTopColor: palette.line, backgroundColor: palette.white }, tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 48, paddingVertical: 4 }, tabLabel: { fontSize: 10, lineHeight: 16, color: palette.muted },
});
