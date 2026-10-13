import type { AppState, Group, Message, Person } from '../domain/model';
import { approve, canChat, confirmJoin } from '../domain/groups.ts';
export type Action =
  | { type: 'profile'; profile: Person }
  | { type: 'favorite'; groupId: string }
  | { type: 'request'; group: Group; at: string }
  | { type: 'approve'; group: Group; memberId: string }
  | { type: 'join'; group: Group }
  | { type: 'withdraw'; groupId: string }
  | { type: 'message'; group: Group; message: Message }
  | { type: 'create-group'; group: Group };
export function reducer(state: AppState, action: Action): AppState {
  if (action.type === 'profile') return { ...state, profile: { ...action.profile, id: state.profile.id } };
  if (action.type === 'favorite') return { ...state, favorites: state.favorites.includes(action.groupId) ? state.favorites.filter(id => id !== action.groupId) : [...state.favorites, action.groupId] };
  if (action.type === 'create-group') return { ...state, customGroup: action.group };
  if (action.type === 'withdraw') {
    if (state.requests[action.groupId]?.joined) return state;
    const requests = { ...state.requests }; const messages = { ...state.messages };
    delete requests[action.groupId]; delete messages[action.groupId];
    return { ...state, requests, messages };
  }
  const group = action.group;
  const request = state.requests[group.id];
  if (action.type === 'request') {
    if (request || group.vacancies < 1 || group.memberIds.includes(state.profile.id)) return state;
    return { ...state, requests: { ...state.requests, [group.id]: { candidateId: state.profile.id, approvedBy: [], joined: false, createdAt: action.at } } };
  }
  if (!request) return state;
  if (action.type === 'approve') return { ...state, requests: { ...state.requests, [group.id]: approve(group, request, action.memberId) } };
  if (action.type === 'join') return { ...state, requests: { ...state.requests, [group.id]: confirmJoin(group, request) } };
  if (action.type === 'message') {
    if (!canChat(group, request) || action.message.senderId !== state.profile.id) return state;
    const text = action.message.text.trim();
    if (!text || text.length > 2000) return state;
    return { ...state, messages: { ...state.messages, [group.id]: [...(state.messages[group.id] || []), { ...action.message, text }] } };
  }
  return state;
}
