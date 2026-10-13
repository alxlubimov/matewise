import { useRouter } from 'expo-router';
export type Navigation = {
  group: (id: string) => void; person: (id: string) => void; room: (id: string) => void;
  chat: (id: string) => void; create: () => void;
};
export function useAppNavigation(): Navigation {
  const router = useRouter();
  return {
    group: id => router.push({ pathname: '/group/[id]', params: { id } }),
    person: id => router.push({ pathname: '/person/[id]', params: { id } }),
    room: id => router.push({ pathname: '/room/[id]', params: { id } }),
    chat: id => router.push({ pathname: '/chat/[id]', params: { id } }),
    create: () => router.push('/create'),
  };
}
