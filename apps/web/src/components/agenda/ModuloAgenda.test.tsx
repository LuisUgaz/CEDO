import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModuloAgenda } from './ModuloAgenda';
import { generarPlantillaSemana, type WeekSchedule } from '@cedo/shared';

// Mocks de servicios
const plantillaMock = generarPlantillaSemana(2026, 9, 2);

vi.mock('../../services/agenda.service', () => ({
  suscribirAgendaSemanal: vi.fn((_semanaId, onUpdate) => {
    onUpdate(plantillaMock);
    return vi.fn();
  }),
  actualizarSlot: vi.fn(async () => plantillaMock),
  marcarEstadoDia: vi.fn(async () => plantillaMock),
  copiarSemanaSiguiente: vi.fn(async () => plantillaMock)
}));

vi.mock('../../services/pacientes.service', () => ({
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback([
      {
        id: 'pac-1',
        nombre: 'Valeria Ramos',
        dni: '78945612',
        edad: 28,
        celular: '987654321',
        costoConsulta: 50,
        color: 'color-fucsia'
      }
    ]);
    return vi.fn();
  })
}));

import * as agendaService from '../../services/agenda.service';

describe('ModuloAgenda Component (Módulo Unificado de Horario y Agenda Semanal)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el selector de período, leyenda de especialidades y la matriz semanal', async () => {
    render(<ModuloAgenda />);

    expect(screen.getByDisplayValue('2026')).toBeDefined();
    expect(screen.getByDisplayValue('Septiembre')).toBeDefined();
    expect(screen.getByText('Magnetoterapia')).toBeDefined();
    expect(screen.getByText('Lunes')).toBeDefined();
    expect(screen.getByText('Sábado')).toBeDefined();
  });

  it('debe abrir el modal de turno al hacer clic en un slot', async () => {
    render(<ModuloAgenda />);

    const slotsDisponibles = screen.getAllByText('Disponible');
    fireEvent.click(slotsDisponibles[0]);

    expect(screen.getByText(/Programar Turno:/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Guardar Turno/i })).toBeDefined();
  });

  it('debe llamar a actualizarSlot al guardar un turno desde el modal', async () => {
    render(<ModuloAgenda />);

    const slotsDisponibles = screen.getAllByText('Disponible');
    fireEvent.click(slotsDisponibles[0]);

    const inputPaciente = screen.getByLabelText(/Paciente/i);
    fireEvent.change(inputPaciente, { target: { value: 'Carlos Ortiz' } });

    const btnGuardar = screen.getByRole('button', { name: /Guardar Turno/i });
    fireEvent.click(btnGuardar);

    expect(agendaService.actualizarSlot).toHaveBeenCalled();
  });

  it('debe llamar a marcarEstadoDia al alternar el estado de un día', async () => {
    render(<ModuloAgenda />);

    const botonFeriadoLunes = screen.getByTitle(/Alternar estado del día lunes/i);
    fireEvent.click(botonFeriadoLunes);

    expect(agendaService.marcarEstadoDia).toHaveBeenCalledWith(
      expect.any(String),
      'lunes',
      'feriado'
    );
  });

  it('debe llamar a copiarSemanaSiguiente al pulsar el botón de duplicar semana', async () => {
    render(<ModuloAgenda />);

    const botonCopiar = screen.getByRole('button', { name: /Copiar a Semana Siguiente/i });
    fireEvent.click(botonCopiar);

    expect(agendaService.copiarSemanaSiguiente).toHaveBeenCalledWith(
      '2026_09_sem2',
      '2026_09_sem3'
    );
  });
});
