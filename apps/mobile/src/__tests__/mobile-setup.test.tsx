import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import appConfig from '../../app.json';
import mobileTailwindConfig from '../../tailwind.config.js';
import { TurnosHoyScreen } from '../screens/TurnosHoyScreen';
import { MisPacientesScreen } from '../screens/MisPacientesScreen';
import { AsistenciaRapidaScreen } from '../screens/AsistenciaRapidaScreen';
import IndexTabScreen from '../../app/(tabs)/index';
import PacientesTabScreen from '../../app/(tabs)/pacientes';
import AsistenciaTabScreen from '../../app/(tabs)/asistencia';

import RootLayout from '../../app/_layout';
import TabLayout from '../../app/(tabs)/_layout';

describe('Fase 3: Configuración Base y Smoke Test de la App Móvil', () => {
  it('debe tener una configuración válida de Expo con expo-router', () => {
    expect(appConfig.expo).toBeDefined();
    expect(appConfig.expo.name).toBe('CEDO-REHAB Móvil');
    expect(appConfig.expo.slug).toBe('cedo-rehab-mobile');
    expect(appConfig.expo.scheme).toBe('cedo-mobile');
    expect(appConfig.expo.plugins).toContain('expo-router');
  });

  it('debe renderizar RootLayout y TabLayout con la estructura de navegación de pestañas', () => {
    const { unmount: unmountRoot } = render(<RootLayout />);
    expect(screen.getByTestId('expo-stack')).toBeDefined();
    unmountRoot();

    const { unmount: unmountTab } = render(<TabLayout />);
    expect(screen.getByTestId('expo-tabs')).toBeDefined();
    unmountTab();
  });


  it('debe tener la paleta cromática clínica de CEDO-REHAB configurada en tailwind.config.js', () => {
    const colors = mobileTailwindConfig.theme.extend.colors.clinica;
    expect(colors).toBeDefined();
    expect(colors.emerald.DEFAULT).toBe('#059669');
    expect(colors.melon.bg).toBe('#fde2e4');
    expect(colors.verde.bg).toBe('#d8f3dc');
    expect(colors.amarillo.bg).toBe('#fef9c3');
    expect(colors.azul.bg).toBe('#e0f2fe');
    expect(colors.fucsia.bg).toBe('#f3e8ff');
    expect(colors.anaranjado.bg).toBe('#ffedd5');
  });

  it('debe renderizar la pantalla "Turnos de Hoy" con los turnos y citas asignadas', () => {
    render(<TurnosHoyScreen />);
    expect(screen.getByText('Turnos de Hoy')).toBeDefined();
    expect(screen.getByText(/Sala de Rehabilitación/i)).toBeDefined();
    expect(screen.getByText(/Juan Pérez/i)).toBeDefined();
    expect(screen.getByText(/Lumbalgia Mecánica/i)).toBeDefined();
  });

  it('debe renderizar la pantalla "Mis Pacientes" con diagnóstico y agentes físicos', () => {
    render(<MisPacientesScreen />);
    expect(screen.getByText('Mis Pacientes Asignados')).toBeDefined();
    expect(screen.getByText(/María Rodríguez/i)).toBeDefined();
    expect(screen.getByText(/Tendinitis Rotuliana/i)).toBeDefined();
    expect(screen.getByText(/Magnetoterapia/i)).toBeDefined();
    expect(screen.getByText(/Ultrasonido/i)).toBeDefined();
  });

  it('debe renderizar la pantalla "Asistencia Rápida" y permitir marcar asistencia a pie de camilla', () => {
    const fnAsistencia = vi.fn();
    render(<AsistenciaRapidaScreen onMarcarAsistencia={fnAsistencia} />);

    expect(screen.getByText('Asistencia a Pie de Camilla')).toBeDefined();
    const btnMarcar = screen.getByText('Marcar Asistencia');
    expect(btnMarcar).toBeDefined();

    fireEvent.click(btnMarcar);
    expect(fnAsistencia).toHaveBeenCalled();
  });

  it('debe renderizar las pantallas de ruta de Expo Router en app/(tabs)', () => {
    const { unmount: unmountIndex } = render(<IndexTabScreen />);
    expect(screen.getByText('Turnos de Hoy')).toBeDefined();
    unmountIndex();

    const { unmount: unmountPacientes } = render(<PacientesTabScreen />);
    expect(screen.getByText('Mis Pacientes Asignados')).toBeDefined();
    unmountPacientes();

    const { unmount: unmountAsistencia } = render(<AsistenciaTabScreen />);
    expect(screen.getByText('Asistencia a Pie de Camilla')).toBeDefined();
    unmountAsistencia();
  });
});

