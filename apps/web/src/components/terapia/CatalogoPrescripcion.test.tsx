import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogoPrescripcion } from './CatalogoPrescripcion';

describe('CatalogoPrescripcion Component (Marcado con X de Alto Contraste)', () => {
  it('debe renderizar las 3 categorías principales de prescripción', () => {
    render(
      <CatalogoPrescripcion
        seleccionados={[]}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Agentes Físicos')).toBeDefined();
    expect(screen.getByText('Técnicas Manuales y Mecanoterapia')).toBeDefined();
    expect(screen.getByText('Cinesiterapia y Ejercicios')).toBeDefined();
  });

  it('debe renderizar los agentes físicos clave (CHC, US 1 MHz, TENS, etc.)', () => {
    render(
      <CatalogoPrescripcion
        seleccionados={[]}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText(/CHC/i)).toBeDefined();
    expect(screen.getByText(/US 1 MHz/i)).toBeDefined();
    expect(screen.getByText(/TENS/i)).toBeDefined();
    expect(screen.getByText(/Masoterapia Profunda/i)).toBeDefined();
    expect(screen.getByText(/Ejercicios Williams/i)).toBeDefined();
  });

  it('debe mostrar la casilla con una "X" nítida de alto contraste cuando el ítem está seleccionado', () => {
    render(
      <CatalogoPrescripcion
        seleccionados={['CHC', 'TENS']}
        onToggle={vi.fn()}
      />
    );

    const casillaChc = screen.getByTestId('casilla-CHC');
    expect(casillaChc).toBeDefined();
    expect(casillaChc.getAttribute('aria-checked')).toBe('true');
    expect(casillaChc.textContent).toContain('X');

    const casillaTens = screen.getByTestId('casilla-TENS');
    expect(casillaTens.getAttribute('aria-checked')).toBe('true');
    expect(casillaTens.textContent).toContain('X');

    const casillaLaser = screen.getByTestId('casilla-RAYOS LASER');
    expect(casillaLaser.getAttribute('aria-checked')).toBe('false');
    expect(casillaLaser.textContent).not.toContain('X');
  });

  it('debe invocar la función onToggle al hacer clic en una casilla de prescripción', () => {
    const onToggleMock = vi.fn();
    render(
      <CatalogoPrescripcion
        seleccionados={['CHC']}
        onToggle={onToggleMock}
      />
    );

    const casillaUs = screen.getByTestId('casilla-US 1 MHz');
    fireEvent.click(casillaUs);

    expect(onToggleMock).toHaveBeenCalledTimes(1);
    expect(onToggleMock).toHaveBeenCalledWith('US 1 MHz');
  });

  it('no debe invocar onToggle cuando está deshabilitado', () => {
    const onToggleMock = vi.fn();
    render(
      <CatalogoPrescripcion
        seleccionados={['CHC']}
        onToggle={onToggleMock}
        deshabilitado={true}
      />
    );

    const casillaChc = screen.getByTestId('casilla-CHC');
    fireEvent.click(casillaChc);

    expect(onToggleMock).not.toHaveBeenCalled();
  });
});
