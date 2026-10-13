import { useLocalSearchParams } from 'expo-router';
import { ScreenFrame } from '../../components/ScreenFrame';
import { GroupScreen } from '../../screens/DetailsScreen';
import { useAppNavigation } from '../../navigation';
export default function GroupRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <ScreenFrame title="Анкета группы"><GroupScreen id={id} navigation={useAppNavigation()} /></ScreenFrame>; }
