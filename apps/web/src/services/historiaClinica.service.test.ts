import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ClinicalHistoryInput } from '@cedo/shared';

// Mock de Firestore modular
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'mock-collection-ref'),
    doc: vi.fn((_db, _col, id) => ({ id, path: `historias_clinicas/${id}` })),
    addDoc: vi.fn(async (_colRef, data) => ({
      id: 'mock-historia-123',
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
          id: 'mock-historia-123',
          data: () => ({
            pacienteId: 'pac-1',
            fechaEvaluacion: '2026-09-08',
            medicoEvaluador: 'Dr. Fernando Salazar',
            motivoConsulta: 'Dolor en rodilla izquierda',
            antecedentes: 'Sin antecedentes relevantes',
            evaluacionFisica: 'Cajón anterior negativo, dolor a la flexión forzada',
            diagnostico: 'Meniscopatía medial izquierda',
            planTratamiento: '10 sesiones de magnetoterapia y fortalecimiento de cuádriceps',
            camposDinamicos: [
              {
                id: 'c-1',
                nombre: 'Escala EVA',
                tipo: 'numero',
                valor: '6'
              }
            ],
            createdAt: '2026-09-08T10:00:00.000Z',
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
            id: 'mock-historia-123',
            data: () => ({
              pacienteId: 'pac-1',
              fechaEvaluacion: '2026-09-08',
              medicoEvaluador: 'Dr. Fernando Salazar',
              motivoConsulta: 'Dolor en rodilla izquierda',
              antecedentes: '',
              evaluacionFisica: '',
              diagnostico: 'Meniscopatía medial izquierda',
              planTratamiento: 'Fisioterapia',
              camposDinamicos: [],
              createdAt: '2026-09-08T10:00:00.000Z',
              updatedAt: '2026-09-08T10:00:00.000Z'
            })
          }
        ]
      });
      return vi.fn(); // Mock de función desuscribir
    })
  };
});

vi.mock('../lib/firebase', () => ({
  db: { app: 'mock-app' },
  getFirestoreDb: vi.fn(() => ({ app: 'mock-app' }))
}));

// Mock del servicio de pacientes para la función finalizarEvaluacionMedica
vi.mock('./pacientes.service', () => ({
  actualizarEstadoTriage: vi.fn(async () => {})
}));

import {
  guardarHistoriaClinica,
  obtenerHistoriaClinicaPorPaciente,
  suscribirHistoriaClinica,
  finalizarEvaluacionMedica
} from './historiaClinica.service';
import { addDoc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { actualizarEstadoTriage } from './pacientes.service';

describe('Servicio de Historia Clínica y Evaluaciones (historiaClinica.service.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear y guardar una nueva historia clínica en Firestore cuando no tiene ID previo', async () => {
    const inputNuevaHistoria: ClinicalHistoryInput = {
      pacienteId: 'pac-1',
      fechaEvaluacion: '2026-09-08',
      medicoEvaluador: 'Dr. Salazar',
      motivoConsulta: 'Lumbalgia aguda con irradiación',
      antecedentes: 'Sedentarismo prolongado',
      evaluacionFisica: 'Lasegue positivo a 45°',
      diagnostico: 'Lumbociática aguda L5-S1',
      planTratamiento: '10 sesiones de fisioterapia y TENS',
      camposDinamicos: [
        {
          id: 'cd-1',
          nombre: 'Grados Lasegue',
          tipo: 'numero',
          valor: '45'
        }
      ]
    };

    const resultado = await guardarHistoriaClinica(inputNuevaHistoria);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(resultado.id).toBe('mock-historia-123');
    expect(resultado.pacienteId).toBe('pac-1');
    expect(resultado.diagnostico).toBe('Lumbociática aguda L5-S1');
    expect(resultado.camposDinamicos).toHaveLength(1);
  });

  it('debe actualizar una historia clínica existente mediante setDoc cuando se provee un ID', async () => {
    const inputActualizacion: ClinicalHistoryInput = {
      id: 'mock-historia-existente-999',
      pacienteId: 'pac-1',
      fechaEvaluacion: '2026-09-08',
      motivoConsulta: 'Control de evolución',
      diagnostico: 'Lumbociática en remisión',
      planTratamiento: 'Continuar ejercicios de fortalecimiento'
    };

    const resultado = await guardarHistoriaClinica(inputActualizacion);

    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(resultado.id).toBe('mock-historia-existente-999');
    expect(resultado.diagnostico).toBe('Lumbociática en remisión');
  });

  it('debe rechazar el guardado si los datos no cumplen el esquema de validación Zod', async () => {
    const inputInvalido = {
      pacienteId: '',
      fechaEvaluacion: 'fecha-incorrecta',
      motivoConsulta: 'no',
      diagnostico: '',
      planTratamiento: ''
    } as any;

    await expect(guardarHistoriaClinica(inputInvalido)).rejects.toThrow();
  });

  it('debe obtener la historia clínica de un paciente por su pacienteId', async () => {
    const historia = await obtenerHistoriaClinicaPorPaciente('pac-1');

    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(historia).not.toBeNull();
    expect(historia?.pacienteId).toBe('pac-1');
    expect(historia?.diagnostico).toBe('Meniscopatía medial izquierda');
  });

  it('debe permitir suscribirse en tiempo real a la historia clínica de un paciente', () => {
    const callbackMock = vi.fn();
    const desuscribir = suscribirHistoriaClinica('pac-1', callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pacienteId: 'pac-1',
        diagnostico: 'Meniscopatía medial izquierda'
      })
    );
    expect(typeof desuscribir).toBe('function');
  });

  it('debe retornar null cuando un paciente no tiene historia clínica registrada', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({
      empty: true,
      docs: []
    } as any);

    const historia = await obtenerHistoriaClinicaPorPaciente('pac-sin-historia');
    expect(historia).toBeNull();
  });

  it('debe notificar null en la suscripción si no existe historia previa', () => {
    const callbackMock = vi.fn();
    vi.mocked(onSnapshot).mockImplementationOnce((_query: any, callback: any) => {
      callback({
        empty: true,
        docs: []
      });
      return vi.fn();
    });

    suscribirHistoriaClinica('pac-sin-historia', callbackMock);
    expect(callbackMock).toHaveBeenCalledWith(null);
  });

  it('debe finalizar la evaluación médica actualizando el estado de triage a "atendido"', async () => {
    await finalizarEvaluacionMedica('pac-1');

    expect(actualizarEstadoTriage).toHaveBeenCalledWith('pac-1', 'atendido');
  });
});
