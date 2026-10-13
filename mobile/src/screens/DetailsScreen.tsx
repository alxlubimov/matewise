import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useApp, useCatalog } from '../state/AppProvider';
import { Avatar, Button, Chip, Empty, Icon, Notice, Txt, shared } from '../components/ui';
import { money } from '../components/GroupCard';
import { approvalsLeft, canChat, freePlaces, groupMembers } from '../domain/groups';
import type { Navigation } from '../navigation';
export function PersonScreen({ id }: { id: string }) {
  const { person } = useCatalog(); const p = person(id);
  if (!p) return <Empty title="Анкета недоступна" text="Вернитесь к поиску." />;
  return <ScrollView contentContainerStyle={shared.content}><View style={[shared.row, { gap: 17 }]}><Avatar name={p.name} size={76} /><View><Txt tone="title">{p.name}, {p.age}</Txt><Txt tone="muted">{p.occupation}</Txt></View></View><View style={shared.divider} /><Txt tone="muted">{p.city}</Txt><Txt style={shared.sectionTitle}>До {money(p.budget)} / мес.</Txt><Txt tone="label">Личный бюджет на аренду</Txt><Txt>{p.bio}</Txt><View style={shared.tags}>{p.habits.map(h => <Chip label={h} key={h} />)}</View><Notice>Это учебная анкета. Инициалы используются как аватар; все сведения вымышленные.</Notice></ScrollView>;
}
export function RoomScreen({ id }: { id: string }) {
  const { groups } = useCatalog(); const group = groups.find(g => g.id === id);
  if (!group?.room) return <Empty title="Жильё недоступно" text="В этой анкете квартира ещё не выбрана." />;
  const room = group.room;
  return <ScrollView contentContainerStyle={shared.content}><Image source={require('../../assets/bedroom.png')} style={{ width: '100%', height: 290, borderRadius: 14 }} /><Txt tone="title">{room.title}</Txt><Txt tone="muted">{group.city} · {room.district}</Txt><Txt style={shared.sectionTitle}>{money(room.price)} / мес.</Txt><Txt tone="muted">{room.utilities}</Txt><View style={shared.tags}><Chip label={`${room.area} м² · отдельная комната`} /><Chip label={room.available} /></View><Txt>{room.description}</Txt><Txt style={shared.sectionTitle}>Общие зоны</Txt><Image source={require('../../assets/shared-home.png')} style={{ width: '100%', height: 220, borderRadius: 14 }} /><Notice>Фотографии иллюстративные. Количество спален и количество жильцов — разные условия.</Notice></ScrollView>;
}
export function GroupScreen({ id, navigation }: { id: string; navigation: Navigation }) {
  const { state, dispatch } = useApp(); const { groups, person } = useCatalog();
  const group = groups.find(g => g.id === id);
  if (!group) return <Empty title="Группа недоступна" text="Вернитесь к поиску." />;
  const request = state.requests[id]; const members = groupMembers(group, request);
  const own = group.memberIds.includes(state.profile.id);
  return <ScrollView contentContainerStyle={shared.content}>
    <View style={shared.tags}><Chip label={group.room ? 'Жильё уже есть' : 'Ищем жильё вместе'} /><Chip label={`${freePlaces(group, request)} свободных мест`} /></View>
    <Txt tone="title">{group.title}</Txt><Txt tone="muted">{group.city} · {members.length} {members.length === 1 ? 'человек' : 'человека'} сейчас</Txt><Txt>{group.description}</Txt><View style={shared.card}><Txt tone="label">Личная доля аренды</Txt><Txt style={shared.sectionTitle}>{money(group.budgetPerPerson)} / мес.</Txt><Txt tone="muted" style={{ fontSize: 13 }}>{group.room ? group.room.utilities : `План для ${members.length + freePlaces(group, request)} человек: общий бюджет до ${money(group.budgetPerPerson * (members.length + freePlaces(group, request)))}`}</Txt></View>
    {group.room && <Button label="Посмотреть жильё" icon="home" kind="outline" onPress={() => navigation.room(id)} />}
    <Txt style={shared.sectionTitle}>Будущие соседи</Txt>
    {members.map(memberId => { const p = person(memberId); return <Pressable key={memberId} accessibilityRole="button" accessibilityLabel={`Анкета: ${p.name}`} onPress={() => navigation.person(memberId)} style={[shared.between, { paddingVertical: 9 }]}><View style={shared.row}><Avatar name={p.name} /><View><Txt style={{ fontFamily: 'GolosMedium' }}>{p.name}, {p.age}{memberId === state.profile.id ? ' · вы' : ''}</Txt><Txt tone="label">{p.occupation}</Txt></View></View><Icon name="chevron-right" size={18} /></Pressable>; })}
    <View style={shared.tags}>{group.habits.map(h => <Chip label={h} key={h} />)}</View>
    {own ? <Notice>Это ваша учебная группа. Вы можете показать свой профиль будущим соседям.</Notice> : !request ? <><Notice>«В соседи» выражает ваш интерес. Чат откроется после согласия всех текущих участников. Заселение обсуждается отдельно.</Notice><Button label="В соседи" icon="home" disabled={!freePlaces(group, request)} onPress={() => dispatch({ type: 'request', group, at: new Date().toISOString() })} /></> : <>
      <View style={shared.card}><Txt style={shared.sectionTitle}>{request.joined ? 'Вы присоединились' : canChat(group, request) ? 'Интерес взаимный' : 'Ожидаем согласия группы'}</Txt><Txt tone="muted">{request.joined ? 'Вы в составе группы. Аренда и переезд ещё требуют договорённостей.' : `Подтвердили: ${group.memberIds.length - approvalsLeft(group, request)} из ${group.memberIds.length}. Ваш интерес уже учтён.`}</Txt></View>
      {!request.joined && <View style={shared.card}><Txt style={{ fontFamily: 'GolosMedium', fontSize: 14 }}>Учебное управление согласиями</Txt><Txt tone="muted" style={{ fontSize: 12 }}>Для проверки прототипа можно ответить от имени каждого соседа. В настоящем приложении каждый отвечает только за себя.</Txt>{group.memberIds.map(memberId => <Button key={memberId} kind="outline" label={`${request.approvedBy.includes(memberId) ? 'Отменить согласие' : 'Подтвердить'}: ${person(memberId).name}`} onPress={() => dispatch({ type: 'approve', group, memberId })} />)}</View>}
      <Button label="Открыть чат" icon="message-circle" disabled={!canChat(group, request)} onPress={() => navigation.chat(id)} />
      {canChat(group, request) && !request.joined && <Button label="Присоединиться к группе" kind="outline" onPress={() => dispatch({ type: 'join', group })} />}
      {!request.joined && <Button label="Отозвать интерес" kind="quiet" onPress={() => dispatch({ type: 'withdraw', groupId: id })} />}
    </>}
  </ScrollView>;
}
