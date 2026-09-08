import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PatientInput } from '@cedo/shared';

// Mock de Firestore modular
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'mock-collection-ref'),
    doc: vi.fn((_db, _col, id) => ({ id, path: `pacientes/${id}` })),
    addDoc: vi.fn(async (_colRef, data) => ({
      id: 'mock-doc-id-123',
      ...data
    })),
    setDoc: vi.fn(async () => {}),
    updateDoc: vi.fn(async () => {}),
    query: vi.fn((...args) => ({ args })),
    where: vi.fn((field, op, value) => ({ field, op, value })),
    orderBy: vi.fn((field, dir) => ({ field, dir })),
    getDocs: vi.fn(async () => ({
      docs: [
        {
          id: 'pac-1',
          data: () => ({
            nombre: 'Juan Perez',
            edad: 25,
            dni: '12345678',
            celular: '987654321',
            fechaIngreso: '2026-09-08',
            tipoConsulta: 'PRE_CONSULTA',
            costoConsulta: 50,
            estadoTriage: 'en_espera',
            color: 'color-verde',
            costoTerapia: 35,
            paqueteActivo: 1,
            createdAt: '2026-09-08T10:00:00.000Z',
            updatedAt: '2026-09-08T10:00:00.000Z'
          })
        }
      ]
    })),
    onSnapshot: vi.fn((_query, callback) => {
      callback({
        docs: [
          {
            id: 'pac-1',
            data: () => ({
              nombre: 'Juan Perez',
              edad: 25,
              dni: '12345678',
              celular: '987654321',
              fechaIngreso: '2026-09-08',
              tipoConsulta: 'PRE_CONSULTA',
              costoConsulta: 50,
              estadoTriage: 'en_espera',
              color: 'color-verde',
              costoTerapia: 35,
              paqueteActivo: 1,
              createdAt: '2026-09-08T10:00:00.000Z',
              updatedAt: '2026-09-08T10:00:00.000Z'
            })
          }
        ]
      });
      return vi.fn(); // Unsubscribe mock
    })
  };
});

vi.mock('../lib/firebase', () => ({
  db: { app: 'mock-app' },
  getFirestoreDb: vi.fn(() => ({ app: 'mock-app' }))
}));

describe('Servicio de Pacientes y Triage (pacientes.service.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar un nuevo paciente adulto en Firestore con estadoTriage en_espera', async () => {
    const { crearPaciente } = await import('./pacientes.service');
    const { addDoc } = await import('firebase/firestore');

    const nuevoPaciente: PatientInput = {
      nombre: 'Carlos Mendoza',
      edad: 32,
      dni: '45678912',
      celular: '912345678',
      fechaIngreso: '2026-09-08',
      tipoConsulta: 'PRE_CONSULTA',
      costoConsulta: 50,
      color: 'color-verde',
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tieneConsulta: 'pre-consulta'
    };

    const resultado = await crearPaciente(nuevoPaciente);

    expect(addDoc).toHaveBeenCalled();
    expect(resultado).toBeDefined();
    expect(resultado.id).toBe('mock-doc-id-123');
    expect(resultado.estadoTriage).toBe('en_espera');
    expect(resultado.nombre).toBe('Carlos Mendoza');
  });

  it('debe validar la regla de minoridad al registrar un paciente menor de 18 años', async () => {
    const { crearPaciente } = await import('./pacientes.service');

    // Menor de 18 años sin apoderado debe lanzar error de validación
    const menorInvalido: PatientInput = {
      nombre: 'Lucia Diaz',
      edad: 15,
      dni: '87654321',
      celular: '912345678',
      fechaIngreso: '2026-09-08',
      tipoConsulta: 'CONSULTA_MEDICA',
      costoConsulta: 50,
      color: 'color-melon',
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await expect(crearPaciente(menorInvalido)).rejects.toThrow();
  });

  it('debe permitir registrar a un menor de 18 años si cuenta con apoderado y DNI de 8 dígitos', async () => {
    const { crearPaciente } = await import('./pacientes.service');
    const { addDoc } = await import('firebase/firestore');

    const menorValido: PatientInput = {
      nombre: 'Mateo Sanchez',
      edad: 10,
      dni: '76543210',
      celular: '912345678',
      fechaIngreso: '2026-09-08',
      dniApoderado: '09876543',
      nombreApoderado: 'Patricia Gomez (Madre)',
      tipoConsulta: 'EVALUACION_FISIOTERAPEUTICA',
      costoConsulta: 50,
      color: 'color-melon',
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const resultado = await crearPaciente(menorValido);

    expect(addDoc).toHaveBeenCalled();
    expect(resultado.dniApoderado).toBe('09876543');
    expect(resultado.nombreApoderado).toBe('Patricia Gomez (Madre)');
  });

  it('debe listar pacientes en espera mediante getDocs', async () => {
    const { listarPacientesEnEspera } = await import('./pacientes.service');
    const pacientes = await listarPacientesEnEspera();

    expect(pacientes.length).toBeGreaterThan(0);
    expect(pacientes[0].estadoTriage).toBe('en_espera');
    expect(pacientes[0].nombre).toBe('Juan Perez');
  });

  it('debe suscribirse a la cola de triage en tiempo real mediante onSnapshot', async () => {
    const { suscribirPacientesEnEspera } = await import('./pacientes.service');
    const callback = vi.fn();

    const unsubscribe = suscribirPacientesEnEspera(callback);

    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Juan Perez',
          estadoTriage: 'en_espera'
        })
      ])
    );
    expect(typeof unsubscribe).toBe('function');
  });

  it('debe actualizar el estado de triage de un paciente', async () => {
    const { actualizarEstadoTriage } = await import('./pacientes.service');
    const { updateDoc } = await import('firebase/firestore');

    await actualizarEstadoTriage('pac-1', 'en_evaluacion');

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pac-1' }),
      expect.objectContaining({
        estadoTriage: 'en_evaluacion',
        updatedAt: expect.any(String)
      })
    );
  });
});
