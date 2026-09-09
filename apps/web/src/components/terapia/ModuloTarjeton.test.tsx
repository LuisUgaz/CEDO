import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuloTarjeton } from './ModuloTarjeton';
import type { Patient } from '@cedo/shared';

const mockPaciente: Patient = {
  id: 'pac-99',
  nombre: 'Walter Santisteban',
  edad: 48,
  dni: '77665544',
  celular: '987112233',
  fechaIngreso: '2026-09-08',
  tipoConsulta: 'TERAPIA_FISICA',
  costoConsulta: 0,
  estadoTriage: 'atendido',
  color: 'color-amarillo',
  costoTerapia: 35,
  paqueteActivo: 1,
  createdAt: '2026-09-08T12:00:00Z',
  updatedAt: '2026-09-08T12:00:00Z'
};

vi.mock('../../services/pacientes.service', () => ({
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback([mockPaciente]);
    return vi.fn();
  }),
  actualizarEstadoTriage: vi.fn(async () => {})
}));

vi.mock('../../services/tarjeton.service', () => ({
  suscribirTarjetonPorPaciente: vi.fn((_id, callback) => {
    callback({
      id: 'tarj-99',
      pacienteId: 'pac-99',
      numeroPaquete: 1,
      fecha: '2026-09-08',
      tipoAtencion: 'PARTICULAR',
      diagnostico: 'Tendinitis Aquiliana',
      sesionNumero: '1',
      tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS'],
      indicacionesAdicionales: ['Elevación y crioterapia'],
      formatoImpresion: 'a6',
      updatedAt: '2026-09-08T12:00:00Z'
    });
    return vi.fn();
  }),
  obtenerTarjetonPorPaciente: vi.fn(async () => null),
  guardarTarjetonTratamiento: vi.fn(async (d) => ({ id: 'tarj-99', ...d }))
}));

describe('ModuloTarjeton Component (Módulo Unificado de Prescripción e Impresión de Tarjetón)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el encabezado institucional y el selector de pacientes', () => {
    render(<ModuloTarjeton />);

    expect(screen.getByText(/Prescripción Terapéutica y Tarjetón/i)).toBeDefined();
    expect(screen.getByText('Walter Santisteban')).toBeDefined();
    expect(screen.getByRole('button', { name: /Iniciar Evaluación/i })).toBeDefined();
  });

  it('debe abrir el formulario del tarjetón cuando se selecciona un paciente', () => {
    render(<ModuloTarjeton pacienteInicial={mockPaciente} />);

    expect(screen.getAllByText('Walter Santisteban').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByDisplayValue('Tendinitis Aquiliana')).toBeDefined();
    expect(screen.getByText('Agentes Físicos')).toBeDefined();
  });

  it('debe cambiar a la vista de impresión física al hacer clic en Imprimir Tarjetón', () => {
    render(<ModuloTarjeton pacienteInicial={mockPaciente} />);

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Tarjetón/i });
    fireEvent.click(botonImprimir);

    expect(screen.getByText(/TARJETÓN DE TRATAMIENTO/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Volver al Editor/i })).toBeDefined();

    // Volver al editor
    const botonVolver = screen.getByRole('button', { name: /Volver al Editor/i });
    fireEvent.click(botonVolver);

    expect(screen.getByDisplayValue('Tendinitis Aquiliana')).toBeDefined();
  });
});
