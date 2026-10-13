import type { AppState } from '../domain/model';
function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
function text(value: unknown): value is string { return typeof value === 'string'; }
function list(value: unknown): value is string[] { return Array.isArray(value) && value.every(text); }
function date(value: unknown): boolean { return text(value) && Number.isFinite(Date.parse(value)); }
function amount(value: unknown): boolean { return Number.isInteger(value) && Number(value) >= 1000 && Number(value) <= 500000; }
function city(value: unknown): boolean { return value === 'Москва' || value === 'Санкт-Петербург'; }
export function parseDemoState(value: string): AppState {
  const state: unknown = JSON.parse(value);
  if (!record(state) || state.version !== 1 || !record(state.profile)) throw new Error('Unknown demo state');
  const profile = state.profile;
  if (profile.id !== 'you' || !text(profile.name) || profile.name.trim().length < 2 || !Number.isInteger(profile.age) || Number(profile.age) < 18 || Number(profile.age) > 100 || !city(profile.city) || !amount(profile.budget) || !text(profile.occupation) || !text(profile.bio) || !list(profile.habits)) throw new Error('Invalid demo profile');
  if (!list(state.favorites) || !record(state.requests) || !record(state.messages)) throw new Error('Invalid saved collections');
  for (const request of Object.values(state.requests)) {
    if (!record(request) || request.candidateId !== 'you' || !list(request.approvedBy) || typeof request.joined !== 'boolean' || !date(request.createdAt)) throw new Error('Invalid saved consent');
  }
  for (const thread of Object.values(state.messages)) {
    if (!Array.isArray(thread) || !thread.every(message => record(message) && text(message.id) && text(message.senderId) && text(message.text) && message.text.trim().length > 0 && message.text.length <= 2000 && date(message.createdAt))) throw new Error('Invalid saved messages');
  }
  if (state.customGroup !== null) {
    const group = state.customGroup;
    if (!record(group) || group.id !== 'my-group' || !text(group.title) || !city(group.city) || !list(group.memberIds) || group.memberIds.length < 1 || !group.memberIds.includes('you') || !group.memberIds.every(id => ['you', 'anna', 'mark'].includes(id)) || !Number.isInteger(group.vacancies) || Number(group.vacancies) < 1 || !amount(group.budgetPerPerson) || !list(group.habits) || !text(group.description)) throw new Error('Invalid saved group');
    if (group.room !== undefined) {
      const room = group.room;
      if (!record(room) || !text(room.title) || !text(room.district) || !amount(room.price) || !text(room.utilities) || typeof room.area !== 'number' || !text(room.available) || !text(room.description)) throw new Error('Invalid saved room');
    }
  }
  return state as unknown as AppState;
}
