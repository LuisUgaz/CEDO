import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectorPeriodoSemana } from './SelectorPeriodoSemana';
import { LeyendaColores } from './LeyendaColores';
import { CeldaTurno } from './CeldaTurno';
import type { ScheduleSlot } from '@cedo/shared';

describe('Componentes Base de Agenda Semanal', () => {
  describe('SelectorPeriodoSemana Component', () => {
    it('debe renderizar los selectores de año, mes, semana y el rango de fechas', () => {
      const onCambiarPeriodo = vi.fn();
      render(
        <SelectorPeriodoSemana
          anio={2026}
          mes={9}
          numeroSemana={2}
          rangoFechas="07/09/2026 - 12/09/2026"
          onCambiarPeriodo={onCambiarPeriodo}
        />
      );

      expect(screen.getByDisplayValue('2026')).toBeDefined();
      expect(screen.getByDisplayValue('Septiembre')).toBeDefined();
      expect(screen.getByDisplayValue('Semana 2')).toBeDefined();
      expect(screen.getByText('07/09/2026 - 12/09/2026')).toBeDefined();
    });

    it('debe llamar a onCambiarPeriodo al cambiar de mes o semana', () => {
      const onCambiarPeriodo = vi.fn();
      render(
        <SelectorPeriodoSemana
          anio={2026}
          mes={9}
          numeroSemana={2}
          rangoFechas="07/09/2026 - 12/09/2026"
          onCambiarPeriodo={onCambiarPeriodo}
        />
      );

      const selectMes = screen.getByLabelText(/^Mes$/i);
      fireEvent.change(selectMes, { target: { value: '10' } });

      expect(onCambiarPeriodo).toHaveBeenCalledWith({
        anio: 2026,
        mes: 10,
        numeroSemana: 2
      });
    });

    it('debe disparar onCopiarSemana al hacer clic en el botón de duplicar', () => {
      const onCopiarSemana = vi.fn();
      render(
        <SelectorPeriodoSemana
          anio={2026}
          mes={9}
          numeroSemana={2}
          rangoFechas="07/09/2026 - 12/09/2026"
          onCambiarPeriodo={vi.fn()}
          onCopiarSemana={onCopiarSemana}
        />
      );

      const botonCopiar = screen.getByRole('button', { name: /Copiar a Semana Siguiente/i });
      fireEvent.click(botonCopiar);

      expect(onCopiarSemana).toHaveBeenCalled();
    });
  });

  describe('LeyendaColores Component', () => {
    it('debe renderizar las 6 especialidades con sus códigos de colores oficiales', () => {
      render(<LeyendaColores />);

      expect(screen.getByText('Magnetoterapia')).toBeDefined();
      expect(screen.getByText('Niños / Pediatría')).toBeDefined();
      expect(screen.getByText('Adultos / Electroterapia')).toBeDefined();
      expect(screen.getByText('Adultos Mayores / Geriatría')).toBeDefined();
      expect(screen.getByText('Masajes / Descontracturantes')).toBeDefined();
      expect(screen.getByText('Doctor / Consulta Médica')).toBeDefined();
    });

    it('debe permitir filtrar o seleccionar un color al hacer clic', () => {
      const onSeleccionarColor = vi.fn();
      render(<LeyendaColores onSeleccionarColor={onSeleccionarColor} />);

      const itemMagneto = screen.getByText('Magnetoterapia');
      fireEvent.click(itemMagneto);

      expect(onSeleccionarColor).toHaveBeenCalledWith('color-fucsia');
    });
  });

  describe('CeldaTurno Component', () => {
    it('debe renderizar un slot disponible cuando no tiene paciente asignado', () => {
      const slotVacio: ScheduleSlot = {
        id: 'lunes_08:00',
        hora: '08:00',
        dia: 'lunes',
        asistio: false
      };
      const onClick = vi.fn();

      render(<CeldaTurno slot={slotVacio} onClick={onClick} />);

      expect(screen.getByText('Disponible')).toBeDefined();
      fireEvent.click(screen.getByText('Disponible'));
      expect(onClick).toHaveBeenCalledWith(slotVacio);
    });

    it('debe renderizar los datos del paciente, color y badge de asistencia cuando está ocupado', () => {
      const slotOcupado: ScheduleSlot = {
        id: 'lunes_09:00',
        hora: '09:00',
        dia: 'lunes',
        pacienteId: 'pac-123',
        nombrePaciente: 'Valeria Ramos',
        color: 'color-fucsia',
        asistio: true,
        nota: 'Lumbalgia aguda'
      };
      const onClick = vi.fn();
      const onToggleAsistencia = vi.fn();

      render(
        <CeldaTurno
          slot={slotOcupado}
          onClick={onClick}
          onToggleAsistencia={onToggleAsistencia}
        />
      );

      expect(screen.getByText('Valeria Ramos')).toBeDefined();
      expect(screen.getByText('Lumbalgia aguda')).toBeDefined();
      expect(screen.getByText('Asistió')).toBeDefined();

      const btnAsistencia = screen.getByTitle(/Alternar asistencia/i);
      fireEvent.click(btnAsistencia);
      expect(onToggleAsistencia).toHaveBeenCalledWith(slotOcupado);
    });

    it('debe mostrar indicador de feriado cuando el día está marcado como no laborable', () => {
      const slotVacio: ScheduleSlot = {
        id: 'miercoles_10:00',
        hora: '10:00',
        dia: 'miercoles',
        asistio: false
      };

      render(<CeldaTurno slot={slotVacio} esFeriado={true} onClick={vi.fn()} />);

      expect(screen.getByText(/Feriado \/ No Laborable/i)).toBeDefined();
    });
  });
});
