import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748b',
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1e293b'
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Turnos de Hoy',
          headerTitle: 'CEDO-REHAB | Agenda de Sala',
          tabBarLabel: 'Turnos',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📅</Text>
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Mis Pacientes',
          headerTitle: 'CEDO-REHAB | Pacientes y Agentes',
          tabBarLabel: 'Pacientes',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👥</Text>
        }}
      />
      <Tabs.Screen
        name="asistencia"
        options={{
          title: 'Asistencia',
          headerTitle: 'CEDO-REHAB | Pie de Camilla',
          tabBarLabel: 'Asistencia',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚡</Text>
        }}
      />
    </Tabs>
  );
}
