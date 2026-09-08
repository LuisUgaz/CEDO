import React, { useState } from 'react';
import { Calendar, Users, CheckCircle2, BedDouble, Stethoscope, Clock } from 'lucide-react';

export interface TurnoCita {
  id: string;
  pacienteNombre: string;
  hora: string;
  diagnostico: string;
  terapeuta: string;
  estado: 'pendiente' | 'en_camilla' | 'completada';
  color: 'verde' | 'melon' | 'azul';
}

export interface PacienteTerapeuta {
  id: string;
  nombre: string;
  diagnostico: string;
  agentesFisicos: string[];
  sesionesRealizadas: number;
  sesionesTotales: number;
  frecuencia: string;
}

const TURNOS_DEFECTO: TurnoCita[] = [
  {
    id: 'c1',
    pacienteNombre: 'Juan Pérez',
    hora: '08:30 AM',
    diagnostico: 'Lumbalgia Mecánica',
    terapeuta: 'Lic. Morales',
    estado: 'en_camilla',
    color: 'verde'
  },
  {
    id: 'c2',
    pacienteNombre: 'Rosa Falcon',
    hora: '09:15 AM',
    diagnostico: 'Hemiplejía Izquierda Post-ACV',
    terapeuta: 'Lic. Morales',
    estado: 'pendiente',
    color: 'melon'
  },
  {
    id: 'c3',
    pacienteNombre: 'Carlos Ramos',
    hora: '10:00 AM',
    diagnostico: 'Esguince de Tobillo Grado II',
    terapeuta: 'Lic. Morales',
    estado: 'pendiente',
    color: 'azul'
  }
];

const PACIENTES_DEFECTO: PacienteTerapeuta[] = [
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

export interface VistaTerapeutaProps {
  turnos?: TurnoCita[];
  pacientes?: PacienteTerapeuta[];
  onMarcarAsistencia?: (pacienteId: string, sesionNumero: number) => void;
}

export const VistaTerapeuta: React.FC<VistaTerapeutaProps> = ({
  turnos = TURNOS_DEFECTO,
  pacientes = PACIENTES_DEFECTO,
  onMarcarAsistencia
}) => {
  const [tabActiva, setTabActiva] = useState<'turnos' | 'pacientes' | 'asistencia'>('turnos');
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
    <div className="w-full flex flex-col flex-1 max-w-4xl mx-auto">
      {/* Navegación de pestañas adaptativa / PWA */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 mb-4 gap-1">
        <button
          type="button"
          onClick={() => setTabActiva('turnos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
            tabActiva === 'turnos'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Turnos de Hoy</span>
        </button>
        <button
          type="button"
          onClick={() => setTabActiva('pacientes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
            tabActiva === 'pacientes'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mis Pacientes</span>
        </button>
        <button
          type="button"
          onClick={() => setTabActiva('asistencia')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
            tabActiva === 'asistencia'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Asistencia a Pie de Camilla</span>
        </button>
      </div>

      {/* Tab 1: Turnos de Hoy */}
      {tabActiva === 'turnos' && (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Turnos de Hoy</h3>
              <p className="text-xs text-slate-500">
                Sala de Rehabilitación - Citas programadas
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {turnos.length} Citas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {turnos.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {t.pacienteNombre}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    {t.hora}
                  </span>
                </div>
                <div className="mt-2.5">
                  <span className="text-xs text-slate-400 block font-medium">
                    Diagnóstico
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {t.diagnostico}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t.terapeuta}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-medium capitalize ${
                      t.estado === 'en_camilla'
                        ? 'bg-amber-100 text-amber-800'
                        : t.estado === 'completada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Mis Pacientes */}
      {tabActiva === 'pacientes' && (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Mis Pacientes Asignados
              </h3>
              <p className="text-xs text-slate-500">
                Prescripción clínica y agentes físicos en sala
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pacientes.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {p.nombre}
                    </h4>
                    <p className="text-xs text-slate-500">{p.frecuencia}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-clinica-verde-bg text-clinica-verde-text border border-clinica-verde-border rounded-full">
                    Sesión {p.sesionesRealizadas} de {p.sesionesTotales}
                  </span>
                </div>

                <div className="mt-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Diagnóstico
                  </span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {p.diagnostico}
                  </p>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Agentes Físicos Prescritos
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.agentesFisicos.map((ag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Asistencia a Pie de Camilla */}
      {tabActiva === 'asistencia' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-left max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Asistencia a Pie de Camilla
              </h3>
              <p className="text-xs text-slate-500">
                Marcado directo de sesión sin ir a recepción
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <BedDouble className="w-3.5 h-3.5" />
              {pacienteCamilla.camilla}
            </span>
          </div>

          <div className="my-4 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Paciente:</span>
              <span className="font-bold text-slate-800">
                {pacienteCamilla.nombre}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">DNI:</span>
              <span className="font-medium text-slate-700">
                {pacienteCamilla.dni}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sesión a Ejecutar:</span>
              <span className="font-bold text-emerald-700">
                Sesión {pacienteCamilla.sesionActual} de{' '}
                {pacienteCamilla.totalSesiones}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Hora Ingreso:</span>
              <span className="font-medium text-slate-700">
                {pacienteCamilla.horaEntrada}
              </span>
            </div>
          </div>

          {yaMarcada ? (
            <div className="bg-emerald-600 text-white p-3.5 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>✓ Asistencia Registrada en Tiempo Real</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarcar}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Marcar Asistencia</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
