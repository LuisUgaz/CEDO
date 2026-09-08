import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Users,
  ShieldAlert,
  Calendar,
  Phone,
  ArrowRight,
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react';
import type { Patient } from '@cedo/shared';
import { suscribirPacientesEnEspera } from '../../services/pacientes.service';

interface SelectorPacienteHistoriaProps {
  pacienteSeleccionado: Patient | null;
  onSeleccionarPaciente: (paciente: Patient) => void;
  onLimpiarSeleccion?: () => void;
}

const BADGES_CONSULTA: Record<string, { label: string; bg: string; text: string }> = {
  PRE_CONSULTA: { label: 'PRE-CONSULTA', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  CONSULTA_MEDICA: { label: 'CONSULTA MÉDICA', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  EVALUACION_FISIOTERAPEUTICA: { label: 'EVAL. FISIOTERAPÉUTICA', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
  TERAPIA_DIRECTA: { label: 'TERAPIA DIRECTA', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' }
};

export const SelectorPacienteHistoria: React.FC<SelectorPacienteHistoriaProps> = ({
  pacienteSeleccionado,
  onSeleccionarPaciente,
  onLimpiarSeleccion
}) => {
  const [pacientesEnEspera, setPacientesEnEspera] = useState<Patient[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const desuscribir = suscribirPacientesEnEspera(
      (pacientes) => {
        setPacientesEnEspera(pacientes);
        setCargando(false);
      },
      () => {
        setCargando(false);
      }
    );
    return () => desuscribir();
  }, []);

  const pacientesFiltrados = pacientesEnEspera.filter((p) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.dni.includes(texto)
    );
  });

  // Vista cuando un paciente ya está seleccionado (Cabecera Consolidada)
  if (pacienteSeleccionado) {
    const badge = BADGES_CONSULTA[pacienteSeleccionado.tipoConsulta || 'PRE_CONSULTA'] || {
      label: pacienteSeleccionado.tipoConsulta || 'CONSULTA',
      bg: 'bg-slate-100 border-slate-300',
      text: 'text-slate-700'
    };

    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-base font-bold text-slate-800">
                  {pacienteSeleccionado.nombre}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
                {pacienteSeleccionado.edad < 18 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Menor de Edad
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1 flex-wrap gap-y-1">
                <span className="font-semibold text-slate-700">
                  DNI: {pacienteSeleccionado.dni}
                </span>
                <span>•</span>
                <span>{pacienteSeleccionado.edad} años</span>
                <span>•</span>
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-slate-400" />
                  {pacienteSeleccionado.celular}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                  Ingreso: {pacienteSeleccionado.fechaIngreso}
                </span>
              </div>
            </div>
          </div>

          {onLimpiarSeleccion && (
            <button
              onClick={onLimpiarSeleccion}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Cambiar Paciente</span>
            </button>
          )}
        </div>

        {/* Datos de Apoderado si aplica */}
        {pacienteSeleccionado.edad < 18 && pacienteSeleccionado.nombreApoderado && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-amber-900 font-medium">
                <strong>Apoderado Legal:</strong> {pacienteSeleccionado.nombreApoderado}
              </span>
              {pacienteSeleccionado.dniApoderado && (
                <span className="text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">
                  DNI: {pacienteSeleccionado.dniApoderado}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista de Lista / Selección de Pacientes
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-emerald-600" />
            <span>Pacientes en Sala de Espera (Triage)</span>
          </h2>
          <p className="text-slate-500 text-[11px]">
            Seleccione un paciente derivado de recepción para abrir o registrar su historia clínica.
          </p>
        </div>

        {/* Buscador predictivo */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o DNI..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
          />
        </div>
      </div>

      {cargando ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          Cargando cola de triage...
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          No se encontraron pacientes en sala de espera.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {pacientesFiltrados.map((paciente) => {
            const badge = BADGES_CONSULTA[paciente.tipoConsulta || 'PRE_CONSULTA'] || {
              label: paciente.tipoConsulta || 'CONSULTA',
              bg: 'bg-slate-100 border-slate-200',
              text: 'text-slate-700'
            };

            return (
              <div
                key={paciente.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition bg-slate-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-slate-800 line-clamp-1">
                      {paciente.nombre}
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 mb-2">
                    <div className="flex items-center justify-between">
                      <span>DNI: {paciente.dni}</span>
                      <span>{paciente.edad} años</span>
                    </div>
                    {paciente.edad < 18 && paciente.nombreApoderado && (
                      <div className="text-amber-800 text-[10px] font-medium truncate">
                        Apod: {paciente.nombreApoderado}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSeleccionarPaciente(paciente)}
                  className="w-full mt-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition active:scale-98"
                >
                  <span>Iniciar Evaluación</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SelectorPacienteHistoria;
