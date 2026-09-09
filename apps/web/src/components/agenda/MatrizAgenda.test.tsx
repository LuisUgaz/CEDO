import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatrizAgenda } from './MatrizAgenda';
import { generarPlantillaSemana, type WeekSchedule, type ScheduleSlot } from '@cedo/shared';

describe('MatrizAgenda Component (Cuadrícula Semanal Multi-Terapeuta)', () => {
  const plantillaBase = generarPlantillaSemana(2026, 9, 2);

  const agendaConTurnos: WeekSchedule = {
    ...plantillaBase,
    estadoDias: {
      lunes: 'laboral',
      martes: 'laboral',
      miercoles: 'feriado',
      jueves: 'laboral',
      viernes: 'laboral',
      sabado: 'laboral'
    },
    slots: plantillaBase.slots.map((s) => {
      if (s.id === 'lunes_09:00') {
        return {
          ...s,
          pacienteId: 'pac-1',
          nombrePaciente: 'Ana Morales',
          color: 'color-fucsia',
          asistio: false
        };
      }
      return s;
    })
  };

  it('debe renderizar los 6 días de la semana (Lunes a Sábado) y las franjas horarias', () => {
    render(
      <MatrizAgenda
        agenda={agendaConTurnos}
        onSeleccionarSlot={vi.fn()}
        onToggleAsistencia={vi.fn()}
      />
    );

    expect(screen.getByText('Lunes')).toBeDefined();
    expect(screen.getByText('Martes')).toBeDefined();
    expect(screen.getByText('Miércoles')).toBeDefined();
    expect(screen.getByText('Jueves')).toBeDefined();
    expect(screen.getByText('Viernes')).toBeDefined();
    expect(screen.getByText('Sábado')).toBeDefined();

    expect(screen.getByText('08:00')).toBeDefined();
    expect(screen.getByText('09:00')).toBeDefined();
    expect(screen.getByText('19:00')).toBeDefined();
  });

  it('debe mostrar los distintivos de día Laboral y Feriado', () => {
    render(
      <MatrizAgenda
        agenda={agendaConTurnos}
        onSeleccionarSlot={vi.fn()}
        onToggleAsistencia={vi.fn()}
      />
    );

    expect(screen.getAllByText(/Laboral/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Feriado/i).length).toBeGreaterThan(0);
  });

  it('debe llamar a onToggleEstadoDia cuando se hace clic en el botón de alternar feriado del día', () => {
    const onToggleEstadoDia = vi.fn();
    render(
      <MatrizAgenda
        agenda={agendaConTurnos}
        onSeleccionarSlot={vi.fn()}
        onToggleAsistencia={vi.fn()}
        onToggleEstadoDia={onToggleEstadoDia}
      />
    );

    const botonFeriadoMiercoles = screen.getByTitle(/Alternar estado del día miércoles/i);
    fireEvent.click(botonFeriadoMiercoles);

    expect(onToggleEstadoDia).toHaveBeenCalledWith('miercoles');
  });

  it('debe llamar a onSeleccionarSlot cuando se hace clic en una celda horaria', () => {
    const onSeleccionarSlot = vi.fn();
    render(
      <MatrizAgenda
        agenda={agendaConTurnos}
        onSeleccionarSlot={onSeleccionarSlot}
        onToggleAsistencia={vi.fn()}
      />
    );

    const turnoAna = screen.getByText('Ana Morales');
    fireEvent.click(turnoAna);

    expect(onSeleccionarSlot).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'lunes_09:00',
        nombrePaciente: 'Ana Morales'
      })
    );
  });
});
