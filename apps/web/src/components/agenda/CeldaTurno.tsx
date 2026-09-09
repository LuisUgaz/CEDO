import React from 'react';
import { Plus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ESPECIALIDADES_COLORES, type ScheduleSlot } from '@cedo/shared';

export interface CeldaTurnoProps {
  slot: ScheduleSlot;
  esFeriado?: boolean;
  onClick: (slot: ScheduleSlot) => void;
  onToggleAsistencia?: (slot: ScheduleSlot) => void;
}

export const CeldaTurno: React.FC<CeldaTurnoProps> = ({
  slot,
  esFeriado = false,
  onClick,
  onToggleAsistencia
}) => {
  const estaOcupado = Boolean(slot.pacienteId || slot.nombrePaciente);
  const metaColor = slot.color ? ESPECIALIDADES_COLORES[slot.color] : null;

  if (esFeriado) {
    return (
      <div
        onClick={() => onClick(slot)}
        className="h-20 p-2 rounded-lg border border-rose-200 bg-rose-50/70 text-rose-700 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-rose-100 transition-colors"
      >
        <AlertCircle className="w-4 h-4 text-rose-500 mb-1" />
        <span className="text-[11px] font-bold">Feriado / No Laborable</span>
        {estaOcupado && (
          <span className="text-[10px] truncate max-w-full font-semibold text-rose-900 mt-0.5">
            {slot.nombrePaciente}
          </span>
        )}
      </div>
    );
  }

  if (!estaOcupado) {
    return (
      <button
        type="button"
        onClick={() => onClick(slot)}
        className="w-full h-20 p-2 rounded-lg border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 text-slate-400 hover:text-emerald-700 flex flex-col justify-center items-center transition-all group"
      >
        <Plus className="w-4 h-4 mb-0.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        <span className="text-[11px] font-medium">Disponible</span>
      </button>
    );
  }

  return (
    <div
      onClick={() => onClick(slot)}
      className={`h-20 p-2 rounded-lg border flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs ${
        metaColor ? `${metaColor.bgClass} ${metaColor.borderClass}` : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-black truncate leading-tight ${
              metaColor ? metaColor.textClass : 'text-slate-800'
            }`}
          >
            {slot.nombrePaciente}
          </p>
          {slot.nota && (
            <p className="text-[10px] text-slate-600 truncate mt-0.5">{slot.nota}</p>
          )}
        </div>

        {/* Botón de Asistencia Rápida */}
        {onToggleAsistencia && (
          <button
            type="button"
            title="Alternar asistencia"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAsistencia(slot);
            }}
            className="p-0.5 text-slate-500 hover:text-emerald-700 transition-colors shrink-0"
          >
            {slot.asistio ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400 hover:text-emerald-500" />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[9px] font-bold uppercase text-slate-500">
          {metaColor?.label || 'Terapia'}
        </span>
        {slot.asistio && (
          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full">
            Asistió
          </span>
        )}
      </div>
    </div>
  );
};
