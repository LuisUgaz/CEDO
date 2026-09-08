import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormularioHistoriaClinica } from './FormularioHistoriaClinica';
import type { Patient, ClinicalHistory } from '@cedo/shared';
import * as historiaService from '../../services/historiaClinica.service';

const mockPaciente: Patient = {
  id: 'pac-1',
  nombre: 'Carlos Ruiz',
  edad: 38,
  dni: '45678912',
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
};

const mockHistoria: ClinicalHistory = {
  id: 'hist-1',
  pacienteId: 'pac-1',
  fechaEvaluacion: '2026-09-08',
  medicoEvaluador: 'Dr. Fernando Salazar',
  motivoConsulta: 'Dolor en columna lumbar',
  antecedentes: 'Lumbalgia previa hace 2 años',
  evaluacionFisica: 'Espasmo paravertebral L3-L5',
  diagnostico: 'Lumbalgia mecánica aguda',
  planTratamiento: '10 sesiones de fisioterapia y analgesia',
  camposDinamicos: [
    {
      id: 'field-1',
      nombre: 'Escala EVA Inicial',
      tipo: 'numero',
      valor: '8'
    }
  ],
  createdAt: '2026-09-08T10:00:00Z',
  updatedAt: '2026-09-08T10:00:00Z'
};

vi.mock('../../services/historiaClinica.service', () => ({
  guardarHistoriaClinica: vi.fn(async (data) => ({
    id: data.id || 'mock-saved-id',
    ...data
  })),
  finalizarEvaluacionMedica: vi.fn(async () => {})
}));

describe('FormularioHistoriaClinica Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar los campos clínicos base del formulario médico', () => {
    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={mockHistoria}
      />
    );

    expect(screen.getByLabelText(/Motivo de Consulta/i)).toBeDefined();
    expect(screen.getByLabelText(/Antecedentes Médicos/i)).toBeDefined();
    expect(screen.getByLabelText(/Examen Físico/i)).toBeDefined();
    expect(screen.getByLabelText(/Diagnóstico Médico \(DX\)/i)).toBeDefined();
    expect(screen.getByLabelText(/Plan de Tratamiento/i)).toBeDefined();

    expect(screen.getByDisplayValue('Dolor en columna lumbar')).toBeDefined();
    expect(screen.getByDisplayValue('Lumbalgia mecánica aguda')).toBeDefined();
  });

  it('debe permitir añadir un campo dinámico ad-hoc y escribir en él sin recargar', async () => {
    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={null}
      />
    );

    const botonAgregarCampo = screen.getByRole('button', { name: /\+ Agregar Campo/i });
    fireEvent.click(botonAgregarCampo);

    // Debe mostrar los campos para definir el nuevo parámetro ad-hoc
    const inputNombreCampo = screen.getByPlaceholderText(/Nombre del campo/i);
    fireEvent.change(inputNombreCampo, { target: { value: 'Evaluación Postural Dinámica' } });

    const botonConfirmar = screen.getByRole('button', { name: /Insertar Campo/i });
    fireEvent.click(botonConfirmar);

    // El nuevo campo debe generarse en la vista
    expect(screen.getByText('Evaluación Postural Dinámica')).toBeDefined();

    // Podemos escribir observaciones en el nuevo campo
    const textareaNuevoCampo = screen.getByPlaceholderText(/Ingrese detalles para Evaluación Postural Dinámica/i);
    fireEvent.change(textareaNuevoCampo, { target: { value: 'Hiperlordosis lumbar con anteversión pélvica' } });
    expect(screen.getByDisplayValue('Hiperlordosis lumbar con anteversión pélvica')).toBeDefined();
  });

  it('debe permitir eliminar un campo dinámico existente', () => {
    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={mockHistoria}
      />
    );

    expect(screen.getByText('Escala EVA Inicial')).toBeDefined();
    const botonEliminar = screen.getByTitle(/Eliminar campo Escala EVA Inicial/i);
    fireEvent.click(botonEliminar);

    expect(screen.queryByText('Escala EVA Inicial')).toBeNull();
  });

  it('debe activar el autoguardado reactivo al modificar campos', async () => {
    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={mockHistoria}
      />
    );

    const inputMotivo = screen.getByLabelText(/Motivo de Consulta/i);
    fireEvent.change(inputMotivo, { target: { value: 'Dolor irradiado a miembro inferior derecho' } });

    await waitFor(
      () => {
        expect(historiaService.guardarHistoriaClinica).toHaveBeenCalled();
      },
      { timeout: 1500 }
    );
  });

  it('debe completar la evaluación médica y llamar a finalizarEvaluacionMedica', async () => {
    const onCompletadaMock = vi.fn();

    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={mockHistoria}
        onEvaluacionCompletada={onCompletadaMock}
      />
    );

    const botonFinalizar = screen.getByRole('button', { name: /Finalizar Evaluación/i });
    fireEvent.click(botonFinalizar);

    await waitFor(() => {
      expect(historiaService.finalizarEvaluacionMedica).toHaveBeenCalledWith('pac-1');
      expect(onCompletadaMock).toHaveBeenCalledTimes(1);
    });
  });

  it('debe llamar a onImprimir al pulsar el botón de imprimir ficha A4', () => {
    const onImprimirMock = vi.fn();

    render(
      <FormularioHistoriaClinica
        paciente={mockPaciente}
        historiaInicial={mockHistoria}
        onImprimir={onImprimirMock}
      />
    );

    const botonImprimir = screen.getByRole('button', { name: /Imprimir Ficha \(A4\)/i });
    fireEvent.click(botonImprimir);

    expect(onImprimirMock).toHaveBeenCalledTimes(1);
  });
});
