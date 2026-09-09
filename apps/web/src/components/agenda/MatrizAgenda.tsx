import React from 'react';
import { Clock, CalendarCheck2, CalendarOff } from 'lucide-react';
import {
  DIAS_SEMANA,
  HORAS_JORNADA_DEFAULT,
  type WeekSchedule,
  type ScheduleSlot,
  type WeekDay,
  type PatientColor
} from '@cedo/shared';
import { CeldaTurno } from './CeldaTurno';

export interface MatrizAgendaProps {
  agenda: WeekSchedule;
  onSeleccionarSlot: (slot: ScheduleSlot) => void;
  onToggleAsistencia: (slot: ScheduleSlot) => void;
  onToggleEstadoDia?: (dia: WeekDay) => void;
  filtroColor?: PatientColor | null;
}

const NOMBRES_DIAS: Record<WeekDay, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado'
};

export const MatrizAgenda: React.FC<MatrizAgendaProps> = ({
  agenda,
  onSeleccionarSlot,
  onToggleAsistencia,
  onToggleEstadoDia,
  filtroColor
}) => {
  // Mapa indexado por id del slot para búsqueda instantánea O(1)
  const mapaSlots = React.useMemo(() => {
    const mapa = new Map<string, ScheduleSlot>();
    for (const slot of agenda.slots) {
      mapa.set(slot.id, slot);
    }
    return mapa;
  }, [agenda.slots]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Contenedor con Scroll Horizontal */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px] text-left">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {/* Columna de Horas */}
              <th className="w-20 p-3 text-center border-r border-slate-200">
                <div className="flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hora</span>
                </div>
              </th>

              {/* Columnas de los 6 Días (L-S) */}
              {DIAS_SEMANA.map((dia) => {
                const esFeriado = agenda.estadoDias[dia] === 'feriado';

                return (
                  <th
                    key={dia}
                    className={`p-3 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                      esFeriado ? 'bg-rose-50/60' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs font-black text-slate-800">
                        {NOMBRES_DIAS[dia]}
                      </span>

                      {/* Badge / Botón de Alternancia de Día Laboral o Feriado */}
                      {onToggleEstadoDia ? (
                        <button
                          type="button"
                          onClick={() => onToggleEstadoDia(dia)}
                          title={`Alternar estado del día ${NOMBRES_DIAS[dia].toLowerCase()}`}
                          className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-all ${
                            esFeriado
                              ? 'bg-rose-100 border-rose-300 text-rose-800 hover:bg-rose-200'
                              : 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {esFeriado ? (
                            <>
                              <CalendarOff className="w-3 h-3 text-rose-600" />
                              <span>Feriado</span>
                            </>
                          ) : (
                            <>
                              <CalendarCheck2 className="w-3 h-3 text-emerald-600" />
                              <span>Laboral</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            esFeriado
                              ? 'bg-rose-100 border-rose-300 text-rose-800'
                              : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          }`}
                        >
                          {esFeriado ? 'Feriado' : 'Laboral'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {HORAS_JORNADA_DEFAULT.map((hora) => (
              <tr key={hora} className="hover:bg-slate-50/40 transition-colors">
                {/* Cabecera de Fila: Hora */}
                <td className="w-20 p-2 text-center border-r border-slate-200 align-middle">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {hora}
                  </span>
                </td>

                {/* Celdas por Día */}
                {DIAS_SEMANA.map((dia) => {
                  const slotId = `${dia}_${hora}`;
                  const slot = mapaSlots.get(slotId) || {
                    id: slotId,
                    hora,
                    dia,
                    asistio: false
                  };

                  const esFeriado = agenda.estadoDias[dia] === 'feriado';
                  const coincideFiltro = !filtroColor || slot.color === filtroColor;

                  return (
                    <td
                      key={slotId}
                      className={`p-1.5 border-r border-slate-100 last:border-r-0 align-top transition-opacity ${
                        !coincideFiltro ? 'opacity-30' : ''
                      }`}
                    >
                      <CeldaTurno
                        slot={slot}
                        esFeriado={esFeriado}
                        onClick={onSeleccionarSlot}
                        onToggleAsistencia={onToggleAsistencia}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
