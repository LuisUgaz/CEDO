import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImpresionTarjeton } from './ImpresionTarjeton';
import type { Patient, TherapySheet } from '@cedo/shared';

const mockPaciente: Patient = {
  id: 'pac-1',
  nombre: 'Rosa Luz Quispe',
  edad: 52,
  dni: '12345678',
  celular: '998877665',
  fechaIngreso: '2026-09-08',
  tipoConsulta: 'TERAPIA_FISICA',
  costoConsulta: 0,
  estadoTriage: 'atendido',
  color: 'color-verde',
  costoTerapia: 35,
  paqueteActivo: 2,
  createdAt: '2026-09-08T10:00:00Z',
  updatedAt: '2026-09-08T10:00:00Z'
};

const mockTarjeton: TherapySheet = {
  id: 'tarj-100',
  pacienteId: 'pac-1',
  numeroPaquete: 2,
  fecha: '2026-09-08',
  tipoAtencion: 'PARTICULAR',
  diagnostico: 'Gonartrosis bilateral grado II',
  sesionNumero: '1',
  tecnicasSeleccionadas: ['CHC', 'US 1 MHz', 'TENS', 'MASOTERAPIA PROFUNDA', 'WILLIAMS'],
  indicacionesAdicionales: ['Evitar subir escaleras reiteradamente', 'Hielo local 10 min tras esfuerzo'],
  formatoImpresion: 'a6',
  updatedAt: '2026-09-08T10:00:00Z'
};

describe('ImpresionTarjeton Component (Plantilla Multi-Formato A6 / A5 / A4)', () => {
  it('debe renderizar el membrete oficial institucional de CEDO-REHAB EIRL', () => {
    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText(/CEDO-REHAB E\.I\.R\.L\./i)).toBeDefined();
    expect(screen.getByText(/TARJETÓN DE TRATAMIENTO/i)).toBeDefined();
  });

  it('debe mostrar la modalidad de atención Particular o Asegurado', () => {
    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText(/PARTICULAR/i)).toBeDefined();
  });

  it('debe renderizar los datos del paciente y diagnóstico clínico', () => {
    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText('Rosa Luz Quispe')).toBeDefined();
    expect(screen.getByText(/12345678/)).toBeDefined();
    expect(screen.getByText(/Gonartrosis bilateral grado II/i)).toBeDefined();
  });

  it('debe mostrar las casillas de prescripción con [ X ] marcada para las técnicas seleccionadas', () => {
    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    const casillaChc = screen.getByTestId('impresion-casilla-CHC');
    expect(casillaChc.textContent).toContain('X');

    const casillaTens = screen.getByTestId('impresion-casilla-TENS');
    expect(casillaTens.textContent).toContain('X');

    const casillaChf = screen.getByTestId('impresion-casilla-CHF');
    expect(casillaChf.textContent).not.toContain('X');
  });

  it('debe renderizar la cuadrícula de control de asistencia de sesiones (1 a 10/12)', () => {
    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByTestId('asistencia-sesion-1')).toBeDefined();
    expect(screen.getByTestId('asistencia-sesion-5')).toBeDefined();
    expect(screen.getByTestId('asistencia-sesion-10')).toBeDefined();
  });

  it('debe ejecutar window.print() al hacer clic en el botón de impresión', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={vi.fn()}
      />
    );

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Documento/i });
    fireEvent.click(botonImprimir);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('debe ejecutar onCerrar al hacer clic en el botón Volver', () => {
    const onCerrarMock = vi.fn();

    render(
      <ImpresionTarjeton
        paciente={mockPaciente}
        tarjeton={mockTarjeton}
        onCerrar={onCerrarMock}
      />
    );

    const botonVolver = screen.getByRole('button', { name: /Volver al Editor/i });
    fireEvent.click(botonVolver);

    expect(onCerrarMock).toHaveBeenCalledTimes(1);
  });
});
