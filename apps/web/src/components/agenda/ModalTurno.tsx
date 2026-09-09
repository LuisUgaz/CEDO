import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, User, FileText, CheckCircle2 } from 'lucide-react';
import {
  ESPECIALIDADES_COLORES,
  type ScheduleSlot,
  type Patient,
  type PatientColor
} from '@cedo/shared';

export interface ModalTurnoProps {
  isOpen: boolean;
  slot: ScheduleSlot | null;
  onClose: () => void;
  onGuardarSlot: (slotActualizado: ScheduleSlot) => void;
  onDesocuparSlot?: (slotId: string) => void;
  pacientesDisponibles?: Patient[];
}

export const ModalTurno: React.FC<ModalTurnoProps> = ({
  isOpen,
  slot,
  onClose,
  onGuardarSlot,
  onDesocuparSlot,
  pacientesDisponibles = []
}) => {
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [color, setColor] = useState<PatientColor>('color-fucsia');
  const [asistio, setAsistio] = useState(false);
  const [nota, setNota] = useState('');
  const [mostrarPredictivo, setMostrarPredictivo] = useState(false);

  useEffect(() => {
    if (slot) {
      setNombrePaciente(slot.nombrePaciente || '');
      setPacienteId(slot.pacienteId || null);
      setColor(slot.color || 'color-fucsia');
      setAsistio(slot.asistio || false);
      setNota(slot.nota || '');
      setMostrarPredictivo(false);
    }
  }, [slot]);

  if (!isOpen || !slot) {
    return null;
  }

  const pacientesFiltrados = pacientesDisponibles.filter((p) => {
    if (!nombrePaciente.trim()) return false;
    const busqueda = nombrePaciente.toLowerCase();
    return p.nombre.toLowerCase().includes(busqueda) || p.dni.includes(busqueda);
  });

  const handleSeleccionarPaciente = (p: Patient) => {
    setPacienteId(p.id);
    setNombrePaciente(p.nombre);
    if (p.color) {
      setColor(p.color);
    }
    setMostrarPredictivo(false);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    const slotActualizado: ScheduleSlot = {
      ...slot,
      nombrePaciente: nombrePaciente.trim() || undefined,
      pacienteId: pacienteId || (nombrePaciente.trim() ? `temp_${Date.now()}` : null),
      color: nombrePaciente.trim() ? color : undefined,
      asistio: nombrePaciente.trim() ? asistio : false,
      nota: nota.trim() || undefined
    };

    onGuardarSlot(slotActualizado);
    onClose();
  };

  const handleDesocupar = () => {
    if (onDesocuparSlot) {
      onDesocuparSlot(slot.id);
    }
    onClose();
  };

  const listaEspecialidades = Object.values(ESPECIALIDADES_COLORES);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              Programar Turno: {slot.dia} {slot.hora}
            </h3>
            <p className="text-[11px] text-slate-500">
              Asigne el paciente, su código de color de terapia y observaciones.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleGuardar} className="p-5 space-y-4 overflow-y-auto">
          {/* Campo de Paciente con Búsqueda Predictiva */}
          <div className="relative">
            <label
              htmlFor="nombre-paciente"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Paciente
            </label>
            <div className="relative">
              <input
                id="nombre-paciente"
                type="text"
                value={nombrePaciente}
                onChange={(e) => {
                  setNombrePaciente(e.target.value);
                  setMostrarPredictivo(true);
                }}
                placeholder="Escriba el nombre o DNI del paciente..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Menú de Búsqueda Predictiva */}
            {mostrarPredictivo && pacientesFiltrados.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                {pacientesFiltrados.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSeleccionarPaciente(p)}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{p.nombre}</p>
                      <p className="text-[10px] text-slate-500">DNI: {p.dni}</p>
                    </div>
                    {p.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: ESPECIALIDADES_COLORES[p.color]?.hexBg }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selector de Color y Especialidad */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Especialidad / Código de Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listaEspecialidades.map((esp) => {
                const seleccionado = color === esp.id;
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => setColor(esp.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                      esp.bgClass
                    } ${esp.borderClass} ${
                      seleccionado
                        ? 'ring-2 ring-emerald-500 shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 flex items-center justify-center text-white"
                      style={{ backgroundColor: esp.hexBg }}
                    >
                      {seleccionado && <Check className="w-2.5 h-2.5 text-slate-800" />}
                    </div>
                    <span className={`font-bold text-[11px] truncate ${esp.textClass}`}>
                      {esp.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marcar Asistencia */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <input
              id="asistencia-checkbox"
              type="checkbox"
              checked={asistio}
              onChange={(e) => setAsistio(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="asistencia-checkbox"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Asistió a la sesión</span>
            </label>
          </div>

          {/* Notas u Observaciones */}
          <div>
            <label
              htmlFor="nota-turno"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Notas u Observaciones Clínicas
            </label>
            <div className="relative">
              <input
                id="nota-turno"
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Ej. Dolor lumbar agudo, primera sesión, traer placa..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Acciones del Modal */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {Boolean(slot.pacienteId || slot.nombrePaciente) && (
                <button
                  type="button"
                  onClick={handleDesocupar}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Desocupar Turno</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                Guardar Turno
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
