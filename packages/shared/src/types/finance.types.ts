export type TransactionType =
  | 'abono_paquete'
  | 'consulta'
  | 'ingreso_manual'
  | 'egreso_manual';

export type PaymentMethod =
  | 'efectivo'
  | 'yape'
  | 'plin'
  | 'transferencia'
  | 'tarjeta';

export interface PaymentTransaction {
  id: string;
  pacienteId?: string | null;
  nombrePaciente?: string;
  numeroPaquete?: number | null;
  tipo: TransactionType;
  monto: number;
  metodoPago: PaymentMethod;
  boletaEmitida: boolean;
  numeroBoleta?: string | null;
  descripcion: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm:ss
  registradoPor: string;
  createdAt: string;
}

export interface DailyCashSummary {
  fecha: string;
  totalConsultas: number;
  totalPaquetes: number;
  totalIngresosManuales: number;
  totalEgresos: number;
  totalNeto: number;
  transacciones: PaymentTransaction[];
}
