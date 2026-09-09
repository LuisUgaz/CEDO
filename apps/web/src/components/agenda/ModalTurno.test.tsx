import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalTurno } from './ModalTurno';
import type { ScheduleSlot, Patient } from '@cedo/shared';

describe('ModalTurno Component (Edición Ergonómica de Turno)', () => {
  const slotPrueba: ScheduleSlot = {
    id: 'lunes_09:00',
    hora: '09:00',
    dia: 'lunes',
    pacienteId: 'pac-1',
    nombrePaciente: 'Ana Morales',
    color: 'color-fucsia',
    asistio: false,
    nota: 'Primera sesión'
  };

  const listaPacientesMock: Patient[] = [
    {
      id: 'pac-1',
      nombre: 'Ana Morales',
      edad: 34,
      dni: '12345678',
      celular: '987654321',
      fechaIngreso: '2026-09-01',
      costoConsulta: 50,
      estadoTriage: 'atendido',
      color: 'color-fucsia',
      costoTerapia: 400,
      paqueteActivo: 1,
      createdAt: '2026-09-01T10:00:00.000Z',
      updatedAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'pac-2',
      nombre: 'Bernardo Vega',
      edad: 45,
      dni: '87654321',
      celular: '912345678',
      fechaIngreso: '2026-09-02',
      costoConsulta: 50,
      estadoTriage: 'en_espera',
      color: 'color-verde',
      costoTerapia: 350,
      paqueteActivo: 1,
      createdAt: '2026-09-02T10:00:00.000Z',
      updatedAt: '2026-09-02T10:00:00.000Z'
    }
  ];

  it('no debe renderizar nada si isOpen es false o slot es null', () => {
    const { container } = render(
      <ModalTurno
        isOpen={false}
        slot={slotPrueba}
        onClose={vi.fn()}
        onGuardarSlot={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('debe renderizar la cabecera del turno con día, hora y campos editables', () => {
    render(
      <ModalTurno
        isOpen={true}
        slot={slotPrueba}
        onClose={vi.fn()}
        onGuardarSlot={vi.fn()}
        pacientesDisponibles={listaPacientesMock}
      />
    );

    expect(screen.getByText(/Programar Turno: lunes 09:00/i)).toBeDefined();
    expect(screen.getByDisplayValue('Ana Morales')).toBeDefined();
    expect(screen.getByDisplayValue('Primera sesión')).toBeDefined();
    expect(screen.getByRole('button', { name: /Guardar Turno/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Desocupar Turno/i })).toBeDefined();
  });

  it('debe permitir seleccionar un paciente de la lista predictiva', () => {
    const onGuardarSlot = vi.fn();
    render(
      <ModalTurno
        isOpen={true}
        slot={slotPrueba}
        onClose={vi.fn()}
        onGuardarSlot={onGuardarSlot}
        pacientesDisponibles={listaPacientesMock}
      />
    );

    const inputPaciente = screen.getByLabelText(/Paciente/i);
    fireEvent.change(inputPaciente, { target: { value: 'Bernardo' } });

    const opcionBernardo = screen.getByText(/Bernardo Vega/i);
    fireEvent.click(opcionBernardo);

    expect(screen.getByDisplayValue('Bernardo Vega')).toBeDefined();
  });

  it('debe guardar el slot con los datos modificados al hacer clic en Guardar Turno', () => {
    const onGuardarSlot = vi.fn();
    render(
      <ModalTurno
        isOpen={true}
        slot={slotPrueba}
        onClose={vi.fn()}
        onGuardarSlot={onGuardarSlot}
      />
    );

    const checkAsistencia = screen.getByLabelText(/Asistió a la sesión/i);
    fireEvent.click(checkAsistencia);

    const botonGuardar = screen.getByRole('button', { name: /Guardar Turno/i });
    fireEvent.click(botonGuardar);

    expect(onGuardarSlot).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'lunes_09:00',
        nombrePaciente: 'Ana Morales',
        asistio: true
      })
    );
  });

  it('debe llamar a onDesocuparSlot al hacer clic en Desocupar Turno', () => {
    const onDesocuparSlot = vi.fn();
    render(
      <ModalTurno
        isOpen={true}
        slot={slotPrueba}
        onClose={vi.fn()}
        onGuardarSlot={vi.fn()}
        onDesocuparSlot={onDesocuparSlot}
      />
    );

    const botonDesocupar = screen.getByRole('button', { name: /Desocupar Turno/i });
    fireEvent.click(botonDesocupar);

    expect(onDesocuparSlot).toHaveBeenCalledWith('lunes_09:00');
  });

  it('debe cerrar el modal al pulsar Cancelar', () => {
    const onClose = vi.fn();
    render(
      <ModalTurno
        isOpen={true}
        slot={slotPrueba}
        onClose={onClose}
        onGuardarSlot={vi.fn()}
      />
    );

    const botonCancelar = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(botonCancelar);

    expect(onClose).toHaveBeenCalled();
  });
});
