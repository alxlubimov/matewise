import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groups, initialState } from '../src/data/demo.ts';
import { canChat, freePlaces, groupMembers, matches } from '../src/domain/groups.ts';
import { reducer } from '../src/state/reducer.ts';
import { parseDemoState } from '../src/state/persistence.ts';
const group = groups.find(g => g.id === 'team-search');
const request = state => reducer(state, { type: 'request', group, at: '2026-10-14T10:00:00Z' });
const approval = (state, id) => reducer(state, { type: 'approve', group, memberId: id });
test('a group chat stays locked until both residents agree', () => {
  let state = request(initialState());
  assert.equal(canChat(group, state.requests[group.id]), false);
  state = approval(state, 'mark');
  assert.equal(canChat(group, state.requests[group.id]), false);
  state = approval(state, 'elena');
  assert.equal(canChat(group, state.requests[group.id]), true);
  state = approval(state, 'mark');
  assert.equal(canChat(group, state.requests[group.id]), false);
});
test('outsiders cannot confirm a resident consent', () => {
  const state = approval(request(initialState()), 'you');
  assert.deepEqual(state.requests[group.id].approvedBy, []);
});
test('interest does not automatically join or consume a vacancy', () => {
  let state = request(initialState());
  state = reducer(state, { type: 'join', group });
  assert.equal(state.requests[group.id].joined, false);
  assert.equal(freePlaces(group, state.requests[group.id]), 1);
  state = approval(approval(state, 'mark'), 'elena');
  assert.equal(state.requests[group.id].joined, false);
  state = reducer(state, { type: 'join', group });
  assert.equal(state.requests[group.id].joined, true);
  assert.equal(freePlaces(group, state.requests[group.id]), 0);
  assert.deepEqual(groupMembers(group, state.requests[group.id]), ['mark', 'elena', 'you']);
  state = reducer(state, { type: 'join', group });
  assert.equal(groupMembers(group, state.requests[group.id]).length, 3);
});
test('sending is blocked before mutual consent and rejects blank or impersonated messages', () => {
  let state = request(initialState());
  const message = { id: 'msg', senderId: 'you', text: 'Обсудим район?', createdAt: '2026-10-14T10:00:00Z' };
  state = reducer(state, { type: 'message', group, message });
  assert.equal(state.messages[group.id], undefined);
  state = approval(approval(state, 'mark'), 'elena');
  state = reducer(state, { type: 'message', group, message: { ...message, text: '  ' } });
  state = reducer(state, { type: 'message', group, message: { ...message, senderId: 'mark' } });
  assert.equal(state.messages[group.id], undefined);
  state = reducer(state, { type: 'message', group, message });
  assert.equal(state.messages[group.id][0].text, 'Обсудим район?');
});
test('withdrawal clears the pending conversation and a new request needs fresh consent', () => {
  let state = approval(approval(request(initialState()), 'mark'), 'elena');
  state = reducer(state, { type: 'message', group, message: { id: 'msg', senderId: 'you', text: 'Привет', createdAt: '2026-10-14T10:00:00Z' } });
  state = reducer(state, { type: 'withdraw', groupId: group.id });
  assert.equal(state.messages[group.id], undefined);
  assert.equal(state.requests[group.id], undefined);
  state = request(state);
  assert.equal(canChat(group, state.requests[group.id]), false);
});
test('repeating an interest request preserves earlier approvals', () => {
  const state = approval(request(initialState()), 'mark');
  assert.deepEqual(request(state).requests[group.id].approvedBy, ['mark']);
});
test('filters separate people and rooms and use personal payment', () => {
  assert.equal(matches(group, 'people', 'Москва', 30000), true);
  assert.equal(matches(group, 'people', 'Москва', 29999), false);
  assert.equal(matches(group, 'people', 'Санкт-Петербург', 50000), false);
  assert.equal(matches(group, 'rooms', '', 50000), false);
  const room = groups.find(g => g.room);
  assert.equal(matches(room, 'rooms', 'Москва', 32000), true);
});
test('saved profile, consent and messages round-trip without resetting', () => {
  let state = approval(approval(request(initialState()), 'mark'), 'elena');
  state = reducer(state, { type: 'message', group, message: { id: 'msg', senderId: 'you', text: 'Привет', createdAt: '2026-10-14T10:00:00Z' } });
  assert.deepEqual(parseDemoState(JSON.stringify(state)), state);
});
test('malformed saved consent is rejected before rendering the app', () => {
  const state = request(initialState());
  delete state.requests[group.id].approvedBy;
  assert.throws(() => parseDemoState(JSON.stringify(state)), /consent/);
  assert.throws(() => parseDemoState('{broken'));
});
