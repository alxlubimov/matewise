import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { Button, Chip, Icon, Notice, Txt, Empty, palette, shared } from '../components/ui';
import { GroupCard } from '../components/GroupCard';
import { useApp, useCatalog } from '../state/AppProvider';
import { matches } from '../domain/groups';
import type { Navigation } from '../navigation';
export function SearchScreen({ navigation }: { navigation: Navigation }) {
  const { state } = useApp(); const { groups } = useCatalog();
  const [mode, setMode] = useState<'people' | 'rooms'>('people');
  const [city, setCity] = useState<string>(state.profile.city);
  const [budget, setBudget] = useState(50000); const [draftBudget, setDraftBudget] = useState('50000');
  const [filters, setFilters] = useState(false); const [savedOnly, setSavedOnly] = useState(false); const [error, setError] = useState('');
  const visible = groups.filter(g => matches(g, mode, city, budget) && (!savedOnly || state.favorites.includes(g.id)));
  return <ScrollView contentContainerStyle={shared.content} keyboardShouldPersistTaps="handled">
    <View style={shared.between}><View><Txt tone="title">Для вас</Txt><Txt tone="muted" style={{ fontSize: 13 }}>{city || 'Все города'} · до {budget.toLocaleString('ru-RU')} ₽ на человека</Txt></View><Pressable accessibilityRole="button" accessibilityLabel="Фильтры поиска" onPress={() => setFilters(!filters)} style={{ padding: 12 }}><Icon name="sliders" /></Pressable></View>
    <View style={shared.row}><Chip label="Найти соседа" selected={mode === 'people'} onPress={() => setMode('people')} /><Chip label="Найти комнату" selected={mode === 'rooms'} onPress={() => setMode('rooms')} /></View>
    {filters && <View style={shared.card}><Txt style={shared.sectionTitle}>Условия поиска</Txt><View style={shared.tags}>{['Москва', 'Санкт-Петербург', ''].map(c => <Chip key={c} label={c || 'Все города'} selected={city === c} onPress={() => setCity(c)} />)}</View><View style={shared.field}><Txt style={shared.label}>Максимум на человека, ₽ / мес.</Txt><TextInput accessibilityLabel="Максимальный бюджет" value={draftBudget} onChangeText={setDraftBudget} keyboardType="number-pad" style={shared.input} maxLength={6} /></View>{!!error && <Txt style={{ color: '#a13d31', fontSize: 13 }}>{error}</Txt>}<Button label="Применить бюджет" kind="outline" onPress={() => { const next = Number(draftBudget); if (!Number.isFinite(next) || next < 1000 || next > 500000) { setError('Укажите сумму от 1 000 до 500 000 ₽.'); return; } setBudget(next); setError(''); setFilters(false); }} /></View>}
    <View style={shared.between}><Txt tone="label">{visible.length} {mode === 'rooms' ? 'учебных вариантов жилья' : 'учебных анкет'}</Txt><Pressable accessibilityRole="button" accessibilityState={{ selected: savedOnly }} accessibilityLabel="Только сохранённые" onPress={() => setSavedOnly(!savedOnly)} style={{ paddingVertical: 8 }}><Txt style={{ fontSize: 12, color: savedOnly ? palette.green : palette.muted }}>{savedOnly ? 'Все анкеты' : 'Сохранённые'}</Txt></Pressable></View>
    <Notice>Можно искать одного соседа или присоединиться к группе. У каждого участника своя анкета.</Notice>
    {visible.map(group => <GroupCard key={group.id} group={group} onOpen={() => navigation.group(group.id)} />)}
    {!visible.length && <Empty title="Пока нет вариантов" text="Попробуйте другой город, бюджет или отключите фильтр сохранённых." ><Button label="Сбросить фильтры" kind="outline" onPress={() => { setCity(''); setBudget(500000); setDraftBudget('500000'); setSavedOnly(false); }} /></Empty>}
  </ScrollView>;
}
