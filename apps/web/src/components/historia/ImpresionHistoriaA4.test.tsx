import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImpresionHistoriaA4 } from './ImpresionHistoriaA4';
import type { Patient, ClinicalHistory } from '@cedo/shared';

const mockPaciente: Patient = {
  id: 'pac-10',
  nombre: 'Valeria Mendoza',
  edad: 15,
  dni: '74125896',
  celular: '987123456',
  fechaIngreso: '2026-09-08',
  dniApoderado: '12398745',
  nombreApoderado: 'Patricia Gomez (Madre)',
  tipoConsulta: 'CONSULTA_MEDICA',
  costoConsulta: 50,
  estadoTriage: 'atendido',
  color: 'color-verde',
  costoTerapia: 35,
  paqueteActivo: 1,
  createdAt: '2026-09-08T09:00:00Z',
  updatedAt: '2026-09-08T09:00:00Z'
};

const mockHistoria: ClinicalHistory = {
  id: 'hist-10',
  pacienteId: 'pac-10',
  fechaEvaluacion: '2026-09-08',
  medicoEvaluador: 'Dr. Fernando Salazar (CMP 45892)',
  motivoConsulta: 'Dolor en rodilla derecha tras práctica deportiva',
  antecedentes: 'Esguince de tobillo derecho hace 1 año',
  evaluacionFisica: 'Edema leve periarticular, maniobra de Lachman negativa, dolor a la palpación de interlínea articular externa',
  diagnostico: 'Tendinitis rotuliana grado II rodilla derecha',
  planTratamiento: '10 sesiones de fisioterapia: CHC 15min, Ultrasonido 1MHz a 1.0 W/cm2, Magnetoterapia y ejercicios isométricos',
  camposDinamicos: [
    {
      id: 'cd-1',
      nombre: 'Escala Visual Analógica (EVA)',
      tipo: 'numero',
      valor: '7'
    },
    {
      id: 'cd-2',
      nombre: 'Evaluación de Salto Unipodal',
      tipo: 'texto_largo',
      valor: 'Déficit del 25% respecto a extremidad contralateral'
    }
  ],
  createdAt: '2026-09-08T09:15:00Z',
  updatedAt: '2026-09-08T09:30:00Z'
};

describe('ImpresionHistoriaA4 Component (Formato A4 Vertical Institucional)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el membrete oficial institucional de CEDO-REHAB EIRL', () => {
    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getAllByText(/CEDO-REHAB E\.I\.R\.L\./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CENTRO DE DIAGNÓSTICO Y REHABILITACIÓN FÍSICA/i)).toBeDefined();
    expect(screen.getByText(/HISTORIA CLÍNICA - EVALUACIÓN MÉDICA/i)).toBeDefined();
  });

  it('debe renderizar los datos personales consolidados del paciente y su apoderado', () => {
    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText('Valeria Mendoza')).toBeDefined();
    expect(screen.getByText(/74125896/)).toBeDefined();
    expect(screen.getByText(/15 años/i)).toBeDefined();
    expect(screen.getByText(/Patricia Gomez \(Madre\)/i)).toBeDefined();
    expect(screen.getByText(/Dr\. Fernando Salazar/i)).toBeDefined();
  });

  it('debe renderizar todas las secciones clínicas y los campos dinámicos ad-hoc', () => {
    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText(/Dolor en rodilla derecha tras práctica deportiva/i)).toBeDefined();
    expect(screen.getByText(/Esguince de tobillo derecho hace 1 año/i)).toBeDefined();
    expect(screen.getByText(/Tendinitis rotuliana grado II rodilla derecha/i)).toBeDefined();
    expect(screen.getByText(/Escala Visual Analógica \(EVA\)/i)).toBeDefined();
    expect(screen.getByText(/Evaluación de Salto Unipodal/i)).toBeDefined();
    expect(screen.getByText(/Déficit del 25%/i)).toBeDefined();
  });

  it('debe renderizar el pie de página institucional con zona de firma y sello médico', () => {
    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByText(/Firma y Sello del Médico Evaluador/i)).toBeDefined();
    expect(screen.getAllByText(/Chiclayo - Lambayeque, Perú/i).length).toBeGreaterThan(0);
  });

  it('debe llamar a window.print() al hacer clic en el botón de impresión', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={vi.fn()}
      />
    );

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Documento/i });
    fireEvent.click(botonImprimir);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('debe llamar a onCerrar al hacer clic en volver', () => {
    const onCerrarMock = vi.fn();

    render(
      <ImpresionHistoriaA4
        paciente={mockPaciente}
        historia={mockHistoria}
        onCerrar={onCerrarMock}
      />
    );

    const botonVolver = screen.getByRole('button', { name: /Volver a la Ficha/i });
    fireEvent.click(botonVolver);

    expect(onCerrarMock).toHaveBeenCalledTimes(1);
  });
});
