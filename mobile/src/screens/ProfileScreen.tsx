import React, { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Avatar, Button, Chip, Notice, Txt, shared } from '../components/ui';
import { useApp } from '../state/AppProvider';
import type { City } from '../domain/model';
const habitOptions = ['Без курения', 'Порядок', 'Тихие вечера', 'Жаворонок', 'Сова', 'Без питомцев'];
export function ProfileScreen() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.profile.name); const [age, setAge] = useState(String(state.profile.age));
  const [occupation, setOccupation] = useState(state.profile.occupation); const [bio, setBio] = useState(state.profile.bio);
  const [city, setCity] = useState<City>(state.profile.city); const [budget, setBudget] = useState(String(state.profile.budget));
  const [habits, setHabits] = useState(state.profile.habits); const [error, setError] = useState(''); const [saved, setSaved] = useState(false);
  const save = () => {
    if (name.trim().length < 2) { setError('Введите имя из двух или более символов.'); return; }
    if (!Number.isInteger(Number(age)) || Number(age) < 18 || Number(age) > 100) { setError('Прототип рассчитан на совершеннолетних: возраст от 18 до 100 лет.'); return; }
    if (!Number.isInteger(Number(budget)) || Number(budget) < 1000 || Number(budget) > 500000) { setError('Укажите бюджет от 1 000 до 500 000 ₽.'); return; }
    dispatch({ type: 'profile', profile: { ...state.profile, name: name.trim(), age: Number(age), occupation: occupation.trim(), bio: bio.trim(), city, budget: Number(budget), habits } }); setError(''); setSaved(true);
  };
  return <ScrollView contentContainerStyle={shared.content} keyboardShouldPersistTaps="handled"><View style={shared.row}><Avatar name={name || 'Вы'} size={64} /><View><Txt tone="title">Моя анкета</Txt><Txt tone="label">Учебный профиль · 18+</Txt></View></View><Notice>Регистрация пока не подключена. Эта анкета хранится локально и не публикуется другим людям.</Notice>
    <View style={shared.field}><Txt style={shared.label}>Имя</Txt><TextInput accessibilityLabel="Имя" style={shared.input} value={name} onChangeText={v => { setName(v); setSaved(false); }} maxLength={40} /></View>
    <View style={shared.field}><Txt style={shared.label}>Возраст</Txt><TextInput accessibilityLabel="Возраст" style={shared.input} value={age} onChangeText={value => { setAge(value); setSaved(false); }} keyboardType="number-pad" maxLength={3} /></View>
    <Txt style={shared.label}>Город</Txt><View style={shared.tags}>{(['Москва', 'Санкт-Петербург'] as City[]).map(c => <Chip key={c} label={c} selected={city === c} onPress={() => { setCity(c); setSaved(false); }} />)}</View>
    <View style={shared.field}><Txt style={shared.label}>Профессия или занятие</Txt><TextInput accessibilityLabel="Профессия" style={shared.input} value={occupation} onChangeText={value => { setOccupation(value); setSaved(false); }} maxLength={70} /></View>
    <View style={shared.field}><Txt style={shared.label}>Личный бюджет на аренду, ₽ / мес.</Txt><TextInput accessibilityLabel="Мой бюджет" style={shared.input} value={budget} onChangeText={value => { setBudget(value); setSaved(false); }} keyboardType="number-pad" maxLength={6} /></View>
    <View style={shared.field}><Txt style={shared.label}>О себе</Txt><TextInput accessibilityLabel="О себе" style={[shared.input, { minHeight: 110, textAlignVertical: 'top' }]} value={bio} onChangeText={value => { setBio(value); setSaved(false); }} multiline maxLength={500} /></View>
    <Txt style={shared.label}>Мои привычки</Txt><View style={shared.tags}>{habitOptions.map(h => <Chip key={h} label={h} selected={habits.includes(h)} onPress={() => { setHabits(current => current.includes(h) ? current.filter(x => x !== h) : [...current, h]); setSaved(false); }} />)}</View>
    {!!error && <Notice warning>{error}</Notice>}{saved && <Notice>Анкета сохранена на устройстве.</Notice>}<Button label="Сохранить анкету" icon="check" onPress={save} />
  </ScrollView>;
}
