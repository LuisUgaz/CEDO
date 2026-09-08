import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormularioAdmision from './FormularioAdmision';
import * as pacientesService from '../../services/pacientes.service';

vi.mock('../../services/pacientes.service', () => ({
  crearPaciente: vi.fn()
}));

describe('FormularioAdmision Component (Regla de Minoridad y Admisión)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar todos los campos iniciales del formulario de admisión', () => {
    render(<FormularioAdmision />);

    expect(screen.getByLabelText(/Nombre Completo/i)).toBeDefined();
    expect(screen.getByLabelText(/DNI del Paciente/i)).toBeDefined();
    expect(screen.getByLabelText(/Edad/i)).toBeDefined();
    expect(screen.getByLabelText(/Celular/i)).toBeDefined();
    expect(screen.getByLabelText(/Tipo de Consulta/i)).toBeDefined();
    expect(screen.getByLabelText(/Costo/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Registrar y Derivar/i })).toBeDefined();
  });

  it('no debe mostrar la sección de apoderado para pacientes adultos por defecto', () => {
    render(<FormularioAdmision />);

    const inputEdad = screen.getByLabelText(/Edad/i);
    fireEvent.change(inputEdad, { target: { value: '30' } });

    expect(screen.queryByText(/Paciente Menor de Edad/i)).toBeNull();
    expect(screen.queryByLabelText(/DNI de Apoderado/i)).toBeNull();
  });

  it('debe desplegar reactivamente la sección de apoderado y advertencia si la edad es menor a 18 años', () => {
    render(<FormularioAdmision />);

    const inputEdad = screen.getByLabelText(/Edad/i);
    fireEvent.change(inputEdad, { target: { value: '12' } });

    expect(screen.getByText(/Paciente Menor de Edad/i)).toBeDefined();
    expect(screen.getByLabelText(/DNI de Apoderado/i)).toBeDefined();
    expect(screen.getByLabelText(/Nombre del Apoderado/i)).toBeDefined();
  });

  it('debe deshabilitar el botón de envío si el paciente es menor de edad y el DNI de apoderado está vacío o incompleto', () => {
    render(<FormularioAdmision />);

    // Llenar datos básicos del menor
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Lucas Ramos' } });
    fireEvent.change(screen.getByLabelText(/DNI del Paciente/i), { target: { value: '78945612' } });
    fireEvent.change(screen.getByLabelText(/Celular/i), { target: { value: '987654321' } });
    fireEvent.change(screen.getByLabelText(/Edad/i), { target: { value: '14' } });

    const submitBtn = screen.getByRole('button', { name: /Registrar y Derivar/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);

    // Ingresar DNI de apoderado incompleto (sólo 4 dígitos)
    const inputDniApoderado = screen.getByLabelText(/DNI de Apoderado/i);
    fireEvent.change(inputDniApoderado, { target: { value: '1234' } });
    expect(submitBtn.disabled).toBe(true);

    // Ingresar DNI de apoderado completo (8 dígitos) pero sin nombre de apoderado
    fireEvent.change(inputDniApoderado, { target: { value: '45678912' } });
    expect(submitBtn.disabled).toBe(true);

    // Ingresar nombre de apoderado válido
    fireEvent.change(screen.getByLabelText(/Nombre del Apoderado/i), {
      target: { value: 'Elena Ramos (Madre)' }
    });
    expect(submitBtn.disabled).toBe(false);
  });

  it('debe actualizar el costo automáticamente según el tipo de consulta seleccionada', () => {
    render(<FormularioAdmision />);

    const selectorConsulta = screen.getByLabelText(/Tipo de Consulta/i);
    const inputCosto = screen.getByLabelText(/Costo/i) as HTMLInputElement;

    // PRE_CONSULTA por defecto = 50
    expect(inputCosto.value).toBe('50');

    // Cambiar a TERAPIA_DIRECTA = 0
    fireEvent.change(selectorConsulta, { target: { value: 'TERAPIA_DIRECTA' } });
    expect(inputCosto.value).toBe('0');

    // Cambiar a CONSULTA_MEDICA = 50
    fireEvent.change(selectorConsulta, { target: { value: 'CONSULTA_MEDICA' } });
    expect(inputCosto.value).toBe('50');
  });

  it('debe enviar los datos del paciente y llamar al servicio crearPaciente con éxito', async () => {
    const mockCreado = {
      id: 'pac-999',
      nombre: 'Maria Flores',
      edad: 28,
      dni: '12345678',
      celular: '999888777',
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
    vi.mocked(pacientesService.crearPaciente).mockResolvedValueOnce(mockCreado as any);

    const onPacienteCreado = vi.fn();
    render(<FormularioAdmision onPacienteCreado={onPacienteCreado} />);

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Maria Flores' } });
    fireEvent.change(screen.getByLabelText(/DNI del Paciente/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/Edad/i), { target: { value: '28' } });
    fireEvent.change(screen.getByLabelText(/Celular/i), { target: { value: '999888777' } });

    const submitBtn = screen.getByRole('button', { name: /Registrar y Derivar/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(pacientesService.crearPaciente).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Maria Flores',
          dni: '12345678',
          edad: 28,
          celular: '999888777'
        })
      );
      expect(onPacienteCreado).toHaveBeenCalledWith(mockCreado);
    });
  });
});
