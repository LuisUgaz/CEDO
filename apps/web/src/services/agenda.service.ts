import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  weekScheduleSchema,
  scheduleSlotSchema,
  generarPlantillaSemana,
  type WeekSchedule,
  type ScheduleSlot,
  type WeekDay,
  type DayWorkStatus
} from '@cedo/shared';

export const COLECCION_AGENDA = 'citas_agenda';

/**
 * Descompone un ID de semana estructurado (ej. "2026_09_sem2") en sus partes numéricas.
 */
export function parsearSemanaId(semanaId: string): {
  anio: number;
  mes: string;
  numeroSemana: number;
} {
  const partes = semanaId.split('_');
  const anio = parseInt(partes[0] || '2026', 10);
  const mes = partes[1] || '01';
  const semStr = partes[2]?.replace('sem', '') || '1';
  const numeroSemana = parseInt(semStr, 10);

  return { anio, mes, numeroSemana };
}

/**
 * Obtiene la agenda semanal de Firestore. Si no existe aún, inicializa y retorna una plantilla vacía.
 */
export async function obtenerAgendaSemanal(semanaId: string): Promise<WeekSchedule> {
  const docRef = doc(db, COLECCION_AGENDA, semanaId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const { anio, mes, numeroSemana } = parsearSemanaId(semanaId);
    return generarPlantillaSemana(anio, mes, numeroSemana);
  }

  const datos = docSnap.data() as Record<string, any>;
  return weekScheduleSchema.parse({
    id: docSnap.id,
    ...datos
  });
}

/**
 * Persiste una agenda semanal completa en Firestore con validación Zod previa.
 */
export async function guardarAgendaSemanal(agenda: WeekSchedule): Promise<WeekSchedule> {
  const agendaValidada = weekScheduleSchema.parse({
    ...agenda,
    updatedAt: new Date().toISOString()
  });

  const docRef = doc(db, COLECCION_AGENDA, agendaValidada.id);
  await setDoc(docRef, agendaValidada, { merge: true });

  return agendaValidada;
}

/**
 * Actualiza un slot horario individual de la semana especificada.
 */
export async function actualizarSlot(
  semanaId: string,
  slot: ScheduleSlot
): Promise<WeekSchedule> {
  const slotValidado = scheduleSlotSchema.parse(slot);
  const agenda = await obtenerAgendaSemanal(semanaId);

  const slotIndex = agenda.slots.findIndex((s) => s.id === slotValidado.id);
  if (slotIndex >= 0) {
    agenda.slots[slotIndex] = slotValidado;
  } else {
    agenda.slots.push(slotValidado);
  }

  return guardarAgendaSemanal(agenda);
}

/**
 * Cambia el estado laboral/feriado de un día en la agenda semanal.
 */
export async function marcarEstadoDia(
  semanaId: string,
  dia: WeekDay,
  estado: DayWorkStatus
): Promise<WeekSchedule> {
  const agenda = await obtenerAgendaSemanal(semanaId);
  agenda.estadoDias[dia] = estado;
  return guardarAgendaSemanal(agenda);
}

/**
 * Clona todos los turnos ocupados de una semana hacia la semana siguiente,
 * inicializando la asistencia en false para el nuevo ciclo y respetando la configuración destino.
 */
export async function copiarSemanaSiguiente(
  origenSemanaId: string,
  destinoSemanaId: string
): Promise<WeekSchedule> {
  const agendaOrigen = await obtenerAgendaSemanal(origenSemanaId);
  const agendaDestino = await obtenerAgendaSemanal(destinoSemanaId);

  // Mapear slots ocupados de la semana de origen
  const slotsOcupadosOrigen = new Map<string, ScheduleSlot>();
  for (const s of agendaOrigen.slots) {
    if (s.pacienteId || s.nombrePaciente) {
      slotsOcupadosOrigen.set(s.id, s);
    }
  }

  // Actualizar slots de destino manteniendo el estado del día destino
  agendaDestino.slots = agendaDestino.slots.map((slotDestino) => {
    const slotOrigen = slotsOcupadosOrigen.get(slotDestino.id);
    if (slotOrigen) {
      return {
        ...slotDestino,
        pacienteId: slotOrigen.pacienteId,
        nombrePaciente: slotOrigen.nombrePaciente,
        color: slotOrigen.color,
        asistio: false, // La nueva semana arranca con asistencia sin marcar
        nota: slotOrigen.nota,
        terapeutaId: slotOrigen.terapeutaId
      };
    }
    return slotDestino;
  });

  return guardarAgendaSemanal(agendaDestino);
}

/**
 * Suscribe a las actualizaciones en tiempo real de una semana en Cloud Firestore.
 */
export function suscribirAgendaSemanal(
  semanaId: string,
  onUpdate: (agenda: WeekSchedule) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, COLECCION_AGENDA, semanaId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        try {
          const parsed = weekScheduleSchema.parse({
            id: docSnap.id,
            ...docSnap.data()
          });
          onUpdate(parsed);
        } catch (error: any) {
          if (onError) onError(error);
        }
      } else {
        const { anio, mes, numeroSemana } = parsearSemanaId(semanaId);
        onUpdate(generarPlantillaSemana(anio, mes, numeroSemana));
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
