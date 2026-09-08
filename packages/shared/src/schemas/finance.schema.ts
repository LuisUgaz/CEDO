import { z } from 'zod';

export const TransactionTypeSchema = z.enum([
  'abono_paquete',
  'consulta',
  'ingreso_manual',
  'egreso_manual'
]);

export const PaymentMethodSchema = z.enum([
  'efectivo',
  'yape',
  'plin',
  'transferencia',
  'tarjeta'
]);

export const PaymentTransactionSchema = z.object({
  id: z.string().min(1),
  pacienteId: z.string().nullable().optional(),
  nombrePaciente: z.string().optional(),
  numeroPaquete: z.number().int().nullable().optional(),
  tipo: TransactionTypeSchema,
  monto: z.number().positive('El monto debe ser un valor positivo'),
  metodoPago: PaymentMethodSchema,
  boletaEmitida: z.boolean().default(false),
  numeroBoleta: z.string().nullable().optional(),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string(),
  registradoPor: z.string().min(1),
  createdAt: z.string()
});
