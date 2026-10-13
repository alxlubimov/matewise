import { ScreenFrame } from '../components/ScreenFrame';
import { SearchScreen } from '../screens/SearchScreen';
import { useAppNavigation } from '../navigation';
export default function SearchRoute() { return <ScreenFrame><SearchScreen navigation={useAppNavigation()} /></ScreenFrame>; }
