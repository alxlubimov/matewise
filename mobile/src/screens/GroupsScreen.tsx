import React, { useState } from 'react';
import { ScrollView, Switch, TextInput, View } from 'react-native';
import { Button, Chip, Empty, Notice, Txt, shared } from '../components/ui';
import { useApp, useCatalog } from '../state/AppProvider';
import { GroupCard } from '../components/GroupCard';
import type { Navigation } from '../navigation';
import { groups as demoGroups } from '../data/demo';
export function GroupsScreen({ navigation }: { navigation: Navigation }) {
  const { state } = useApp(); const { groups } = useCatalog();
  const mine = groups.filter(group => group.memberIds.includes(state.profile.id) || state.requests[group.id]);
  return <ScrollView contentContainerStyle={shared.content}><Txt tone="title">Мои группы</Txt><Txt tone="muted">Один профиль человека, общий поиск для всей компании.</Txt><Button label={state.customGroup ? 'Изменить свою группу' : 'Создать свою группу'} icon="users" onPress={navigation.create} />
    {mine.map(group => <View key={group.id} style={{ gap: 8 }}><Txt tone="label">{group.memberIds.includes(state.profile.id) ? 'Вы организатор' : state.requests[group.id]?.joined ? 'Вы в составе' : 'Ваш интерес отправлен'}</Txt><GroupCard group={group} onOpen={() => navigation.group(group.id)} /></View>)}
    {!mine.length && <Empty title="Найдите своих людей" text="Вы можете создать группу или выразить интерес к учебной анкете в поиске." />}
  </ScrollView>;
}
export function CreateGroupScreen({ done }: { done: (id: string) => void }) {
  const { state, dispatch } = useApp(); const existing = state.customGroup;
  const [size, setSize] = useState(existing?.memberIds.length || 1); const [vacancies, setVacancies] = useState(existing?.vacancies || 1);
  const [hasRoom, setHasRoom] = useState(!!existing?.room); const [budget, setBudget] = useState(String(existing?.budgetPerPerson || state.profile.budget));
  const [error, setError] = useState('');
  const title = size === 1 ? `Ищу ${vacancies === 1 ? 'одного соседа' : 'двух соседей'}` : size === 2 && vacancies === 1 ? 'Нас двое — ищем третьего' : `Нас ${size === 2 ? 'двое' : 'трое'} — ищем ещё ${vacancies === 1 ? 'одного' : 'двоих'}`;
  const save = () => {
    const amount = Number(budget);
    if (!Number.isInteger(amount) || amount < 1000 || amount > 500000) { setError('Укажите личную долю аренды от 1 000 до 500 000 ₽.'); return; }
    const sampleRoom = demoGroups.find(g => g.room)!.room!;
    const group = { id: 'my-group', title, city: state.profile.city, memberIds: [state.profile.id, 'anna', 'mark'].slice(0, size), vacancies, budgetPerPerson: amount, habits: state.profile.habits, description: hasRoom ? 'Предлагаем комнату. Фото жилья иллюстративные, условия в этом прототипе учебные.' : 'Собираем компанию для совместного поиска квартиры. Районы и сроки обсудим вместе.', ...(hasRoom ? { room: { ...sampleRoom, title: 'Наша свободная комната', price: amount } } : {}) };
    dispatch({ type: 'create-group', group }); done(group.id);
  };
  return <ScrollView contentContainerStyle={shared.content} keyboardShouldPersistTaps="handled"><Txt tone="title">Ваш сценарий</Txt><Notice>Это учебная группа. При выборе нескольких участников добавятся Анна и Марк из демо. В настоящем приложении участников нужно приглашать.</Notice>
    <Txt style={shared.label}>Нас сейчас</Txt><View style={shared.tags}>{[1, 2, 3].map(n => <Chip key={n} label={n === 1 ? 'Один' : n === 2 ? 'Двое' : 'Трое'} selected={size === n} onPress={() => setSize(n)} />)}</View>
    <Txt style={shared.label}>Ищем ещё</Txt><View style={shared.tags}>{[1, 2].map(n => <Chip key={n} label={n === 1 ? 'Одного соседа' : 'Двух соседей'} selected={vacancies === n} onPress={() => setVacancies(n)} />)}</View>
    <View style={shared.between}><View style={{ flex: 1 }}><Txt style={{ fontFamily: 'GolosMedium' }}>Жильё уже есть</Txt><Txt tone="label">{hasRoom ? 'Покажем пример свободной комнаты' : 'Квартиру будем выбирать вместе'}</Txt></View><Switch accessibilityLabel="Жильё уже есть" value={hasRoom} onValueChange={setHasRoom} trackColor={{ true: '#a7c8b4', false: '#dce2dd' }} /></View>
    <View style={shared.field}><Txt style={shared.label}>Личная доля аренды, ₽ / мес.</Txt><TextInput accessibilityLabel="Личная доля аренды" value={budget} onChangeText={setBudget} keyboardType="number-pad" style={shared.input} maxLength={6} /></View>
    <View style={shared.card}><Txt style={shared.sectionTitle}>{title}</Txt><Txt tone="muted">Всего планируем жить: {size + vacancies}. Количество спален согласуется отдельно.</Txt><Txt tone="label">Город: {state.profile.city}</Txt></View>
    {!!error && <Notice warning>{error}</Notice>}<Button label="Сохранить группу" icon="check" onPress={save} />
  </ScrollView>;
}
