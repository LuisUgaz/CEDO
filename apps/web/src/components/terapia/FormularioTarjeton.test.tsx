import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormularioTarjeton } from './FormularioTarjeton';
import type { Patient, TherapySheet } from '@cedo/shared';
import * as tarjetonService from '../../services/tarjeton.service';

const mockPaciente: Patient = {
  id: 'pac-1',
  nombre: 'María Elena Ramos',
  edad: 45,
  dni: '09876543',
  celular: '912345678',
  fechaIngreso: '2026-09-08',
  tipoConsulta: 'TERAPIA_FISICA',
  costoConsulta: 0,
  estadoTriage: 'atendido',
  color: 'color-amarillo',
  costoTerapia: 35,
  paqueteActivo: 1,
  createdAt: '2026-09-08T10:00:00Z',
  updatedAt: '2026-09-08T10:00:00Z'
};

const mockTarjetonInicial: TherapySheet = {
  id: 'tarj-1',
  pacienteId: 'pac-1',
  numeroPaquete: 1,
  fecha: '2026-09-08',
  tipoAtencion: 'PARTICULAR',
  diagnostico: 'Epicondilitis lateral derecha',
  sesionNumero: '1',
  tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS'],
  indicacionesAdicionales: ['Crioterapia post-ejercicio 10 min'],
  formatoImpresion: 'a6',
  updatedAt: '2026-09-08T10:00:00Z'
};

vi.mock('../../services/tarjeton.service', () => ({
  guardarTarjetonTratamiento: vi.fn(async (datos) => ({
    id: datos.id || 'tarj-guardado-123',
    ...datos,
    updatedAt: new Date().toISOString()
  })),
  obtenerTarjetonPorPaciente: vi.fn(async () => null),
  suscribirTarjetonPorPaciente: vi.fn(() => vi.fn())
}));

describe('FormularioTarjeton Component (Editor Reactivo de Prescripción Fisioterapéutica)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la información del paciente, diagnóstico y catálogo de técnicas', () => {
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
      />
    );

    expect(screen.getByText('María Elena Ramos')).toBeDefined();
    expect(screen.getByText(/09876543/)).toBeDefined();
    expect(screen.getByDisplayValue('Epicondilitis lateral derecha')).toBeDefined();
    expect(screen.getByText('Agentes Físicos')).toBeDefined();
  });

  it('debe permitir alternar el tipo de atención entre PARTICULAR y ASEGURADO', () => {
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
      />
    );

    const botonAsegurado = screen.getByRole('button', { name: /Asegurado/i });
    fireEvent.click(botonAsegurado);

    expect(botonAsegurado.getAttribute('data-active')).toBe('true');
  });

  it('debe permitir agregar y eliminar renglones dinámicos de indicaciones adicionales', () => {
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
      />
    );

    expect(screen.getByDisplayValue('Crioterapia post-ejercicio 10 min')).toBeDefined();

    const botonAgregarIndicacion = screen.getByRole('button', { name: /\+ Agregar Indicación/i });
    fireEvent.click(botonAgregarIndicacion);

    const inputsIndicaciones = screen.getAllByPlaceholderText(/Escriba una indicación médica o terapéutica/i);
    expect(inputsIndicaciones.length).toBe(2);

    // Escribir en la nueva indicación
    fireEvent.change(inputsIndicaciones[1], { target: { value: 'Ejercicios de estiramiento 3 veces al día' } });
    expect(inputsIndicaciones[1].getAttribute('value')).toBe('Ejercicios de estiramiento 3 veces al día');

    // Eliminar el primer renglón
    const botonesEliminar = screen.getAllByTestId('boton-eliminar-indicacion');
    fireEvent.click(botonesEliminar[0]);

    const inputsRestantes = screen.getAllByPlaceholderText(/Escriba una indicación médica o terapéutica/i);
    expect(inputsRestantes.length).toBe(1);
  });

  it('debe permitir seleccionar el formato de impresión del tarjetón (A6, A5, A4)', () => {
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
      />
    );

    const selectorFormato = screen.getByRole('combobox', { name: /Formato de Impresión/i }) as HTMLSelectElement;
    fireEvent.change(selectorFormato, { target: { value: 'a5' } });

    expect(selectorFormato.value).toBe('a5');
  });

  it('debe disparar el autoguardado reactivo al modificar la prescripción o diagnóstico', async () => {
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
      />
    );

    const inputDiagnostico = screen.getByDisplayValue('Epicondilitis lateral derecha');
    fireEvent.change(inputDiagnostico, { target: { value: 'Epicondilitis lateral bilateral' } });

    await waitFor(
      () => {
        expect(tarjetonService.guardarTarjetonTratamiento).toHaveBeenCalled();
      },
      { timeout: 1500 }
    );
  });

  it('debe llamar a onImprimir cuando se hace clic en el botón de impresión', () => {
    const onImprimirMock = vi.fn();
    render(
      <FormularioTarjeton
        paciente={mockPaciente}
        tarjetonInicial={mockTarjetonInicial}
        onImprimir={onImprimirMock}
      />
    );

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Tarjetón/i });
    fireEvent.click(botonImprimir);

    expect(onImprimirMock).toHaveBeenCalledTimes(1);
  });
});
