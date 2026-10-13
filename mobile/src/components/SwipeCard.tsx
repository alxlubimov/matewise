import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Image, PanResponder, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import type { Group } from '../domain/model';
import { decideSwipe, type SwipeDecision } from '../domain/swipe';
import { useApp, useCatalog } from '../state/AppProvider';
import { Avatar, Chip, Icon, Txt, palette, shared } from './ui';
import { money } from './GroupCard';
export function SwipeCard({ group, onDecision, onOpen }: { group: Group; onDecision: (decision: SwipeDecision) => void; onOpen: () => void }) {
  const { state, dispatch } = useApp(); const { person } = useCatalog();
  const [pan] = useState(() => new Animated.ValueXY()); const [busy, setBusy] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const width = Math.min(useWindowDimensions().width, 540) - 44;
  const members = group.memberIds.map(person);
  const saved = state.favorites.includes(group.id);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReducedMotion(value); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => { mounted = false; subscription.remove(); pan.stopAnimation(); };
  }, [pan]);
  const decide = useCallback((decision: SwipeDecision) => {
    if (busy) return;
    setBusy(true);
    if (reducedMotion) { onDecision(decision); return; }
    Animated.timing(pan, { toValue: { x: (decision === 'interest' ? 1 : -1) * (width + 160), y: 25 }, duration: 230, useNativeDriver: Platform.OS !== 'web' }).start(({ finished }) => { if (finished) onDecision(decision); });
  }, [busy, reducedMotion, onDecision, pan, width]);
  const restore = useCallback(() => {
    if (reducedMotion) { pan.setValue({ x: 0, y: 0 }); return; }
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, speed: 22, bounciness: 4, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [pan, reducedMotion]);
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !busy,
    onMoveShouldSetPanResponderCapture: (_, gesture) => !busy && Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
    onPanResponderTerminationRequest: (_, gesture) => Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => { if (!busy) pan.setValue({ x: gesture.dx, y: gesture.dy * .18 }); },
    onPanResponderRelease: (_, gesture) => { const decision = decideSwipe(gesture.dx, gesture.dy, gesture.vx, width); if (decision) decide(decision); else restore(); },
    onPanResponderTerminate: restore,
  }), [busy, pan, width, decide, restore]);
  const rotation = pan.x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-10deg', '0deg', '10deg'], extrapolate: 'clamp' });
  const positive = pan.x.interpolate({ inputRange: [0, width * .28], outputRange: [0, 1], extrapolate: 'clamp' });
  const negative = pan.x.interpolate({ inputRange: [-width * .28, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  return <View style={s.deck}>
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={s.backCard} />
    <Animated.View {...responder.panHandlers} style={[s.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: rotation }] }]} testID="swipe-card">
      <View style={s.visual}>
        {group.room ? <View pointerEvents="none" style={StyleSheet.absoluteFill}><Image source={require('../../assets/bedroom.png')} style={s.roomImage} /></View> : <View pointerEvents="none" style={s.peopleVisual}><View style={s.avatars}>{members.map(member => <Avatar key={member.id} name={member.name} size={members.length > 1 ? 68 : 88} />)}</View>{members.length > 1 && <Txt style={s.visualNames}>{members.map(p => p.name).join(' + ')}</Txt>}<Txt tone="muted" style={{ fontSize: 13 }}>{members.length > 1 ? 'Собираем компанию' : members[0].occupation}</Txt></View>}
        <View style={s.modeLabel}><Txt style={{ fontSize: 11, lineHeight: 17, color: palette.green }}>{group.room ? 'Есть свободная комната' : 'Ищем жильё вместе'}</Txt></View>
        <Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Убрать из сохранённого' : 'Сохранить'}: ${group.title}`} onPress={() => dispatch({ type: 'favorite', groupId: group.id })} style={s.save}><Icon name="bookmark" color={saved ? palette.green : palette.muted} /></Pressable>
        <Animated.View pointerEvents="none" style={[s.stamp, { opacity: positive, left: 16, transform: [{ rotate: '-10deg' }] }]}><Txt style={s.stampText}>В СОСЕДИ</Txt></Animated.View>
        <Animated.View pointerEvents="none" style={[s.stamp, { opacity: negative, right: 16, borderColor: '#806354', transform: [{ rotate: '10deg' }] }]}><Txt style={[s.stampText, { color: '#806354' }]}>ПРОПУСТИТЬ</Txt></Animated.View>
      </View>
      <View style={s.body}><View style={shared.between}><Txt style={s.title}>{group.memberIds.length === 1 && !group.room ? `${members[0].name}, ${members[0].age}` : group.title}</Txt><Pressable accessibilityRole="button" accessibilityLabel={`Открыть: ${group.title}`} onPress={onOpen} style={s.open}><Icon name="arrow-up-right" size={20} /></Pressable></View><Txt tone="muted" style={{ fontSize: 13 }}>{group.city} · {group.room ? group.room.district : `${members.length} ${members.length === 1 ? 'человек' : 'человека'} · ищем ещё ${group.vacancies}`}</Txt><Txt style={s.price}>{money(group.budgetPerPerson)} <Txt tone="muted" style={{ fontSize: 12 }}>на человека / мес.</Txt></Txt><View style={shared.tags}>{group.habits.slice(0, 3).map(habit => <Chip key={habit} label={habit} />)}</View><Pressable accessibilityRole="button" accessibilityLabel={`Подробнее: ${group.title}`} onPress={onOpen} style={{ paddingVertical: 5 }}><Txt style={{ color: palette.green, fontSize: 13 }}>Анкеты участников и условия</Txt></Pressable></View>
    </Animated.View>
    <View style={s.actions}><View style={s.actionItem}><Pressable accessibilityRole="button" accessibilityLabel="Пропустить анкету" disabled={busy} onPress={() => decide('skip')} style={[s.action, s.skip, busy && s.disabled]}><Icon name="x" size={27} color={palette.muted} /></Pressable><Txt tone="label">Пропустить</Txt></View><View style={s.actionItem}><Pressable accessibilityRole="button" accessibilityLabel="В соседи: выразить интерес" disabled={busy} onPress={() => decide('interest')} style={[s.action, s.interest, busy && s.disabled]}><Icon name="home" size={26} color={palette.green} /></Pressable><Txt tone="label">В соседи</Txt></View></View>
  </View>;
}
const s = StyleSheet.create({
  deck: { position: 'relative', paddingTop: 4 }, backCard: { position: 'absolute', left: 8, right: 8, top: 12, height: 310, backgroundColor: '#edf2eb', borderWidth: 1, borderColor: palette.line, borderRadius: 22, transform: [{ rotate: '2deg' }] },
  card: { borderRadius: 20, backgroundColor: palette.white, overflow: 'hidden', borderWidth: 1, borderColor: palette.line }, visual: { height: 155, backgroundColor: '#eaf1e9', position: 'relative' }, roomImage: { width: '100%', height: '100%' }, peopleVisual: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 30, gap: 5 }, avatars: { flexDirection: 'row', gap: 16 }, visualNames: { fontFamily: 'GolosMedium', fontSize: 17, lineHeight: 23 }, modeLabel: { position: 'absolute', top: 13, left: 13, borderRadius: 7, backgroundColor: '#ffffffed', paddingHorizontal: 10, paddingVertical: 6 }, save: { position: 'absolute', top: 7, right: 7, padding: 12, backgroundColor: '#ffffffed', borderRadius: 30 },
  body: { padding: 14, gap: 5 }, title: { fontFamily: 'GolosSemiBold', fontSize: 21, lineHeight: 27, flex: 1 }, open: { padding: 7, minHeight: 36, minWidth: 36 }, price: { fontFamily: 'GolosMedium', fontSize: 18, marginVertical: 3 }, stamp: { position: 'absolute', top: 80, borderWidth: 2, borderColor: palette.green, backgroundColor: '#ffffffef', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 7 }, stampText: { fontFamily: 'GolosSemiBold', fontSize: 19, color: palette.green },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 48, paddingTop: 15 }, actionItem: { alignItems: 'center', gap: 7 }, action: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }, skip: { backgroundColor: palette.soft, borderWidth: 1, borderColor: palette.line }, interest: { backgroundColor: palette.mint }, disabled: { opacity: .5 },
});
