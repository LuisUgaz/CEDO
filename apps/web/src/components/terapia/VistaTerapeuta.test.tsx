import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VistaTerapeuta } from './VistaTerapeuta';

describe('VistaTerapeuta Component (Módulo Responsivo / PWA para Sala de Terapia)', () => {
  it('debe renderizar la navegación de pestañas y la pestaña por defecto "Turnos de Hoy"', () => {
    render(<VistaTerapeuta />);

    expect(screen.getAllByText('Turnos de Hoy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Mis Pacientes/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Asistencia a Pie de Camilla/i })).toBeDefined();

    // Contenido de Turnos de Hoy
    expect(screen.getByText('Juan Pérez')).toBeDefined();
    expect(screen.getByText('Lumbalgia Mecánica')).toBeDefined();
  });

  it('debe cambiar a la pestaña "Mis Pacientes" y mostrar los agentes físicos prescritos', () => {
    render(<VistaTerapeuta />);

    const tabPacientes = screen.getByText('Mis Pacientes');
    fireEvent.click(tabPacientes);

    expect(screen.getByText('Mis Pacientes Asignados')).toBeDefined();
    expect(screen.getByText('María Rodríguez')).toBeDefined();
    expect(screen.getByText('Tendinitis Rotuliana Rodilla Derecha')).toBeDefined();
    expect(screen.getByText('Magnetoterapia (20 min)')).toBeDefined();
    expect(screen.getByText('Ultrasonido (1 MHz, 5 min)')).toBeDefined();
  });

  it('debe cambiar a la pestaña "Asistencia a Pie de Camilla" y registrar asistencia', () => {
    const fnAsistencia = vi.fn();
    render(<VistaTerapeuta onMarcarAsistencia={fnAsistencia} />);

    const tabAsistencia = screen.getByText('Asistencia a Pie de Camilla');
    fireEvent.click(tabAsistencia);

    const btnMarcar = screen.getByText('Marcar Asistencia');
    expect(btnMarcar).toBeDefined();

    fireEvent.click(btnMarcar);
    expect(fnAsistencia).toHaveBeenCalledWith('p1', 5);
    expect(screen.getByText(/✓ Asistencia Registrada en Tiempo Real/i)).toBeDefined();
  });
});
