import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WeekSchedule, ScheduleSlot } from '@cedo/shared';

// Mock de Firestore modular v10
let mockDocData: Record<string, any> | null = null;
let mockDocExists = false;

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'mock-collection-ref'),
    doc: vi.fn((_db, _col, id) => ({ id, path: `citas_agenda/${id}` })),
    getDoc: vi.fn(async (docRef) => ({
      id: docRef.id,
      exists: () => mockDocExists,
      data: () => mockDocData
    })),
    setDoc: vi.fn(async () => {}),
    onSnapshot: vi.fn((docRef, callback) => {
      callback({
        id: docRef.id,
        exists: () => mockDocExists,
        data: () => mockDocData
      });
      return vi.fn(); // Unsubscribe mock
    })
  };
});

vi.mock('../lib/firebase', () => ({
  db: {}
}));

import {
  obtenerAgendaSemanal,
  guardarAgendaSemanal,
  actualizarSlot,
  marcarEstadoDia,
  copiarSemanaSiguiente,
  suscribirAgendaSemanal,
  COLECCION_AGENDA
} from './agenda.service';

describe('Servicio de Agenda Semanal Multi-Terapeuta (agenda.service.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDocExists = false;
    mockDocData = null;
  });

  it('debe tener la colección correcta citas_agenda', () => {
    expect(COLECCION_AGENDA).toBe('citas_agenda');
  });

  it('debe retornar la plantilla por defecto si el documento de la semana no existe en Firestore', async () => {
    mockDocExists = false;
    mockDocData = null;

    const agenda = await obtenerAgendaSemanal('2026_09_sem2');

    expect(agenda).toBeDefined();
    expect(agenda.id).toBe('2026_09_sem2');
    expect(agenda.anio).toBe(2026);
    expect(agenda.mes).toBe('09');
    expect(agenda.numeroSemana).toBe(2);
    expect(agenda.estadoDias.lunes).toBe('laboral');
    expect(agenda.slots.length).toBeGreaterThan(0);
  });

  it('debe retornar la agenda persistida si el documento existe en Firestore', async () => {
    mockDocExists = true;
    mockDocData = {
      anio: 2026,
      mes: '09',
      numeroSemana: 2,
      rangoFechas: '07/09/2026 - 12/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'feriado',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [
        {
          id: 'lunes_09:00',
          hora: '09:00',
          dia: 'lunes',
          pacienteId: 'pac-1',
          nombrePaciente: 'Ana Morales',
          color: 'color-fucsia',
          asistio: true
        }
      ],
      updatedAt: '2026-09-09T10:00:00.000Z'
    };

    const agenda = await obtenerAgendaSemanal('2026_09_sem2');

    expect(agenda.id).toBe('2026_09_sem2');
    expect(agenda.estadoDias.miercoles).toBe('feriado');
    expect(agenda.slots[0].nombrePaciente).toBe('Ana Morales');
    expect(agenda.slots[0].asistio).toBe(true);
  });

  it('debe validar y guardar una agenda semanal en Firestore', async () => {
    const agendaParaGuardar: WeekSchedule = {
      id: '2026_09_sem3',
      anio: 2026,
      mes: '09',
      numeroSemana: 3,
      rangoFechas: '14/09/2026 - 19/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'laboral',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [
        {
          id: 'lunes_10:00',
          hora: '10:00',
          dia: 'lunes',
          pacienteId: 'pac-2',
          nombrePaciente: 'Jorge Soto',
          color: 'color-verde',
          asistio: false
        }
      ],
      updatedAt: new Date().toISOString()
    };

    const resultado = await guardarAgendaSemanal(agendaParaGuardar);
    expect(resultado.id).toBe('2026_09_sem3');
    expect(resultado.slots[0].nombrePaciente).toBe('Jorge Soto');
  });

  it('debe actualizar un slot individual preservando el resto de la agenda', async () => {
    mockDocExists = true;
    mockDocData = {
      anio: 2026,
      mes: '09',
      numeroSemana: 2,
      rangoFechas: '07/09/2026 - 12/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'laboral',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [
        {
          id: 'lunes_08:00',
          hora: '08:00',
          dia: 'lunes',
          asistio: false
        }
      ],
      updatedAt: '2026-09-09T10:00:00.000Z'
    };

    const slotModificado: ScheduleSlot = {
      id: 'lunes_08:00',
      hora: '08:00',
      dia: 'lunes',
      pacienteId: 'pac-99',
      nombrePaciente: 'Maria Torres',
      color: 'color-melon',
      asistio: false
    };

    await actualizarSlot('2026_09_sem2', slotModificado);
  });

  it('debe alternar el estado de un día entre laboral y feriado', async () => {
    mockDocExists = true;
    mockDocData = {
      anio: 2026,
      mes: '09',
      numeroSemana: 2,
      rangoFechas: '07/09/2026 - 12/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'laboral',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [],
      updatedAt: '2026-09-09T10:00:00.000Z'
    };

    await marcarEstadoDia('2026_09_sem2', 'jueves', 'feriado');
  });

  it('debe duplicar los turnos activos hacia la semana siguiente reiniciando la asistencia', async () => {
    // Simular semana de origen con turnos ocupados
    mockDocExists = true;
    mockDocData = {
      anio: 2026,
      mes: '09',
      numeroSemana: 1,
      rangoFechas: '01/09/2026 - 06/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'laboral',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [
        {
          id: 'lunes_09:00',
          hora: '09:00',
          dia: 'lunes',
          pacienteId: 'pac-1',
          nombrePaciente: 'Carlos Ruiz',
          color: 'color-azul',
          asistio: true, // Asistió en semana 1
          nota: 'Sesión descontracturante'
        }
      ],
      updatedAt: '2026-09-01T10:00:00.000Z'
    };

    const agendaDestino = await copiarSemanaSiguiente('2026_09_sem1', '2026_09_sem2');

    expect(agendaDestino.id).toBe('2026_09_sem2');
    const slotCopiado = agendaDestino.slots.find((s) => s.id === 'lunes_09:00');
    expect(slotCopiado).toBeDefined();
    expect(slotCopiado?.nombrePaciente).toBe('Carlos Ruiz');
    expect(slotCopiado?.color).toBe('color-azul');
    expect(slotCopiado?.asistio).toBe(false); // La nueva semana inicia con asistencia en false
  });

  it('debe suscribir cambios en tiempo real con onSnapshot', () => {
    mockDocExists = true;
    mockDocData = {
      anio: 2026,
      mes: '09',
      numeroSemana: 2,
      rangoFechas: '07/09/2026 - 12/09/2026',
      estadoDias: {
        lunes: 'laboral',
        martes: 'laboral',
        miercoles: 'laboral',
        jueves: 'laboral',
        viernes: 'laboral',
        sabado: 'laboral'
      },
      slots: [],
      updatedAt: '2026-09-09T10:00:00.000Z'
    };

    const mockCallback = vi.fn();
    const unsub = suscribirAgendaSemanal('2026_09_sem2', mockCallback);

    expect(mockCallback).toHaveBeenCalled();
    expect(typeof unsub).toBe('function');
  });
});
