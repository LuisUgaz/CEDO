import { z } from 'zod';

export const PatientColorSchema = z.enum([
  'color-fucsia',
  'color-melon',
  'color-verde',
  'color-amarillo',
  'color-azul',
  'color-anaranjado'
]);

export const ConsultationTypeSchema = z.enum([
  'PRE_CONSULTA',
  'CONSULTA_MEDICA',
  'EVALUACION_FISIOTERAPEUTICA',
  'TERAPIA_DIRECTA',
  'pre-consulta',
  'post-consulta',
  'no'
]);

export const TriageStatusSchema = z.enum([
  'en_espera',
  'en_evaluacion',
  'atendido'
]);

export const PatientSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  edad: z.number().int().min(0, 'La edad no puede ser negativa').max(125, 'Edad no válida'),
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos numéricos'),
  celular: z.string().trim().min(9, 'El celular debe tener al menos 9 dígitos'),
  fechaIngreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  dniApoderado: z.string().regex(/^\d{8}$/, 'El DNI de apoderado debe tener 8 dígitos').nullable().optional(),
  nombreApoderado: z.string().nullable().optional(),
  tipoConsulta: ConsultationTypeSchema.default('PRE_CONSULTA'),
  tieneConsulta: ConsultationTypeSchema.optional().default('pre-consulta'),
  costoConsulta: z.number().min(0, 'El costo no puede ser negativo').default(50),
  estadoTriage: TriageStatusSchema.default('en_espera'),
  color: PatientColorSchema.default('color-verde'),
  costoTerapia: z.number().min(0).default(35),
  paqueteActivo: z.number().int().min(1).default(1),
  ocupacion: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).refine(data => {
  // Regla de Negocio: Si la edad es menor a 18 años, el DNI y nombre de apoderado son obligatorios
  if (data.edad < 18) {
    const tieneDniValido = !!data.dniApoderado && /^\d{8}$/.test(data.dniApoderado);
    return tieneDniValido;
  }
  return true;
}, {
  message: 'Para pacientes menores de 18 años, el DNI de apoderado es obligatorio y debe tener 8 dígitos',
  path: ['dniApoderado']
}).refine(data => {
  if (data.edad < 18) {
    return !!data.nombreApoderado && data.nombreApoderado.trim().length >= 3;
  }
  return true;
}, {
  message: 'Para pacientes menores de 18 años, el nombre de apoderado es obligatorio',
  path: ['nombreApoderado']
});

export type PatientInput = z.infer<typeof PatientSchema>;
