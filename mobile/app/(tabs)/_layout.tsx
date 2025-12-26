import { Tabs } from 'expo-router';
import { Home, Users } from 'lucide-react-native';
import { SoundToggleButton } from '../../components/SoundToggleButton';

/**
 * Tab Layout
 *
 * Bottom navigation with 2 tabs:
 * - Wrapped: Main 44-slide wrapped experience
 * - Abgeordnete: Speaker search/list
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0a0a0f',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => <SoundToggleButton style={{ marginRight: 8 }} />,
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: '#71717a',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wrapped',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="abgeordnete"
        options={{
          title: 'Abgeordnete',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
