import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuloHistoriaClinica } from './ModuloHistoriaClinica';
import type { Patient } from '@cedo/shared';

const mockPaciente: Patient = {
  id: 'pac-42',
  nombre: 'Eduardo Vega',
  edad: 42,
  dni: '88776655',
  celular: '998877665',
  fechaIngreso: '2026-09-08',
  tipoConsulta: 'CONSULTA_MEDICA',
  costoConsulta: 50,
  estadoTriage: 'en_espera',
  color: 'color-verde',
  costoTerapia: 35,
  paqueteActivo: 1,
  createdAt: '2026-09-08T11:00:00Z',
  updatedAt: '2026-09-08T11:00:00Z'
};

vi.mock('../../services/pacientes.service', () => ({
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback([mockPaciente]);
    return vi.fn();
  }),
  actualizarEstadoTriage: vi.fn(async () => {})
}));

vi.mock('../../services/historiaClinica.service', () => ({
  suscribirHistoriaClinica: vi.fn((_id, callback) => {
    callback(null);
    return vi.fn();
  }),
  obtenerHistoriaClinicaPorPaciente: vi.fn(async () => null),
  guardarHistoriaClinica: vi.fn(async (d) => ({ id: 'h-1', ...d })),
  finalizarEvaluacionMedica: vi.fn(async () => {})
}));

describe('ModuloHistoriaClinica Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el selector de pacientes en espera por defecto', () => {
    render(<ModuloHistoriaClinica />);

    expect(screen.getByText(/Historia Clínica e Informe Médico/i)).toBeDefined();
    expect(screen.getByText('Eduardo Vega')).toBeDefined();
    expect(screen.getByRole('button', { name: /Iniciar Evaluación/i })).toBeDefined();
  });

  it('debe abrir el formulario de historia clínica cuando se selecciona un paciente', () => {
    render(<ModuloHistoriaClinica pacienteInicial={mockPaciente} />);

    expect(screen.getByText('Eduardo Vega')).toBeDefined();
    expect(screen.getByLabelText(/Motivo de Consulta/i)).toBeDefined();
    expect(screen.getByLabelText(/Diagnóstico Médico \(DX\)/i)).toBeDefined();
  });

  it('debe cambiar a la vista de impresión A4 institucional al hacer clic en imprimir', () => {
    render(<ModuloHistoriaClinica pacienteInicial={mockPaciente} />);

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Ficha \(A4\)/i });
    fireEvent.click(botonImprimir);

    expect(screen.getAllByText(/CEDO-REHAB E\.I\.R\.L\./i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Volver a la Ficha/i })).toBeDefined();
  });
});
