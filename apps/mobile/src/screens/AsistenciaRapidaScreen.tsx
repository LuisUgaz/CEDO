import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export interface AsistenciaRapidaProps {
  onMarcarAsistencia?: (pacienteId: string, sesionNumero: number) => void;
}

export const AsistenciaRapidaScreen: React.FC<AsistenciaRapidaProps> = ({
  onMarcarAsistencia
}) => {
  const [asistencias, setAsistencias] = useState<Record<string, boolean>>({});

  const pacienteCamilla = {
    id: 'p1',
    nombre: 'María Rodríguez',
    dni: '45892147',
    sesionActual: 5,
    totalSesiones: 10,
    camilla: 'Camilla 03 - Box A',
    horaEntrada: '10:00 AM'
  };

  const handleMarcar = () => {
    setAsistencias((prev) => ({ ...prev, [pacienteCamilla.id]: true }));
    if (onMarcarAsistencia) {
      onMarcarAsistencia(pacienteCamilla.id, pacienteCamilla.sesionActual);
    }
  };

  const yaMarcada = asistencias[pacienteCamilla.id] || false;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-slate-800">
          Asistencia a Pie de Camilla
        </Text>
        <Text className="text-sm text-slate-500">
          Marcación inmediata de sesión sin desplazarse a recepción
        </Text>
      </View>

      <View className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
          <View>
            <Text className="text-lg font-bold text-slate-900">
              {pacienteCamilla.nombre}
            </Text>
            <Text className="text-xs text-slate-400">
              DNI: {pacienteCamilla.dni}
            </Text>
          </View>
          <View className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
            <Text className="text-xs font-semibold text-emerald-700">
              {pacienteCamilla.camilla}
            </Text>
          </View>
        </View>

        <View className="my-4 gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-slate-500">Sesión a Ejecutar:</Text>
            <Text className="text-sm font-bold text-slate-800">
              {pacienteCamilla.sesionActual} de {pacienteCamilla.totalSesiones}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-slate-500">Hora de Ingreso:</Text>
            <Text className="text-sm font-medium text-slate-700">
              {pacienteCamilla.horaEntrada}
            </Text>
          </View>
        </View>

        {yaMarcada ? (
          <View className="rounded-lg bg-emerald-500 p-3 items-center">
            <Text className="text-white font-bold text-sm">
              ✓ Asistencia Registrada en Tiempo Real
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            testID="btn-marcar-asistencia"
            onPress={handleMarcar}
            className="rounded-lg bg-emerald-600 p-3.5 items-center active:bg-emerald-700"
          >
            <Text className="text-white font-bold text-base">
              Marcar Asistencia
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};
