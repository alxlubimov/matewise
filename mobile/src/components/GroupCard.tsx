import React from 'react';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import type { Group } from '../domain/model';
import { Avatar, Chip, Icon, Txt, palette, shared } from './ui';
import { useApp, useCatalog } from '../state/AppProvider';
import { freePlaces } from '../domain/groups';
export const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;
export function GroupCard({ group, onOpen }: { group: Group; onOpen: () => void }) {
  const { state, dispatch } = useApp(); const { person } = useCatalog();
  const saved = state.favorites.includes(group.id);
  return <View style={s.card}>
    <View style={s.header}><View style={[shared.row, { flex: 1 }]}><Avatar name={person(group.memberIds[0]).name} /><View style={{ flex: 1 }}><Txt style={s.name}>{group.memberIds.map(id => person(id).name).join(' и ')}</Txt><Txt tone="label">{group.city} · {group.room ? 'Есть жильё' : 'Ищем жильё вместе'}</Txt></View></View><Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Убрать из сохранённого' : 'Сохранить'}: ${group.title}`} onPress={() => dispatch({ type: 'favorite', groupId: group.id })} style={s.save}><Icon name="bookmark" color={saved ? palette.green : palette.muted} /></Pressable></View>
    <Pressable accessibilityRole="button" accessibilityLabel={`Открыть: ${group.title}`} onPress={onOpen}>
      {group.room && <Image source={require('../../assets/bedroom.png')} style={s.image} accessibilityLabel="Учебная фотография комнаты" />}
      <View style={s.body}><Txt style={s.title}>{group.title}</Txt><Txt tone="muted" style={{ fontSize: 13 }}>{group.room ? group.room.district : `${group.memberIds.length} ${group.memberIds.length === 1 ? 'человек' : 'человека'} · ищем ещё ${freePlaces(group, state.requests[group.id])}`}</Txt><Txt style={s.price}>{money(group.budgetPerPerson)} <Txt tone="muted" style={{ fontSize: 12 }}>на человека / мес.</Txt></Txt><View style={shared.tags}>{group.habits.slice(0, 3).map(h => <Chip key={h} label={h} />)}</View><View style={[shared.between, { marginTop: 5 }]}><Txt style={{ color: palette.green, fontSize: 13 }}>{state.requests[group.id]?.joined ? 'Вы в группе' : 'Посмотреть анкету'}</Txt><Icon name="arrow-up-right" size={17} color={palette.green} /></View></View>
    </Pressable>
  </View>;
}
const s = StyleSheet.create({ card: { borderWidth: 1, borderColor: palette.line, borderRadius: 16, overflow: 'hidden', backgroundColor: palette.white }, header: { padding: 16, flexDirection: 'row', gap: 10, alignItems: 'center' }, name: { fontFamily: 'GolosMedium', fontSize: 14, lineHeight: 20 }, save: { padding: 12, minWidth: 44, minHeight: 44 }, body: { padding: 17, paddingTop: 12, gap: 10 }, title: { fontFamily: 'GolosSemiBold', fontSize: 22, lineHeight: 28 }, price: { fontFamily: 'GolosMedium', fontSize: 18, lineHeight: 25 }, image: { height: 200, width: '100%' } });
