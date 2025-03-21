import { Tabs } from 'expo-router';
import { ClipboardList, ChartBar as BarChart } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#6366f1',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Survey',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, size }) => (
            <BarChart size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}