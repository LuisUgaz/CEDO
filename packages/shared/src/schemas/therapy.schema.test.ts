import { describe, it, expect } from 'vitest';
import {
  TherapySheetSchema,
  AttentionTypeSchema,
  PrintFormatSchema
} from './therapy.schema';

describe('TherapySheetSchema (Prescripción Terapéutica y Tarjetón A6/A5/A4)', () => {
  it('debe validar un tarjetón completo con prescripción de agentes físicos y formato A6', () => {
    const tarjetonValido = {
      id: 'tarj-100',
      pacienteId: 'pac-1',
      numeroPaquete: 1,
      fecha: '2026-09-08',
      tipoAtencion: 'PARTICULAR' as const,
      diagnostico: 'Tendinopatía de hombro derecho',
      sesionNumero: '1',
      tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS', 'MASOTERAPIA PROFUNDA'],
      indicacionesAdicionales: ['Aplicar hielo 10 min en caso de dolor agudo post-terapia'],
      formatoImpresion: 'a6' as const,
      updatedAt: '2026-09-08T10:00:00Z'
    };

    const resultado = TherapySheetSchema.safeParse(tarjetonValido);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.pacienteId).toBe('pac-1');
      expect(resultado.data.tipoAtencion).toBe('PARTICULAR');
      expect(resultado.data.formatoImpresion).toBe('a6');
      expect(resultado.data.tecnicasSeleccionadas).toHaveLength(4);
    }
  });

  it('debe aceptar un input sin ID asignando valores por defecto obligatorios', () => {
    const tarjetonMinimo = {
      pacienteId: 'pac-2',
      fecha: '2026-09-08',
      diagnostico: 'Lumbalgia mecánica'
    };

    const resultado = TherapySheetSchema.safeParse(tarjetonMinimo);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.numeroPaquete).toBe(1);
      expect(resultado.data.tipoAtencion).toBe('PARTICULAR');
      expect(resultado.data.formatoImpresion).toBe('a6');
      expect(resultado.data.tecnicasSeleccionadas).toEqual([]);
      expect(resultado.data.indicacionesAdicionales).toEqual([]);
    }
  });

  it('debe rechazar una ficha si pacienteId está ausente o vacío', () => {
    const tarjetonSinPaciente = {
      pacienteId: '',
      fecha: '2026-09-08',
      diagnostico: 'Cervicalgia'
    };

    const resultado = TherapySheetSchema.safeParse(tarjetonSinPaciente);
    expect(resultado.success).toBe(false);
  });

  it('debe rechazar si la fecha no tiene formato YYYY-MM-DD', () => {
    const tarjetonFechaInvalida = {
      pacienteId: 'pac-3',
      fecha: '08/09/2026',
      diagnostico: 'Gonartrosis'
    };

    const resultado = TherapySheetSchema.safeParse(tarjetonFechaInvalida);
    expect(resultado.success).toBe(false);
  });

  it('debe validar los tipos de atención Asegurado y Particular', () => {
    expect(AttentionTypeSchema.safeParse('ASEGURADO').success).toBe(true);
    expect(AttentionTypeSchema.safeParse('PARTICULAR').success).toBe(true);
    expect(AttentionTypeSchema.safeParse('OTRO').success).toBe(false);
  });

  it('debe validar los formatos de impresión soportados: a6, a5 y a4-terapia', () => {
    expect(PrintFormatSchema.safeParse('a6').success).toBe(true);
    expect(PrintFormatSchema.safeParse('a5').success).toBe(true);
    expect(PrintFormatSchema.safeParse('a4-terapia').success).toBe(true);
    expect(PrintFormatSchema.safeParse('carta').success).toBe(false);
  });

  it('debe contener el catálogo de prescripción completo con sus 3 categorías', async () => {
    const { CATALOGO_PRESCRIPCION_COMPLETO } = await import('./therapy.schema');
    expect(CATALOGO_PRESCRIPCION_COMPLETO.length).toBeGreaterThanOrEqual(20);
    
    const agentes = CATALOGO_PRESCRIPCION_COMPLETO.filter(item => item.categoria === 'AGENTES_FISICOS');
    const manuales = CATALOGO_PRESCRIPCION_COMPLETO.filter(item => item.categoria === 'TECNICAS_MANUALES');
    const cinesiterapia = CATALOGO_PRESCRIPCION_COMPLETO.filter(item => item.categoria === 'CINESITERAPIA');

    expect(agentes.length).toBeGreaterThanOrEqual(10);
    expect(manuales.length).toBeGreaterThanOrEqual(5);
    expect(cinesiterapia.length).toBeGreaterThanOrEqual(3);

    expect(agentes.some(a => a.id === 'CHC')).toBe(true);
    expect(agentes.some(a => a.id === 'US 1 MHz')).toBe(true);
    expect(agentes.some(a => a.id === 'TENS')).toBe(true);
    expect(manuales.some(m => m.id === 'MASOTERAPIA PROFUNDA')).toBe(true);
    expect(cinesiterapia.some(c => c.id === 'WILLIAMS')).toBe(true);
  });

  it('debe validar un paquete de terapias con PackageAttendanceSchema y TherapyPackageSchema', async () => {
    const { PackageAttendanceSchema, TherapyPackageSchema } = await import('./therapy.schema');

    const asistenciaValida = {
      sesionNumero: 1,
      asistio: true,
      fechaAsistencia: '2026-09-08',
      boletaEmitida: true,
      numeroBoleta: 'B001-123'
    };
    expect(PackageAttendanceSchema.safeParse(asistenciaValida).success).toBe(true);

    const paqueteValido = {
      id: 'paq-1',
      pacienteId: 'pac-1',
      numeroPaquete: 1,
      costoTotal: 350,
      costoPorTerapia: 35,
      costoConsulta: 50,
      boletaConsultaEmitida: true,
      sesionesTotales: 10,
      sesiones: [asistenciaValida],
      totalPagado: 350,
      saldoRestante: 0,
      activo: true,
      createdAt: '2026-09-08T08:00:00Z',
      updatedAt: '2026-09-08T08:00:00Z'
    };
    expect(TherapyPackageSchema.safeParse(paqueteValido).success).toBe(true);
  });
});
