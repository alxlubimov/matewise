export type City = 'Москва' | 'Санкт-Петербург';
export type Person = {
  id: string; name: string; age: number; city: City; occupation: string;
  budget: number; bio: string; habits: string[];
};
export type Room = {
  title: string; district: string; price: number; utilities: string;
  area: number; available: string; description: string;
};
export type Group = {
  id: string; title: string; city: City; memberIds: string[];
  vacancies: number; budgetPerPerson: number; habits: string[];
  description: string; room?: Room;
};
export type JoinRequest = {
  candidateId: string; approvedBy: string[]; joined: boolean; createdAt: string;
};
export type Message = { id: string; senderId: string; text: string; createdAt: string };
export type AppState = {
  version: 1; profile: Person; favorites: string[];
  requests: Record<string, JoinRequest>; messages: Record<string, Message[]>;
  customGroup: Group | null;
};
