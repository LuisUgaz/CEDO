import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('debe renderizar el layout principal y cambiar al módulo de Ficha de Tratamiento', () => {
    render(<App />);

    expect(screen.getAllByText('CEDO-REHAB').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Horario y Agenda Semanal').length).toBeGreaterThanOrEqual(1);

    // Navegar a Terapias
    const btnTerapias = screen.getByText('Ficha de Terapias (A6)');
    fireEvent.click(btnTerapias);

    // Debe mostrar la vista de terapeuta y sus pestañas
    expect(screen.getAllByText('Turnos de Hoy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Mis Pacientes/i })).toBeDefined();
  });
});
