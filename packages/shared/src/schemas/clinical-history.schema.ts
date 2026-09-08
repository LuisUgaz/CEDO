import { z } from 'zod';

export const ClinicalFieldTypeSchema = z.enum(['texto', 'texto_largo', 'numero']);

export const CustomClinicalFieldSchema = z.object({
  id: z.string().min(1, 'El ID del campo no puede estar vacío'),
  nombre: z.string().trim().min(2, 'El nombre del campo debe tener al menos 2 caracteres'),
  tipo: ClinicalFieldTypeSchema.default('texto_largo'),
  valor: z.string().default('')
});

export const ClinicalHistorySchema = z.object({
  id: z.string().optional(),
  pacienteId: z.string().min(1, 'El ID del paciente es obligatorio'),
  fechaEvaluacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  medicoEvaluador: z.string().nullable().optional(),
  motivoConsulta: z.string().trim().min(3, 'El motivo de consulta debe tener al menos 3 caracteres'),
  antecedentes: z.string().nullable().optional().default(''),
  evaluacionFisica: z.string().nullable().optional().default(''),
  diagnostico: z.string().trim().min(3, 'El diagnóstico clínico (DX) es obligatorio y debe tener al menos 3 caracteres'),
  planTratamiento: z.string().trim().min(3, 'El plan de tratamiento o prescripción es obligatorio'),
  camposDinamicos: z.array(CustomClinicalFieldSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ClinicalHistoryInput = z.input<typeof ClinicalHistorySchema>;
export type ClinicalHistoryValidated = z.output<typeof ClinicalHistorySchema>;
