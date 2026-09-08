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
  'pre-consulta',
  'post-consulta',
  'no'
]);

export const PatientSchema = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  nombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  edad: z.number().int().min(0, 'La edad no puede ser negativa').max(125, 'Edad no válida'),
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos numéricos'),
  celular: z.string().trim().min(9, 'El celular debe tener al menos 9 dígitos'),
  fechaIngreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  dniApoderado: z.string().regex(/^\d{8}$/, 'El DNI de apoderado debe tener 8 dígitos').nullable().optional(),
  nombreApoderado: z.string().nullable().optional(),
  tieneConsulta: ConsultationTypeSchema.default('no'),
  costoConsulta: z.number().min(0, 'El costo no puede ser negativo').default(50),
  color: PatientColorSchema.default('color-verde'),
  costoTerapia: z.number().min(0).default(35),
  paqueteActivo: z.number().int().min(1).default(1),
  createdAt: z.string(),
  updatedAt: z.string()
}).refine(data => {
  // Regla de Negocio: Si la edad es menor a 18 años, el DNI de apoderado es obligatorio
  if (data.edad < 18) {
    return !!data.dniApoderado && /^\d{8}$/.test(data.dniApoderado);
  }
  return true;
}, {
  message: 'Para pacientes menores de 18 años, el DNI de apoderado es obligatorio y debe tener 8 dígitos',
  path: ['dniApoderado']
});

export type PatientInput = z.infer<typeof PatientSchema>;
