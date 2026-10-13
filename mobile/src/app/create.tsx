import { useRouter } from 'expo-router';
import { ScreenFrame } from '../components/ScreenFrame';
import { CreateGroupScreen } from '../screens/GroupsScreen';
export default function CreateRoute() { const router = useRouter(); return <ScreenFrame title="Моя группа"><CreateGroupScreen done={id => router.replace({ pathname: '/group/[id]', params: { id } })} /></ScreenFrame>; }
