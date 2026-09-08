import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColaTriage from './ColaTriage';
import type { Patient } from '@cedo/shared';
import * as pacientesService from '../../services/pacientes.service';

vi.mock('../../services/pacientes.service', () => ({
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback([
      {
        id: 'pac-1',
        nombre: 'Raúl Morales',
        edad: 45,
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
        nombre: 'Camila Quispe',
        edad: 9,
        dni: '87654321',
        celular: '912345678',
        fechaIngreso: '2026-09-08',
        dniApoderado: '45678912',
        nombreApoderado: 'Sonia Quispe (Madre)',
        tipoConsulta: 'PRE_CONSULTA',
        costoConsulta: 50,
        estadoTriage: 'en_espera',
        color: 'color-melon',
        costoTerapia: 35,
        paqueteActivo: 1,
        createdAt: '2026-09-08T10:15:00Z',
        updatedAt: '2026-09-08T10:15:00Z'
      }
    ] as Patient[]);
    return vi.fn(); // Unsubscribe mock
  }),
  actualizarEstadoTriage: vi.fn().mockResolvedValue(undefined)
}));

describe('ColaTriage Component (Tablero de Pacientes en Espera)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la lista de pacientes en espera suscritos en tiempo real', () => {
    render(<ColaTriage />);

    expect(screen.getByText('Raúl Morales')).toBeDefined();
    expect(screen.getByText('12345678')).toBeDefined();
    expect(screen.getByText('Camila Quispe')).toBeDefined();
    expect(screen.getByText('87654321')).toBeDefined();
  });

  it('debe mostrar los datos de apoderado para pacientes menores de edad', () => {
    render(<ColaTriage />);

    expect(screen.getByText(/Sonia Quispe \(Madre\)/i)).toBeDefined();
    expect(screen.getByText(/Menor de Edad/i)).toBeDefined();
  });

  it('debe permitir buscar o filtrar pacientes por nombre o DNI', () => {
    render(<ColaTriage />);

    const searchInput = screen.getByPlaceholderText(/Buscar paciente por nombre o DNI/i);
    fireEvent.change(searchInput, { target: { value: 'Morales' } });

    expect(screen.getByText('Raúl Morales')).toBeDefined();
    expect(screen.queryByText('Camila Quispe')).toBeNull();
  });

  it('debe permitir derivar a un paciente a evaluación llamando a actualizarEstadoTriage', async () => {
    render(<ColaTriage />);

    const botonAtender = screen.getAllByRole('button', { name: /Pasar a Evaluación/i })[0];
    fireEvent.click(botonAtender);

    expect(pacientesService.actualizarEstadoTriage).toHaveBeenCalledWith('pac-1', 'en_evaluacion');
  });
});
