import { describe, it, expect } from 'vitest';
import { PatientSchema } from './patient.schema';

describe('PatientSchema (Validación de Reglas Clínicas de Pacientes)', () => {
  it('debe validar exitosamente a un paciente adulto con datos correctos', () => {
    const pacienteAdulto = {
      id: 'pac-101',
      nombre: 'Carlos Mendoza',
      edad: 35,
      dni: '45879632',
      celular: '978541236',
      fechaIngreso: '2026-09-07',
      tieneConsulta: 'pre-consulta' as const,
      costoConsulta: 50,
      color: 'color-verde' as const,
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: '2026-09-07T10:00:00Z',
      updatedAt: '2026-09-07T10:00:00Z'
    };

    const resultado = PatientSchema.safeParse(pacienteAdulto);
    expect(resultado.success).toBe(true);
  });

  it('debe rechazar a un menor de 18 años si no se proporciona DNI de apoderado', () => {
    const pacienteMenorSinApoderado = {
      id: 'pac-102',
      nombre: 'Luciana Ramos',
      edad: 14,
      dni: '78965412',
      celular: '987456321',
      fechaIngreso: '2026-09-07',
      tieneConsulta: 'no' as const,
      costoConsulta: 0,
      color: 'color-melon' as const,
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: '2026-09-07T10:00:00Z',
      updatedAt: '2026-09-07T10:00:00Z'
    };

    const resultado = PatientSchema.safeParse(pacienteMenorSinApoderado);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const errorMsg = resultado.error.issues[0].message;
      expect(errorMsg).toContain('menores de 18 años');
    }
  });

  it('debe aceptar a un menor de 18 años cuando cuenta con DNI de apoderado válido de 8 dígitos', () => {
    const pacienteMenorConApoderado = {
      id: 'pac-103',
      nombre: 'Mateo Quispe',
      edad: 8,
      dni: '85296374',
      celular: '965874123',
      fechaIngreso: '2026-09-07',
      dniApoderado: '10258963',
      nombreApoderado: 'Rosa Quispe (Madre)',
      tieneConsulta: 'pre-consulta' as const,
      costoConsulta: 50,
      color: 'color-melon' as const,
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: '2026-09-07T10:00:00Z',
      updatedAt: '2026-09-07T10:00:00Z'
    };

    const resultado = PatientSchema.safeParse(pacienteMenorConApoderado);
    expect(resultado.success).toBe(true);
  });

  it('debe rechazar DNI que no contenga exactamente 8 dígitos numéricos', () => {
    const pacienteDniInvalido = {
      id: 'pac-104',
      nombre: 'Alberto Vega',
      edad: 40,
      dni: '4587963A', // Contiene letra
      celular: '978541236',
      fechaIngreso: '2026-09-07',
      tieneConsulta: 'no' as const,
      costoConsulta: 0,
      color: 'color-verde' as const,
      costoTerapia: 35,
      paqueteActivo: 1,
      createdAt: '2026-09-07T10:00:00Z',
      updatedAt: '2026-09-07T10:00:00Z'
    };

    const resultado = PatientSchema.safeParse(pacienteDniInvalido);
    expect(resultado.success).toBe(false);
  });

  it('debe rechazar a un menor de 18 años si tiene DNI de apoderado pero falta el nombre del apoderado', () => {
    const menorSinNombreApoderado = {
      nombre: 'Mateo Quispe',
      edad: 8,
      dni: '85296374',
      celular: '965874123',
      fechaIngreso: '2026-09-08',
      dniApoderado: '10258963',
      nombreApoderado: '',
      tipoConsulta: 'PRE_CONSULTA' as const,
      costoConsulta: 50,
      color: 'color-melon' as const,
      costoTerapia: 35,
      paqueteActivo: 1
    };

    const resultado = PatientSchema.safeParse(menorSinNombreApoderado);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.some(i => i.path.includes('nombreApoderado'))).toBe(true);
    }
  });

  it('debe aceptar los nuevos tipos de consulta médica y fisioterapéutica', () => {
    const pacienteConConsulta = {
      nombre: 'Lucia Ramirez',
      edad: 28,
      dni: '74125896',
      celular: '998877665',
      fechaIngreso: '2026-09-08',
      tipoConsulta: 'EVALUACION_FISIOTERAPEUTICA' as const,
      costoConsulta: 50,
      estadoTriage: 'en_espera' as const,
      color: 'color-verde' as const,
      costoTerapia: 35,
      paqueteActivo: 1
    };

    const resultado = PatientSchema.safeParse(pacienteConConsulta);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.tipoConsulta).toBe('EVALUACION_FISIOTERAPEUTICA');
      expect(resultado.data.estadoTriage).toBe('en_espera');
    }
  });
});

