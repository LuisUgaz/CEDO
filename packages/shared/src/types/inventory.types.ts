export interface InventoryItem {
  id: string;
  nombre: string;
  cantidad: number;
  imagen?: string | null;
  categoria?: string | null;
  stockMinimo?: number;
  updatedAt: string;
}

export interface SaturdayCount {
  sabado1?: number | null;
  sabado2?: number | null;
  sabado3?: number | null;
  sabado4?: number | null;
}

export interface MonthlyInventoryAudit {
  id: string; // ej: "2026_agosto"
  anio: number;
  mes: string;
  conteosPorItem: Record<string, SaturdayCount>;
  observaciones?: string;
  updatedAt: string;
}
