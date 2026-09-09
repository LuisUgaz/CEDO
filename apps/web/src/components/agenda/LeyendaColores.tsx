import React from 'react';
import { ESPECIALIDADES_COLORES, type PatientColor } from '@cedo/shared';

export interface LeyendaColoresProps {
  colorSeleccionado?: PatientColor | null;
  onSeleccionarColor?: (color: PatientColor | null) => void;
}

export const LeyendaColores: React.FC<LeyendaColoresProps> = ({
  colorSeleccionado,
  onSeleccionarColor
}) => {
  const listaColores = Object.values(ESPECIALIDADES_COLORES);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Código de Colores por Especialidad
        </span>
        {colorSeleccionado && onSeleccionarColor && (
          <button
            type="button"
            onClick={() => onSeleccionarColor(null)}
            className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold"
          >
            Mostrar todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {listaColores.map((especialidad) => {
          const estaActivo = colorSeleccionado === especialidad.id;

          return (
            <button
              key={especialidad.id}
              type="button"
              onClick={() => onSeleccionarColor?.(estaActivo ? null : especialidad.id)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                especialidad.bgClass
              } ${especialidad.borderClass} ${
                estaActivo ? 'ring-2 ring-emerald-500 shadow-xs' : 'hover:opacity-90'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: especialidad.hexBg }}
              />
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${especialidad.textClass}`}>
                  {especialidad.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
