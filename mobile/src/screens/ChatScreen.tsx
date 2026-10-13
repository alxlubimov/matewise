import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useApp, useCatalog } from '../state/AppProvider';
import { canChat } from '../domain/groups';
import { Avatar, Button, Chip, Empty, Notice, Txt, palette, shared } from '../components/ui';
import type { Navigation } from '../navigation';
export function ChatListScreen({ navigation }: { navigation: Navigation }) {
  const { state } = useApp(); const { groups } = useCatalog();
  const available = groups.filter(group => canChat(group, state.requests[group.id]));
  const pending = groups.filter(group => state.requests[group.id] && !canChat(group, state.requests[group.id]));
  return <ScrollView contentContainerStyle={shared.content}><Txt tone="title">Чаты</Txt><Notice>Сообщения сохраняются только в этом демо. Реальным людям они не отправляются.</Notice>
    {available.map(group => <View key={group.id} style={shared.card}><View style={shared.row}><Avatar name={group.title} /><View style={{ flex: 1 }}><Txt style={{ fontFamily: 'GolosMedium', fontSize: 17 }}>{group.title}</Txt><Txt tone="label">{group.memberIds.length > 1 ? 'Групповой чат' : 'Личный чат'} · {state.messages[group.id]?.length || 0} сообщений</Txt></View></View><Button label={`Перейти в чат: ${group.title}`} kind="outline" onPress={() => navigation.chat(group.id)} /></View>)}
    {!available.length && <Empty title="Сначала взаимный интерес" text="Выберите анкету, нажмите «В соседи» и подтвердите согласия в учебном сценарии группы." />}
    {pending.length > 0 && <><Txt style={shared.sectionTitle}>Ожидаем подтверждения</Txt>{pending.map(group => <Button key={group.id} label={group.title} kind="outline" onPress={() => navigation.group(group.id)} />)}</>}
  </ScrollView>;
}
export function ChatScreen({ id }: { id: string }) {
  const { state, dispatch } = useApp(); const { groups, person } = useCatalog(); const group = groups.find(g => g.id === id);
  const [draft, setDraft] = useState(''); const scroll = useRef<ScrollView>(null);
  const messages = state.messages[id] || [];
  const send = useCallback(() => {
    if (!group || !draft.trim()) return;
    dispatch({ type: 'message', group, message: { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, senderId: state.profile.id, text: draft, createdAt: new Date().toISOString() } });
    setDraft('');
  }, [dispatch, draft, group, state.profile.id]);
  if (!group || !canChat(group, state.requests[id])) return <Empty title="Чат пока закрыт" text="Для общения нужно согласие всех участников. Вернитесь к анкете группы." />;
  return <KeyboardAvoidingView style={shared.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={120}>
    <View style={{ paddingHorizontal: 22, paddingBottom: 14, gap: 10 }}><Txt style={shared.sectionTitle}>{group.memberIds.map(member => person(member).name).join(' и ')}</Txt><Txt tone="label">{group.memberIds.length > 1 ? 'Групповой разговор' : 'Личный разговор'} · ваш интерес подтверждён</Txt><Notice>Учебный чат: сообщения остаются на вашем устройстве.</Notice></View>
    <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 22, gap: 14, flexGrow: 1 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled">
      {!messages.length && <View style={{ paddingVertical: 28, gap: 12 }}><Txt tone="title" style={{ fontSize: 24 }}>Начните с условий</Txt><Txt tone="muted">Обсудите личную долю аренды, районы, сроки и бытовые правила.</Txt></View>}
      {messages.map(message => <View key={message.id} style={{ alignSelf: message.senderId === state.profile.id ? 'flex-end' : 'flex-start', maxWidth: '90%', padding: 14, borderRadius: 14, backgroundColor: message.senderId === state.profile.id ? '#e4efe7' : palette.soft }}><Txt tone="label">{person(message.senderId)?.name || 'Участник'}</Txt><Txt selectable style={{ marginTop: 4 }}>{message.text}</Txt><Txt tone="label" style={{ fontSize: 10, marginTop: 8 }}>{new Date(message.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} · сохранено в демо</Txt></View>)}
    </ScrollView>
    <View style={{ paddingHorizontal: 16, paddingBottom: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.line, gap: 10 }}>
      <View style={shared.tags}><Chip label="Бюджет" onPress={() => setDraft('Привет! Какую сумму на аренду и коммунальные ты планируешь?')} /><Chip label="Район" onPress={() => setDraft('Какие районы тебе подходят и когда хочется переехать?')} /><Chip label="Правила дома" onPress={() => setDraft('Давай обсудим уборку, гостей и время для тишины.')} /></View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 9 }}><TextInput accessibilityLabel="Сообщение" placeholder="Написать сообщение…" placeholderTextColor={palette.muted} value={draft} onChangeText={setDraft} maxLength={2000} multiline style={[shared.input, { flex: 1, maxHeight: 120, paddingTop: 13 }]} /><Button label="Отправить" icon="arrow-up" disabled={!draft.trim()} onPress={send} /></View>
    </View>
  </KeyboardAvoidingView>;
}
