import { ScreenFrame } from '../components/ScreenFrame';
import { GroupsScreen } from '../screens/GroupsScreen';
import { useAppNavigation } from '../navigation';
export default function GroupsRoute() { return <ScreenFrame><GroupsScreen navigation={useAppNavigation()} /></ScreenFrame>; }
