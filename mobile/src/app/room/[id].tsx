import { useLocalSearchParams } from 'expo-router';
import { ScreenFrame } from '../../components/ScreenFrame';
import { RoomScreen } from '../../screens/DetailsScreen';
export default function RoomRoute() { const { id } = useLocalSearchParams<{ id: string }>(); return <ScreenFrame title="Жильё"><RoomScreen id={id} /></ScreenFrame>; }
