import { ScreenFrame } from '../components/ScreenFrame';
import { ChatListScreen } from '../screens/ChatScreen';
import { useAppNavigation } from '../navigation';
export default function ChatsRoute() { return <ScreenFrame><ChatListScreen navigation={useAppNavigation()} /></ScreenFrame>; }
