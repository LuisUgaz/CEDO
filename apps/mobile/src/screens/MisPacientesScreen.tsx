import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export interface PacienteTerapeuta {
  id: string;
  nombre: string;
  diagnostico: string;
  agentesFisicos: string[];
  sesionesRealizadas: number;
  sesionesTotales: number;
  frecuencia: string;
}

const PACIENTES_EJEMPLO: PacienteTerapeuta[] = [
  {
    id: 'p1',
    nombre: 'María Rodríguez',
    diagnostico: 'Tendinitis Rotuliana Rodilla Derecha',
    agentesFisicos: [
      'Magnetoterapia (20 min)',
      'Ultrasonido (1 MHz, 5 min)',
      'TENS analgesia (15 min)',
      'Compresas Frías'
    ],
    sesionesRealizadas: 4,
    sesionesTotales: 10,
    frecuencia: 'Lunes, Miércoles, Viernes'
  },
  {
    id: 'p2',
    nombre: 'Carlos Meneses',
    diagnostico: 'Parálisis Facial Periférica',
    agentesFisicos: [
      'Láser Terapéutico',
      'Masoterapia Facial',
      'Reeducación Neuromuscular'
    ],
    sesionesRealizadas: 7,
    sesionesTotales: 12,
    frecuencia: 'Diario (L-V)'
  }
];

export const MisPacientesScreen: React.FC<{ pacientes?: PacienteTerapeuta[] }> = ({
  pacientes = PACIENTES_EJEMPLO
}) => {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-slate-800">
          Mis Pacientes Asignados
        </Text>
        <Text className="text-sm text-slate-500">
          Prescripción Terapéutica y Agentes Físicos Activos
        </Text>
      </View>

      <View className="gap-4">
        {pacientes.map((paciente) => (
          <View
            key={paciente.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <View className="flex-row items-center justify-between border-b border-slate-100 pb-2">
              <Text className="text-base font-bold text-slate-900">
                {paciente.nombre}
              </Text>
              <View className="rounded-full bg-clinica-verde-bg border border-clinica-verde-border px-2.5 py-0.5">
                <Text className="text-xs font-semibold text-clinica-verde-text">
                  Sesión {paciente.sesionesRealizadas}/{paciente.sesionesTotales}
                </Text>
              </View>
            </View>

            <View className="mt-2.5">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Diagnóstico Fisioterapéutico
              </Text>
              <Text className="text-sm font-medium text-slate-800 mt-0.5">
                {paciente.diagnostico}
              </Text>
            </View>

            <View className="mt-3">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Agentes Físicos Prescritos
              </Text>
              <View className="mt-1.5 flex-row flex-wrap gap-1.5">
                {paciente.agentesFisicos.map((agente, idx) => (
                  <View
                    key={idx}
                    className="rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200"
                  >
                    <Text className="text-xs text-slate-700 font-medium">
                      {agente}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-3 pt-2 border-t border-slate-100 flex-row justify-between">
              <Text className="text-xs text-slate-500">
                Frecuencia: {paciente.frecuencia}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
