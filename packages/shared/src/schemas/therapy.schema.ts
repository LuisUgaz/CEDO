import { z } from 'zod';

export const AttentionTypeSchema = z.enum(['ASEGURADO', 'PARTICULAR']);

export const PrintFormatSchema = z.enum(['a6', 'a5', 'a4-terapia']);

export const TherapySheetSchema = z.object({
  id: z.string().optional(),
  pacienteId: z.string().min(1, 'El ID de paciente es obligatorio'),
  numeroPaquete: z.number().int().min(1).default(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
  tipoAtencion: AttentionTypeSchema.default('PARTICULAR'),
  diagnostico: z.string().default(''),
  sesionNumero: z.string().optional(),
  tecnicasSeleccionadas: z.array(z.string()).default([]),
  indicacionesAdicionales: z.array(z.string()).default([]),
  formatoImpresion: PrintFormatSchema.default('a6'),
  updatedAt: z.string().optional()
});

export type TherapySheetInput = z.input<typeof TherapySheetSchema>;
export type TherapySheetValidated = z.infer<typeof TherapySheetSchema>;

export const PackageAttendanceSchema = z.object({
  sesionNumero: z.number().int().min(1).max(30),
  asistio: z.boolean().default(false),
  fechaAsistencia: z.string().nullable().optional(),
  boletaEmitida: z.boolean().default(false),
  numeroBoleta: z.string().nullable().optional()
});

export const TherapyPackageSchema = z.object({
  id: z.string().min(1),
  pacienteId: z.string().min(1),
  numeroPaquete: z.number().int().min(1),
  costoTotal: z.number().min(0),
  costoPorTerapia: z.number().min(0),
  costoConsulta: z.number().min(0).default(0),
  boletaConsultaEmitida: z.boolean().default(false),
  sesionesTotales: z.number().int().min(1).default(10),
  sesiones: z.array(PackageAttendanceSchema),
  totalPagado: z.number().min(0).default(0),
  saldoRestante: z.number().default(0),
  activo: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
});

export interface ItemCatalogoPrescripcion {
  id: string;
  nombre: string;
  categoria: 'AGENTES_FISICOS' | 'TECNICAS_MANUALES' | 'CINESITERAPIA';
  descripcion?: string;
}

export const CATALOGO_PRESCRIPCION_COMPLETO: ItemCatalogoPrescripcion[] = [
  { id: 'CHC', nombre: 'CHC (Compresas Húmedo Calientes)', categoria: 'AGENTES_FISICOS' },
  { id: 'CHF', nombre: 'CHF (Compresas Frías)', categoria: 'AGENTES_FISICOS' },
  { id: 'IR', nombre: 'IR (Infrarrojo)', categoria: 'AGENTES_FISICOS' },
  { id: 'US 1 MHz', nombre: 'US 1 MHz (Ultrasonido)', categoria: 'AGENTES_FISICOS' },
  { id: 'US 3 MHz', nombre: 'US 3 MHz (Ultrasonido)', categoria: 'AGENTES_FISICOS' },
  { id: 'TENS', nombre: 'TENS (Electroanalgesia)', categoria: 'AGENTES_FISICOS' },
  { id: 'INTERFERENCIAL', nombre: 'Interferencial', categoria: 'AGENTES_FISICOS' },
  { id: 'MAGNETOTERAPIA', nombre: 'Magnetoterapia', categoria: 'AGENTES_FISICOS' },
  { id: 'RAYOS LASER', nombre: 'Rayos Láser', categoria: 'AGENTES_FISICOS' },
  { id: 'ALTO VOLTAJE', nombre: 'Alto Voltaje', categoria: 'AGENTES_FISICOS' },
  { id: 'TERAPIA COMBINADA', nombre: 'Terapia Combinada', categoria: 'AGENTES_FISICOS' },
  { id: 'CONTRASTE', nombre: 'Baños de Contraste', categoria: 'AGENTES_FISICOS' },
  { id: 'MASOTERAPIA SUAVE', nombre: 'Masoterapia Suave', categoria: 'TECNICAS_MANUALES' },
  { id: 'MASOTERAPIA PROFUNDA', nombre: 'Masoterapia Profunda', categoria: 'TECNICAS_MANUALES' },
  { id: 'COLCHONETA', nombre: 'Colchoneta', categoria: 'TECNICAS_MANUALES' },
  { id: 'RUEDA HOMBRO', nombre: 'Rueda de Hombro', categoria: 'TECNICAS_MANUALES' },
  { id: 'PARALELA', nombre: 'Barras Paralelas', categoria: 'TECNICAS_MANUALES' },
  { id: 'BICICLETA', nombre: 'Bicicleta Estática', categoria: 'TECNICAS_MANUALES' },
  { id: 'ESCALERA RUSA', nombre: 'Escalera Rusa', categoria: 'TECNICAS_MANUALES' },
  { id: 'WILSON', nombre: 'Ejercicios Wilson', categoria: 'CINESITERAPIA' },
  { id: 'WILLIAMS', nombre: 'Ejercicios Williams', categoria: 'CINESITERAPIA' },
  { id: 'OTRO METODO', nombre: 'Otro Método', categoria: 'CINESITERAPIA' }
];
