import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import {
  generarPlantillaSemana,
  type WeekSchedule,
  type ScheduleSlot,
  type WeekDay,
  type Patient,
  type PatientColor
} from '@cedo/shared';
import {
  suscribirAgendaSemanal,
  actualizarSlot,
  marcarEstadoDia,
  copiarSemanaSiguiente
} from '../../services/agenda.service';
import { suscribirPacientesEnEspera } from '../../services/pacientes.service';
import { SelectorPeriodoSemana } from './SelectorPeriodoSemana';
import { LeyendaColores } from './LeyendaColores';
import { MatrizAgenda } from './MatrizAgenda';
import { ModalTurno } from './ModalTurno';

export const ModuloAgenda: React.FC = () => {
  const [anio, setAnio] = useState(2026);
  const [mes, setMes] = useState(9);
  const [numeroSemana, setNumeroSemana] = useState(2);

  const [agenda, setAgenda] = useState<WeekSchedule>(() =>
    generarPlantillaSemana(2026, 9, 2)
  );
  const [slotSeleccionado, setSlotSeleccionado] = useState<ScheduleSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroColor, setFiltroColor] = useState<PatientColor | null>(null);
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);

  const mesStr = mes.toString().padStart(2, '0');
  const semanaId = `${anio}_${mesStr}_sem${numeroSemana}`;

  // Suscripción en tiempo real a la semana activa en Firestore
  useEffect(() => {
    const unsub = suscribirAgendaSemanal(semanaId, (agendaActualizada) => {
      setAgenda(agendaActualizada);
    });

    return () => unsub();
  }, [semanaId]);

  // Suscripción a lista de pacientes para predictivo
  useEffect(() => {
    const unsub = suscribirPacientesEnEspera((lista) => {
      setPacientes(lista);
    });

    return () => unsub();
  }, []);

  const notificar = (mensaje: string) => {
    setMensajeNotificacion(mensaje);
    setTimeout(() => {
      setMensajeNotificacion(null);
    }, 4000);
  };

  const handleCambiarPeriodo = (params: {
    anio: number;
    mes: number;
    numeroSemana: number;
  }) => {
    setAnio(params.anio);
    setMes(params.mes);
    setNumeroSemana(params.numeroSemana);
  };

  const handleSeleccionarSlot = (slot: ScheduleSlot) => {
    setSlotSeleccionado(slot);
    setIsModalOpen(true);
  };

  const handleGuardarSlot = async (slotActualizado: ScheduleSlot) => {
    try {
      await actualizarSlot(agenda.id, slotActualizado);
      notificar('Turno actualizado en tiempo real');
    } catch (error) {
      console.error('Error al guardar slot:', error);
    }
  };

  const handleDesocuparSlot = async (slotId: string) => {
    try {
      const slotLimpio: ScheduleSlot = {
        id: slotId,
        hora: slotId.split('_')[1] || '08:00',
        dia: (slotId.split('_')[0] as WeekDay) || 'lunes',
        pacienteId: null,
        nombrePaciente: undefined,
        color: undefined,
        asistio: false,
        nota: undefined
      };
      await actualizarSlot(agenda.id, slotLimpio);
      notificar('Turno desocupado');
    } catch (error) {
      console.error('Error al desocupar slot:', error);
    }
  };

  const handleToggleAsistencia = async (slot: ScheduleSlot) => {
    try {
      const slotModificado: ScheduleSlot = {
        ...slot,
        asistio: !slot.asistio
      };
      await actualizarSlot(agenda.id, slotModificado);
    } catch (error) {
      console.error('Error al alternar asistencia:', error);
    }
  };

  const handleToggleEstadoDia = async (dia: WeekDay) => {
    try {
      const estadoActual = agenda.estadoDias[dia];
      const nuevoEstado = estadoActual === 'laboral' ? 'feriado' : 'laboral';
      await marcarEstadoDia(agenda.id, dia, nuevoEstado);
      notificar(`Día ${dia} marcado como ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al alternar estado del día:', error);
    }
  };

  const handleCopiarSemanaSiguiente = async () => {
    try {
      let siguienteAnio = anio;
      let siguienteMes = mes;
      let siguienteSem = numeroSemana + 1;

      if (siguienteSem > 5) {
        siguienteSem = 1;
        siguienteMes = mes + 1;
        if (siguienteMes > 12) {
          siguienteMes = 1;
          siguienteAnio = anio + 1;
        }
      }

      const siguienteMesStr = siguienteMes.toString().padStart(2, '0');
      const destinoId = `${siguienteAnio}_${siguienteMesStr}_sem${siguienteSem}`;

      await copiarSemanaSiguiente(agenda.id, destinoId);
      notificar(`Turnos copiados exitosamente hacia la Semana ${siguienteSem}`);
    } catch (error) {
      console.error('Error al copiar semana:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notificación Flotante */}
      {mensajeNotificacion && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      {/* Cabecera del Módulo */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Horario y Agenda Semanal Multi-Terapeuta
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de turnos de Lunes a Sábado con código de colores por especialidad y autoguardado en la nube.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Firestore Sincronizado
          </span>
        </div>
      </div>

      {/* Controles de Selección de Semana */}
      <SelectorPeriodoSemana
        anio={anio}
        mes={mes}
        numeroSemana={numeroSemana}
        rangoFechas={agenda.rangoFechas}
        onCambiarPeriodo={handleCambiarPeriodo}
        onCopiarSemana={handleCopiarSemanaSiguiente}
      />

      {/* Barra de Leyenda de Colores */}
      <LeyendaColores
        colorSeleccionado={filtroColor}
        onSeleccionarColor={setFiltroColor}
      />

      {/* Cuadrícula Matricial Semanal */}
      <MatrizAgenda
        agenda={agenda}
        onSeleccionarSlot={handleSeleccionarSlot}
        onToggleAsistencia={handleToggleAsistencia}
        onToggleEstadoDia={handleToggleEstadoDia}
        filtroColor={filtroColor}
      />

      {/* Modal de Programación y Edición de Slot */}
      <ModalTurno
        isOpen={isModalOpen}
        slot={slotSeleccionado}
        onClose={() => {
          setIsModalOpen(false);
          setSlotSeleccionado(null);
        }}
        onGuardarSlot={handleGuardarSlot}
        onDesocuparSlot={handleDesocuparSlot}
        pacientesDisponibles={pacientes}
      />
    </div>
  );
};

export default ModuloAgenda;
