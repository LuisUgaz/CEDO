import { z } from 'zod';
import type { PatientColor } from '../types/patient.types';
import type { WeekDay, DayWorkStatus, ScheduleSlot, WeekSchedule } from '../types/schedule.types';

export const DIAS_SEMANA: WeekDay[] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado'
];

export const HORAS_JORNADA_DEFAULT = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00'
] as const;

export const weekDaySchema = z.enum([
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado'
]);

export const dayWorkStatusSchema = z.enum(['laboral', 'feriado']);

export const patientColorSchema = z.enum([
  'color-fucsia',
  'color-melon',
  'color-verde',
  'color-amarillo',
  'color-azul',
  'color-anaranjado'
]);

export const scheduleSlotSchema = z.object({
  id: z.string().min(1, 'El id del slot es obligatorio'),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)'),
  dia: weekDaySchema,
  pacienteId: z.string().nullable().optional().default(null),
  nombrePaciente: z.string().optional(),
  color: patientColorSchema.optional(),
  asistio: z.boolean().default(false),
  nota: z.string().optional(),
  terapeutaId: z.string().nullable().optional().default(null)
});

export const weekScheduleSchema = z.object({
  id: z.string().min(1, 'El id de la semana es obligatorio'),
  anio: z.number().int().min(2026, 'El año mínimo es 2026').max(2035, 'El año máximo es 2035'),
  mes: z.string().min(1, 'El mes es obligatorio'),
  numeroSemana: z.number().int().min(1, 'La semana mínima es 1').max(5, 'La semana máxima es 5'),
  rangoFechas: z.string().min(1, 'El rango de fechas es obligatorio'),
  estadoDias: z.record(weekDaySchema, dayWorkStatusSchema),
  slots: z.array(scheduleSlotSchema),
  updatedAt: z.string()
});

export interface SpecialtyColorMeta {
  id: PatientColor;
  label: string;
  servicio: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  hexBg: string;
  hexText: string;
}

export const ESPECIALIDADES_COLORES: Record<PatientColor, SpecialtyColorMeta> = {
  'color-fucsia': {
    id: 'color-fucsia',
    label: 'Magnetoterapia',
    servicio: 'Magnetoterapia Avanzada',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-900',
    borderClass: 'border-purple-300',
    badgeClass: 'bg-purple-200 text-purple-800',
    hexBg: '#f3e8ff',
    hexText: '#581c87'
  },
  'color-melon': {
    id: 'color-melon',
    label: 'Niños / Pediatría',
    servicio: 'Fisioterapia Pediátrica',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-950',
    borderClass: 'border-orange-300',
    badgeClass: 'bg-orange-200 text-orange-800',
    hexBg: '#ffedd5',
    hexText: '#9a3412'
  },
  'color-verde': {
    id: 'color-verde',
    label: 'Adultos / Electroterapia',
    servicio: 'Electroterapia y Rehabilitación Integral',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-950',
    borderClass: 'border-emerald-300',
    badgeClass: 'bg-emerald-200 text-emerald-800',
    hexBg: '#dcfce7',
    hexText: '#166534'
  },
  'color-amarillo': {
    id: 'color-amarillo',
    label: 'Adultos Mayores / Geriatría',
    servicio: 'Fisioterapia Geriátrica',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-950',
    borderClass: 'border-amber-300',
    badgeClass: 'bg-amber-200 text-amber-800',
    hexBg: '#fef9c3',
    hexText: '#854d0e'
  },
  'color-azul': {
    id: 'color-azul',
    label: 'Masajes / Descontracturantes',
    servicio: 'Masoterapia y Terapia Manual',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-950',
    borderClass: 'border-blue-300',
    badgeClass: 'bg-blue-200 text-blue-800',
    hexBg: '#dbeafe',
    hexText: '#1e40af'
  },
  'color-anaranjado': {
    id: 'color-anaranjado',
    label: 'Doctor / Consulta Médica',
    servicio: 'Evaluación y Consulta Médica Fisiátrica',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-900',
    borderClass: 'border-amber-400',
    badgeClass: 'bg-amber-100 text-amber-800',
    hexBg: '#fed7aa',
    hexText: '#c2410c'
  }
};

export function calcularRangoSemana(anio: number, mes: number | string, numeroSemana: number): string {
  const mesNum = typeof mes === 'string' ? parseInt(mes, 10) : mes;
  const diaInicio = Math.min(Math.max((numeroSemana - 1) * 7 + 1, 1), 28);
  const diaFin = Math.min(diaInicio + 5, new Date(anio, mesNum, 0).getDate());
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(diaInicio)}/${pad(mesNum)}/${anio} - ${pad(diaFin)}/${pad(mesNum)}/${anio}`;
}

export function generarPlantillaSemana(
  anio: number,
  mes: number | string,
  numeroSemana: number
): WeekSchedule {
  const mesNum = typeof mes === 'string' ? parseInt(mes, 10) : mes;
  const mesStr = mesNum.toString().padStart(2, '0');
  const id = `${anio}_${mesStr}_sem${numeroSemana}`;

  const estadoDias: Record<WeekDay, DayWorkStatus> = {
    lunes: 'laboral',
    martes: 'laboral',
    miercoles: 'laboral',
    jueves: 'laboral',
    viernes: 'laboral',
    sabado: 'laboral'
  };

  const slots: ScheduleSlot[] = [];
  for (const hora of HORAS_JORNADA_DEFAULT) {
    for (const dia of DIAS_SEMANA) {
      slots.push({
        id: `${dia}_${hora}`,
        hora,
        dia,
        pacienteId: null,
        asistio: false
      });
    }
  }

  return {
    id,
    anio,
    mes: mesStr,
    numeroSemana,
    rangoFechas: calcularRangoSemana(anio, mesNum, numeroSemana),
    estadoDias,
    slots,
    updatedAt: new Date().toISOString()
  };
}
