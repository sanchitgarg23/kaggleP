import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AssessmentScreen } from '../screens/AssessmentScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { RootStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Assessment" component={AssessmentScreen} options={{ title: 'Patient assessment' }} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Recommendation' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
    </Stack.Navigator>
  );
}
