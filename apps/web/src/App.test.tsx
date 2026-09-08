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

  it('debe navegar al módulo de Registro y Admisión de Pacientes y renderizar el formulario y triage', () => {
    render(<App />);

    const btnRegistro = screen.getByText('Registro de Paciente');
    fireEvent.click(btnRegistro);

    expect(screen.getAllByText('Registro y Admisión de Pacientes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Nuevo Registro/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Fichas en Espera/i })).toBeDefined();
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeDefined();
  });

  it('debe navegar al módulo de Historia Clínica General y renderizar ModuloHistoriaClinica', () => {
    render(<App />);

    const btnHistorias = screen.getByText('Historia Clínica (A4)');
    fireEvent.click(btnHistorias);

    expect(screen.getAllByText('Historia Clínica General (Informe A4)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Pacientes en Sala de Espera (Triage)')).toBeDefined();
    expect(screen.getByPlaceholderText(/Buscar por nombre o DNI/i)).toBeDefined();
  });
});
