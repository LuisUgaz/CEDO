import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TherapySheetInput, TherapySheet } from '@cedo/shared';

// Mock de Firestore modular v10
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'mock-collection-ref'),
    doc: vi.fn((_db, _col, id) => ({ id, path: `tarjetones_tratamiento/${id}` })),
    addDoc: vi.fn(async (_colRef, data) => ({
      id: 'mock-tarjeton-100',
      ...data
    })),
    setDoc: vi.fn(async () => {}),
    updateDoc: vi.fn(async () => {}),
    query: vi.fn((...args) => ({ args })),
    where: vi.fn((field, op, value) => ({ field, op, value })),
    orderBy: vi.fn((field, dir) => ({ field, dir })),
    limit: vi.fn((num) => ({ limit: num })),
    getDocs: vi.fn(async () => ({
      empty: false,
      docs: [
        {
          id: 'mock-tarjeton-100',
          data: () => ({
            pacienteId: 'pac-1',
            numeroPaquete: 1,
            fecha: '2026-09-08',
            tipoAtencion: 'PARTICULAR',
            diagnostico: 'Tendinopatía manguito rotador',
            sesionNumero: '1',
            tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS'],
            indicacionesAdicionales: ['Evitar cargas pesadas'],
            formatoImpresion: 'a6',
            updatedAt: '2026-09-08T10:00:00.000Z'
          })
        }
      ]
    })),
    onSnapshot: vi.fn((_query, callback) => {
      callback({
        empty: false,
        docs: [
          {
            id: 'mock-tarjeton-100',
            data: () => ({
              pacienteId: 'pac-1',
              numeroPaquete: 1,
              fecha: '2026-09-08',
              tipoAtencion: 'PARTICULAR',
              diagnostico: 'Tendinopatía manguito rotador',
              sesionNumero: '1',
              tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS'],
              indicacionesAdicionales: ['Evitar cargas pesadas'],
              formatoImpresion: 'a6',
              updatedAt: '2026-09-08T10:00:00.000Z'
            })
          }
        ]
      });
      return vi.fn(); // Mock función de desuscripción
    })
  };
});

vi.mock('../lib/firebase', () => ({
  db: { app: 'mock-app' },
  getFirestoreDb: vi.fn(() => ({ app: 'mock-app' }))
}));

import {
  guardarTarjetonTratamiento,
  obtenerTarjetonPorPaciente,
  suscribirTarjetonPorPaciente
} from './tarjeton.service';
import { addDoc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';

describe('Servicio de Tarjetón de Tratamiento Fisioterapéutico (tarjeton.service.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar un nuevo tarjetón en Firestore cuando no tiene ID previo', async () => {
    const nuevoTarjeton: TherapySheetInput = {
      pacienteId: 'pac-1',
      numeroPaquete: 1,
      fecha: '2026-09-08',
      tipoAtencion: 'PARTICULAR',
      diagnostico: 'Cervicobraquialgia derecha',
      tecnicasSeleccionadas: ['CHC', 'TENS', 'MASOTERAPIA SUAVE'],
      indicacionesAdicionales: ['Reposo post terapia 15 min'],
      formatoImpresion: 'a6'
    };

    const resultado = await guardarTarjetonTratamiento(nuevoTarjeton);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(resultado.id).toBe('mock-tarjeton-100');
    expect(resultado.pacienteId).toBe('pac-1');
    expect(resultado.tipoAtencion).toBe('PARTICULAR');
    expect(resultado.tecnicasSeleccionadas).toContain('CHC');
  });

  it('debe actualizar un tarjetón existente vía setDoc cuando se provee un ID', async () => {
    const tarjetonExistente: TherapySheetInput = {
      id: 'mock-tarjeton-existente-55',
      pacienteId: 'pac-1',
      numeroPaquete: 1,
      fecha: '2026-09-08',
      tipoAtencion: 'ASEGURADO',
      diagnostico: 'Cervicobraquialgia derecha en mejoría',
      tecnicasSeleccionadas: ['CHC', 'TENS'],
      indicacionesAdicionales: [],
      formatoImpresion: 'a5'
    };

    const resultado = await guardarTarjetonTratamiento(tarjetonExistente);

    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(resultado.id).toBe('mock-tarjeton-existente-55');
    expect(resultado.tipoAtencion).toBe('ASEGURADO');
    expect(resultado.formatoImpresion).toBe('a5');
  });

  it('debe rechazar el guardado si no cumple las reglas de validación Zod', async () => {
    const tarjetonInvalido = {
      pacienteId: '',
      fecha: '08/09/2026',
      tipoAtencion: 'OTRO_INVALIDO'
    } as any;

    await expect(guardarTarjetonTratamiento(tarjetonInvalido)).rejects.toThrow();
  });

  it('debe obtener el tarjetón activo de un paciente por su pacienteId', async () => {
    const tarjeton = await obtenerTarjetonPorPaciente('pac-1');

    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(tarjeton).not.toBeNull();
    expect(tarjeton?.pacienteId).toBe('pac-1');
    expect(tarjeton?.diagnostico).toBe('Tendinopatía manguito rotador');
  });

  it('debe retornar null cuando un paciente no tiene tarjetón registrado', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({
      empty: true,
      docs: []
    } as any);

    const tarjeton = await obtenerTarjetonPorPaciente('paciente-sin-tarjeton');
    expect(tarjeton).toBeNull();
  });

  it('debe permitir suscribirse en tiempo real al tarjetón de un paciente', () => {
    const callbackMock = vi.fn();
    const desuscribir = suscribirTarjetonPorPaciente('pac-1', callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pacienteId: 'pac-1',
        diagnostico: 'Tendinopatía manguito rotador'
      })
    );
    expect(typeof desuscribir).toBe('function');
  });

  it('debe emitir null en la suscripción en tiempo real si el snapshot está vacío', () => {
    const callbackMock = vi.fn();
    vi.mocked(onSnapshot).mockImplementationOnce((_query: any, callback: any) => {
      callback({
        empty: true,
        docs: []
      });
      return vi.fn();
    });

    suscribirTarjetonPorPaciente('paciente-vacio', callbackMock);
    expect(callbackMock).toHaveBeenCalledWith(null);
  });
});
