import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { Button, Chip, Icon, Notice, Txt, Empty, palette, shared } from '../components/ui';
import { SwipeCard } from '../components/SwipeCard';
import type { SwipeDecision } from '../domain/swipe';
import { useApp, useCatalog } from '../state/AppProvider';
import { matches } from '../domain/groups';
import type { Navigation } from '../navigation';
export function SearchScreen({ navigation }: { navigation: Navigation }) {
  const { state, dispatch } = useApp(); const { groups } = useCatalog();
  const [mode, setMode] = useState<'people' | 'rooms'>('people');
  const [city, setCity] = useState<string>(state.profile.city);
  const [budget, setBudget] = useState(50000); const [draftBudget, setDraftBudget] = useState('50000');
  const [filters, setFilters] = useState(false); const [savedOnly, setSavedOnly] = useState(false); const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ groupId: string; text: string } | null>(null);
  const visible = groups.filter(g => matches(g, mode, city, budget) && !g.memberIds.includes(state.profile.id) && !state.requests[g.id] && (!savedOnly || state.favorites.includes(g.id)));
  const remaining = visible.filter(group => !dismissed.includes(group.id));
  const current = remaining[0];
  const decide = useCallback((decision: SwipeDecision) => {
    if (!current) return;
    if (decision === 'interest') {
      dispatch({ type: 'request', group: current, at: new Date().toISOString() });
      setFeedback({ groupId: current.id, text: 'Интерес отправлен. Чат откроется после согласия всех участников.' });
    } else setFeedback(null);
    setDismissed(previous => [...new Set([...previous, current.id])]);
  }, [current, dispatch]);
  return <ScrollView contentContainerStyle={[shared.content, { paddingTop: 10, paddingBottom: 14, gap: 10 }]} keyboardShouldPersistTaps="handled">
    <View style={shared.between}><View><Txt tone="title" style={{ fontSize: 24, lineHeight: 30 }}>Для вас</Txt><Txt tone="muted" style={{ fontSize: 13 }}>{city || 'Все города'} · до {budget.toLocaleString('ru-RU')} ₽ на человека</Txt></View><Pressable accessibilityRole="button" accessibilityLabel="Фильтры поиска" onPress={() => setFilters(!filters)} style={{ padding: 12 }}><Icon name="sliders" /></Pressable></View>
    <View style={shared.row}><Chip label="Найти соседа" selected={mode === 'people'} onPress={() => setMode('people')} /><Chip label="Найти комнату" selected={mode === 'rooms'} onPress={() => setMode('rooms')} /></View>
    {filters && <View style={shared.card}><Txt style={shared.sectionTitle}>Условия поиска</Txt><View style={shared.tags}>{['Москва', 'Санкт-Петербург', ''].map(c => <Chip key={c} label={c || 'Все города'} selected={city === c} onPress={() => setCity(c)} />)}</View><View style={shared.field}><Txt style={shared.label}>Максимум на человека, ₽ / мес.</Txt><TextInput accessibilityLabel="Максимальный бюджет" value={draftBudget} onChangeText={setDraftBudget} keyboardType="number-pad" style={shared.input} maxLength={6} /></View>{!!error && <Txt style={{ color: '#a13d31', fontSize: 13 }}>{error}</Txt>}<Button label="Применить бюджет" kind="outline" onPress={() => { const next = Number(draftBudget); if (!Number.isFinite(next) || next < 1000 || next > 500000) { setError('Укажите сумму от 1 000 до 500 000 ₽.'); return; } setBudget(next); setError(''); setFilters(false); }} /></View>}
    <View style={shared.between}><Txt tone="label">Осталось: {remaining.length} · учебные анкеты</Txt><Pressable accessibilityRole="button" accessibilityState={{ selected: savedOnly }} accessibilityLabel="Только сохранённые" onPress={() => { setSavedOnly(!savedOnly); setDismissed([]); }} style={{ paddingVertical: 8 }}><Txt style={{ fontSize: 12, color: savedOnly ? palette.green : palette.muted }}>{savedOnly ? 'Все анкеты' : 'Сохранённые'}</Txt></Pressable></View>
    {current && <SwipeCard key={current.id} group={current} onDecision={decide} onOpen={() => navigation.group(current.id)} />}
    {current && <Txt tone="label" style={{ textAlign: 'center', fontSize: 11 }}>Влево — пропустить · вправо — в соседи</Txt>}
    {feedback && <View style={{ gap: 8 }}><Notice>{feedback.text}</Notice><Button label="Посмотреть отправленный интерес" kind="outline" onPress={() => navigation.group(feedback.groupId)} /></View>}
    {!current && <Empty title={visible.length ? 'Вы просмотрели все анкеты' : 'Новых вариантов пока нет'} text="Отправленный интерес доступен во вкладке «Группы». Можно вернуться к пропущенным анкетам или изменить условия поиска."><View style={{ gap: 10 }}>{visible.length > 0 && <Button label="Вернуть пропущенные анкеты" kind="outline" onPress={() => setDismissed([])} />}<Button label="Расширить поиск" kind="outline" onPress={() => { setCity(''); setBudget(500000); setDraftBudget('500000'); setSavedOnly(false); setDismissed([]); }} /></View></Empty>}
  </ScrollView>;
}
