import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectorPacienteHistoria } from './SelectorPacienteHistoria';
import type { Patient } from '@cedo/shared';

const mockPacientes: Patient[] = [
  {
    id: 'pac-1',
    nombre: 'Ana Paredes',
    edad: 28,
    dni: '12345678',
    celular: '987654321',
    fechaIngreso: '2026-09-08',
    tipoConsulta: 'CONSULTA_MEDICA',
    costoConsulta: 50,
    estadoTriage: 'en_espera',
    color: 'color-verde',
    costoTerapia: 35,
    paqueteActivo: 1,
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'pac-2',
    nombre: 'Carlitos Gomez',
    edad: 9,
    dni: '87654321',
    celular: '912345678',
    fechaIngreso: '2026-09-08',
    dniApoderado: '45678912',
    nombreApoderado: 'Maria Gomez (Madre)',
    tipoConsulta: 'PRE_CONSULTA',
    costoConsulta: 50,
    estadoTriage: 'en_espera',
    color: 'color-melon',
    costoTerapia: 35,
    paqueteActivo: 1,
    createdAt: '2026-09-08T10:30:00Z',
    updatedAt: '2026-09-08T10:30:00Z'
  }
];

vi.mock('../../services/pacientes.service', () => ({
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback(mockPacientes);
    return vi.fn(); // Unsubscribe mock
  })
}));

describe('SelectorPacienteHistoria Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la lista de pacientes en espera cuando no hay paciente seleccionado', () => {
    render(
      <SelectorPacienteHistoria
        pacienteSeleccionado={null}
        onSeleccionarPaciente={vi.fn()}
      />
    );

    expect(screen.getByText('Pacientes en Sala de Espera (Triage)')).toBeDefined();
    expect(screen.getByText('Ana Paredes')).toBeDefined();
    expect(screen.getByText('Carlitos Gomez')).toBeDefined();
    expect(screen.getByText('DNI: 12345678')).toBeDefined();
  });

  it('debe filtrar los pacientes según el texto ingresado en el buscador', () => {
    render(
      <SelectorPacienteHistoria
        pacienteSeleccionado={null}
        onSeleccionarPaciente={vi.fn()}
      />
    );

    const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre o DNI/i);
    fireEvent.change(inputBusqueda, { target: { value: 'Carlitos' } });

    expect(screen.getByText('Carlitos Gomez')).toBeDefined();
    expect(screen.queryByText('Ana Paredes')).toBeNull();
  });

  it('debe llamar a onSeleccionarPaciente al hacer clic en el botón de evaluar', () => {
    const onSeleccionarMock = vi.fn();
    render(
      <SelectorPacienteHistoria
        pacienteSeleccionado={null}
        onSeleccionarPaciente={onSeleccionarMock}
      />
    );

    const botonesEvaluar = screen.getAllByRole('button', { name: /Iniciar Evaluación/i });
    fireEvent.click(botonesEvaluar[0]);

    expect(onSeleccionarMock).toHaveBeenCalledTimes(1);
    expect(onSeleccionarMock).toHaveBeenCalledWith(mockPacientes[0]);
  });

  it('debe renderizar la cabecera consolidada del paciente cuando ya está seleccionado', () => {
    const pacienteMenor = mockPacientes[1];
    const onLimpiarMock = vi.fn();

    render(
      <SelectorPacienteHistoria
        pacienteSeleccionado={pacienteMenor}
        onSeleccionarPaciente={vi.fn()}
        onLimpiarSeleccion={onLimpiarMock}
      />
    );

    expect(screen.getByText('Carlitos Gomez')).toBeDefined();
    expect(screen.getByText(/9 años/i)).toBeDefined();
    expect(screen.getByText(/Maria Gomez \(Madre\)/i)).toBeDefined();
    expect(screen.getByText(/DNI: 87654321/i)).toBeDefined();

    const botonCambiar = screen.getByRole('button', { name: /Cambiar Paciente/i });
    fireEvent.click(botonCambiar);
    expect(onLimpiarMock).toHaveBeenCalledTimes(1);
  });
});
