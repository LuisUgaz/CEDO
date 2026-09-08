import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export interface TurnoCita {
  id: string;
  pacienteNombre: string;
  hora: string;
  diagnostico: string;
  terapeuta: string;
  estado: 'pendiente' | 'en_camilla' | 'completada';
  colorCodigo: string;
}

const TURNOS_EJEMPLO: TurnoCita[] = [
  {
    id: 'c1',
    pacienteNombre: 'Juan Pérez',
    hora: '08:30 AM',
    diagnostico: 'Lumbalgia Mecánica',
    terapeuta: 'Lic. Morales',
    estado: 'en_camilla',
    colorCodigo: 'verde'
  },
  {
    id: 'c2',
    pacienteNombre: 'Rosa Falcon',
    hora: '09:15 AM',
    diagnostico: 'Hemiplejía Izquierda Post-ACV',
    terapeuta: 'Lic. Morales',
    estado: 'pendiente',
    colorCodigo: 'melon'
  },
  {
    id: 'c3',
    pacienteNombre: 'Carlos Ramos',
    hora: '10:00 AM',
    diagnostico: 'Esguince de Tobillo Grado II',
    terapeuta: 'Lic. Morales',
    estado: 'pendiente',
    colorCodigo: 'azul'
  }
];

export const TurnosHoyScreen: React.FC<{ turnos?: TurnoCita[] }> = ({
  turnos = TURNOS_EJEMPLO
}) => {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-slate-800">Turnos de Hoy</Text>
        <Text className="text-sm text-slate-500">
          Sala de Rehabilitación - Fisioterapia Activa
        </Text>
      </View>

      <View className="gap-3">
        {turnos.map((turno) => (
          <View
            key={turno.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <View className="flex-row items-center justify-between border-b border-slate-100 pb-2">
              <Text className="font-semibold text-slate-900 text-base">
                {turno.pacienteNombre}
              </Text>
              <View className="rounded-full bg-emerald-100 px-2.5 py-0.5">
                <Text className="text-xs font-medium text-emerald-800">
                  {turno.hora}
                </Text>
              </View>
            </View>

            <View className="mt-2">
              <Text className="text-xs text-slate-400">Diagnóstico:</Text>
              <Text className="text-sm font-medium text-slate-700">
                {turno.diagnostico}
              </Text>
            </View>

            <View className="mt-3 flex-row items-center justify-between pt-2">
              <Text className="text-xs text-slate-500">
                Terapeuta: {turno.terapeuta}
              </Text>
              <View
                className={`rounded px-2 py-1 ${
                  turno.estado === 'en_camilla'
                    ? 'bg-amber-100'
                    : turno.estado === 'completada'
                    ? 'bg-emerald-100'
                    : 'bg-slate-100'
                }`}
              >
                <Text className="text-xs font-semibold capitalize text-slate-700">
                  {turno.estado.replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
