import { useLocalSearchParams } from 'expo-router';
import { ScreenFrame } from '../../components/ScreenFrame';
import { PersonScreen } from '../../screens/DetailsScreen';
export default function PersonRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <ScreenFrame title="Профиль соседа"><PersonScreen id={id} /></ScreenFrame>; }
