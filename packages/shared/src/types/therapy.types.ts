export type AttentionType = 'ASEGURADO' | 'PARTICULAR';

export type PhysicalAgent =
  | 'CHC'
  | 'CHF'
  | 'IR'
  | 'US 1 MHz'
  | 'US 3 MHz'
  | 'TENS'
  | 'INTERFERENCIAL'
  | 'MAGNETOTERAPIA'
  | 'RAYOS LASER'
  | 'ALTO VOLTAJE'
  | 'TERAPIA COMBINADA'
  | 'CONTRASTE';

export type ManualAndGymTechnique =
  | 'MASOTERAPIA SUAVE'
  | 'MASOTERAPIA PROFUNDA'
  | 'COLCHONETA'
  | 'RUEDA HOMBRO'
  | 'PARALELA'
  | 'BICICLETA'
  | 'ESCALERA RUSA';

export type TherapeuticExercise =
  | 'WILSON'
  | 'WILLIAMS'
  | 'OTRO METODO';

export type PrintFormat = 'a6' | 'a5' | 'a4-terapia';

export interface TherapySheet {
  id: string;
  pacienteId: string;
  numeroPaquete: number;
  fecha: string;
  tipoAtencion: AttentionType;
  diagnostico: string;
  sesionNumero?: string;
  tecnicasSeleccionadas: (PhysicalAgent | ManualAndGymTechnique | TherapeuticExercise)[];
  indicacionesAdicionales: string[];
  formatoImpresion: PrintFormat;
  updatedAt: string;
}

export interface PackageAttendance {
  sesionNumero: number;
  asistio: boolean;
  fechaAsistencia?: string | null;
  boletaEmitida: boolean;
  numeroBoleta?: string | null;
}

export interface TherapyPackage {
  id: string;
  pacienteId: string;
  numeroPaquete: number;
  costoTotal: number;
  costoPorTerapia: number;
  costoConsulta: number;
  boletaConsultaEmitida: boolean;
  sesionesTotales: number; // Por defecto 10 o 12
  sesiones: PackageAttendance[];
  totalPagado: number;
  saldoRestante: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
