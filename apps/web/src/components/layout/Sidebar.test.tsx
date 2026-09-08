import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Sidebar } from './Sidebar';

describe('Sidebar Component (Navegación Clínica)', () => {
  it('debe renderizar los 8 módulos principales de CEDO-REHAB', () => {
    const fnCambiar = vi.fn();
    const fnCerrar = vi.fn();

    render(
      <Sidebar
        moduloActivo="agenda"
        onCambiarModulo={fnCambiar}
        menuMobileAbierto={false}
        onCerrarMenuMobile={fnCerrar}
      />
    );

    expect(screen.getByText('Horario y Agenda')).toBeDefined();
    expect(screen.getByText('Registro de Paciente')).toBeDefined();
    expect(screen.getByText('Historia Clínica (A4)')).toBeDefined();
    expect(screen.getByText('Ficha de Terapias (A6)')).toBeDefined();
    expect(screen.getByText('Asistencia y Boletas')).toBeDefined();
    expect(screen.getByText('Inventario Clínico')).toBeDefined();
    expect(screen.getByText('Rencuentro Sábados')).toBeDefined();
    expect(screen.getByText('Finanzas y Caja')).toBeDefined();
  });

  it('debe llamar a onCambiarModulo al hacer clic en un módulo', () => {
    const fnCambiar = vi.fn();
    const fnCerrar = vi.fn();

    render(
      <Sidebar
        moduloActivo="agenda"
        onCambiarModulo={fnCambiar}
        menuMobileAbierto={false}
        onCerrarMenuMobile={fnCerrar}
      />
    );

    const btnRegistro = screen.getByText('Registro de Paciente');
    fireEvent.click(btnRegistro);

    expect(fnCambiar).toHaveBeenCalledWith('registro');
    expect(fnCerrar).toHaveBeenCalled();
  });
});
