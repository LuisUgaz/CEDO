import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModuloAdmision from './ModuloAdmision';

vi.mock('../../services/pacientes.service', () => ({
  crearPaciente: vi.fn(),
  suscribirPacientesEnEspera: vi.fn((callback) => {
    callback([]);
    return vi.fn();
  }),
  actualizarEstadoTriage: vi.fn()
}));

describe('ModuloAdmision Component (Vista Unificada de Admisión y Triage)', () => {
  it('debe renderizar las pestañas de navegación y mostrar el formulario por defecto', () => {
    render(<ModuloAdmision />);

    expect(screen.getByRole('button', { name: /Nuevo Registro/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Fichas en Espera/i })).toBeDefined();
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeDefined();
  });

  it('debe cambiar a la pestaña de Fichas en Espera al hacer clic en ella', () => {
    render(<ModuloAdmision />);

    const tabFichas = screen.getByRole('button', { name: /Fichas en Espera/i });
    fireEvent.click(tabFichas);

    expect(screen.getByPlaceholderText(/Buscar paciente por nombre o DNI/i)).toBeDefined();
    expect(screen.queryByLabelText(/Nombre Completo/i)).toBeNull();
  });
});
