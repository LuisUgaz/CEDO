import { z } from 'zod';

export const AttentionTypeSchema = z.enum(['ASEGURADO', 'PARTICULAR']);

export const PrintFormatSchema = z.enum(['a6', 'a5', 'a4-terapia']);

export const TherapySheetSchema = z.object({
  id: z.string().min(1),
  pacienteId: z.string().min(1),
  numeroPaquete: z.number().int().min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipoAtencion: AttentionTypeSchema.default('PARTICULAR'),
  diagnostico: z.string().default(''),
  sesionNumero: z.string().optional(),
  tecnicasSeleccionadas: z.array(z.string()).default([]),
  indicacionesAdicionales: z.array(z.string()).default([]),
  formatoImpresion: PrintFormatSchema.default('a6'),
  updatedAt: z.string()
});

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
