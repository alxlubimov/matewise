import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
export const palette = { ink: '#222a27', muted: '#667269', green: '#244f43', mint: '#d5e9df', soft: '#f3f5f1', line: '#dce2dd', white: '#ffffff', warning: '#7d5b26' };
export function Txt({ children, style, tone = 'body', ...props }: React.ComponentProps<typeof Text> & { tone?: 'body' | 'muted' | 'title' | 'label' }) {
  return <Text {...props} style={[s.text, tone === 'muted' && s.muted, tone === 'title' && s.title, tone === 'label' && s.label, style]}>{children}</Text>;
}
export function Icon({ name, size = 20, color = palette.ink }: { name: React.ComponentProps<typeof Feather>['name']; size?: number; color?: string }) {
  return <Feather name={name} size={size} color={color} />;
}
export function Button({ label, onPress, kind = 'solid', disabled, icon, testID }: { label: string; onPress: () => void; kind?: 'solid' | 'outline' | 'quiet'; disabled?: boolean; icon?: React.ComponentProps<typeof Feather>['name']; testID?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} testID={testID} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, kind === 'outline' && s.outline, kind === 'quiet' && s.quiet, disabled && s.disabled, pressed && s.pressed]}>
    {icon && <Icon name={icon} color={kind === 'solid' ? palette.white : palette.green} size={18} />}
    <Txt style={[s.buttonText, kind !== 'solid' && { color: palette.green }]}>{label}</Txt>
  </Pressable>;
}
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  if (!onPress) return <View style={s.tag}><Txt style={s.tagText}>{label}</Txt></View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: !!selected }} onPress={onPress} style={[s.chip, selected && s.chipActive]}><Txt style={[s.chipText, selected && { color: palette.green, fontFamily: 'GolosMedium' }]}>{label}</Txt></Pressable>;
}
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return <View accessibilityLabel={name} style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}><Txt style={{ fontFamily: 'GolosMedium', color: palette.green, fontSize: size * .34 }}>{name.slice(0, 1).toUpperCase()}</Txt></View>;
}
export function Notice({ children, warning = false }: { children: React.ReactNode; warning?: boolean }) {
  return <View style={[s.notice, warning && { backgroundColor: '#f7f0e4' }]}><Icon name={warning ? 'alert-circle' : 'info'} size={16} color={warning ? palette.warning : palette.green} /><Txt style={{ fontSize: 12, lineHeight: 18, flex: 1, color: warning ? palette.warning : palette.muted }}>{children}</Txt></View>;
}
export function Empty({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return <View style={s.empty}><Icon name="search" size={30} color={palette.muted} /><Txt tone="title" style={{ fontSize: 22, marginTop: 15 }}>{title}</Txt><Txt tone="muted" style={{ textAlign: 'center', marginTop: 10 }}>{text}</Txt>{children && <View style={{ marginTop: 20, alignSelf: 'stretch' }}>{children}</View>}</View>;
}
export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white }, content: { padding: 22, paddingBottom: 32, gap: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, card: { borderWidth: 1, borderColor: palette.line, borderRadius: 16, padding: 18, gap: 14 },
  divider: { height: 1, backgroundColor: palette.line }, input: { borderWidth: 1, borderColor: palette.line, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, minHeight: 48, fontFamily: 'GolosRegular', fontSize: 15, color: palette.ink, backgroundColor: palette.white },
  field: { gap: 7 }, label: { fontFamily: 'GolosMedium', fontSize: 13, color: palette.muted }, sectionTitle: { fontFamily: 'GolosSemiBold', fontSize: 21, lineHeight: 28 },
});
const s = StyleSheet.create({
  text: { fontFamily: 'GolosRegular', color: palette.ink, fontSize: 15, lineHeight: 23 }, muted: { color: palette.muted }, title: { fontFamily: 'GolosSemiBold', fontSize: 28, lineHeight: 34, letterSpacing: -.6 }, label: { fontFamily: 'GolosMedium', fontSize: 12, lineHeight: 18, color: palette.muted },
  button: { minHeight: 50, borderRadius: 10, backgroundColor: palette.green, paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }, outline: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line }, quiet: { backgroundColor: 'transparent' }, disabled: { opacity: .4 }, pressed: { opacity: .75 }, buttonText: { fontFamily: 'GolosMedium', color: palette.white, fontSize: 14 },
  chip: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: palette.line, borderRadius: 22, backgroundColor: palette.white }, chipActive: { backgroundColor: '#e8f1e9', borderColor: '#a7bfad' }, chipText: { fontSize: 13, lineHeight: 20, color: palette.muted },
  tag: { backgroundColor: palette.soft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7 }, tagText: { fontSize: 11, lineHeight: 17, color: palette.muted }, avatar: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5eee5' },
  notice: { backgroundColor: palette.soft, padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 9 }, empty: { paddingHorizontal: 22, paddingVertical: 48, alignItems: 'center' },
});
