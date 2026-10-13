import type { Group, JoinRequest } from './model';
export function canChat(group: Group, request?: JoinRequest): boolean {
  return !!request && (request.joined || group.memberIds.every(id => request.approvedBy.includes(id)));
}
export function approvalsLeft(group: Group, request?: JoinRequest): number {
  return request?.joined ? 0 : group.memberIds.filter(id => !request?.approvedBy.includes(id)).length;
}
export function approve(group: Group, request: JoinRequest, memberId: string): JoinRequest {
  if (!group.memberIds.includes(memberId) || request.joined) return request;
  return { ...request, approvedBy: request.approvedBy.includes(memberId) ? request.approvedBy.filter(id => id !== memberId) : [...request.approvedBy, memberId] };
}
export function confirmJoin(group: Group, request: JoinRequest): JoinRequest {
  if (!canChat(group, request) || group.vacancies < 1 || group.memberIds.includes(request.candidateId)) return request;
  return request.joined ? request : { ...request, joined: true };
}
export function groupMembers(group: Group, request?: JoinRequest): string[] {
  return request?.joined ? [...new Set([...group.memberIds, request.candidateId])] : group.memberIds;
}
export function freePlaces(group: Group, request?: JoinRequest): number {
  return Math.max(0, group.vacancies - (request?.joined ? 1 : 0));
}
export function matches(group: Group, mode: 'people' | 'rooms', city: string, budget: number): boolean {
  return Boolean(group.room) === (mode === 'rooms') && (!city || group.city === city) && group.budgetPerPerson <= budget;
}
