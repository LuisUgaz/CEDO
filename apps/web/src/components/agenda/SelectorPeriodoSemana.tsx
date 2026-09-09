import React from 'react';
import { Calendar, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

export interface SelectorPeriodoSemanaProps {
  anio: number;
  mes: number;
  numeroSemana: number;
  rangoFechas: string;
  onCambiarPeriodo: (params: { anio: number; mes: number; numeroSemana: number }) => void;
  onCopiarSemana?: () => void;
  deshabilitarCopiar?: boolean;
}

const NOMBRES_MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const ANIOS_DISPONIBLES = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

export const SelectorPeriodoSemana: React.FC<SelectorPeriodoSemanaProps> = ({
  anio,
  mes,
  numeroSemana,
  rangoFechas,
  onCambiarPeriodo,
  onCopiarSemana,
  deshabilitarCopiar = false
}) => {
  const handleCambioAnio = (nuevoAnio: number) => {
    onCambiarPeriodo({ anio: nuevoAnio, mes, numeroSemana });
  };

  const handleCambioMes = (nuevoMes: number) => {
    onCambiarPeriodo({ anio, mes: nuevoMes, numeroSemana });
  };

  const handleCambioSemana = (nuevaSemana: number) => {
    onCambiarPeriodo({ anio, mes, numeroSemana: nuevaSemana });
  };

  const handleSemanaAnterior = () => {
    if (numeroSemana > 1) {
      handleCambioSemana(numeroSemana - 1);
    } else if (mes > 1) {
      onCambiarPeriodo({ anio, mes: mes - 1, numeroSemana: 5 });
    } else if (anio > ANIOS_DISPONIBLES[0]) {
      onCambiarPeriodo({ anio: anio - 1, mes: 12, numeroSemana: 5 });
    }
  };

  const handleSemanaSiguiente = () => {
    if (numeroSemana < 5) {
      handleCambioSemana(numeroSemana + 1);
    } else if (mes < 12) {
      onCambiarPeriodo({ anio, mes: mes + 1, numeroSemana: 1 });
    } else if (anio < ANIOS_DISPONIBLES[ANIOS_DISPONIBLES.length - 1]) {
      onCambiarPeriodo({ anio: anio + 1, mes: 1, numeroSemana: 1 });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Controles de Selección Temporal */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Selector de Año */}
        <div>
          <label htmlFor="selector-anio" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Año
          </label>
          <select
            id="selector-anio"
            value={anio}
            onChange={(e) => handleCambioAnio(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ANIOS_DISPONIBLES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Mes */}
        <div>
          <label htmlFor="selector-mes" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Mes
          </label>
          <select
            id="selector-mes"
            value={mes}
            onChange={(e) => handleCambioMes(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {NOMBRES_MESES.map((nombre, idx) => (
              <option key={nombre} value={idx + 1}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Semana */}
        <div>
          <label htmlFor="selector-semana" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Semana del Mes
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSemanaAnterior}
              title="Semana anterior"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              id="selector-semana"
              value={numeroSemana}
              onChange={(e) => handleCambioSemana(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  Semana {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSemanaSiguiente}
              title="Semana siguiente"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rango de Fechas */}
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold self-end mb-0.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{rangoFechas}</span>
        </div>
      </div>

      {/* Botón de Duplicar a Semana Siguiente */}
      {onCopiarSemana && (
        <button
          type="button"
          onClick={onCopiarSemana}
          disabled={deshabilitarCopiar}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copiar a Semana Siguiente</span>
        </button>
      )}
    </div>
  );
};
