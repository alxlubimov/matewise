import { useLocalSearchParams } from 'expo-router';
import { ScreenFrame } from '../../components/ScreenFrame';
import { ChatScreen } from '../../screens/ChatScreen';
export default function ChatRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <ScreenFrame title="Общение"><ChatScreen id={id} /></ScreenFrame>; }
