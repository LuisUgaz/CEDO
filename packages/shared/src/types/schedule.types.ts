import { PatientColor } from './patient.types';

export type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

export type DayWorkStatus = 'laboral' | 'feriado';

export interface ScheduleSlot {
  id: string;
  hora: string;
  dia: WeekDay;
  pacienteId?: string | null;
  nombrePaciente?: string;
  color?: PatientColor;
  asistio: boolean;
  nota?: string;
  terapeutaId?: string | null;
}

export interface WeekSchedule {
  id: string; // ej: "2026_01_sem1"
  anio: number;
  mes: string;
  numeroSemana: number;
  rangoFechas: string;
  estadoDias: Record<WeekDay, DayWorkStatus>;
  slots: ScheduleSlot[];
  updatedAt: string;
}
