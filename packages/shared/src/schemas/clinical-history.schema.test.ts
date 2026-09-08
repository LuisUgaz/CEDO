import { describe, it, expect } from 'vitest';
import {
  ClinicalHistorySchema,
  CustomClinicalFieldSchema
} from './clinical-history.schema';

describe('ClinicalHistorySchema & CustomClinicalFieldSchema (Historia Clínica y Evaluación Médica)', () => {
  it('debe validar exitosamente una historia clínica completa y válida', () => {
    const historiaValida = {
      id: 'hist-001',
      pacienteId: 'pac-101',
      fechaEvaluacion: '2026-09-08',
      medicoEvaluador: 'Dr. Fernando Salazar (CMP 45892)',
      motivoConsulta: 'Dolor agudo en hombro derecho de 3 semanas de evolución tras caída',
      antecedentes: 'Hipertensión arterial controlada con Losartán 50mg',
      evaluacionFisica: 'Limitación de abducción a 80°. Dolor a la palpación en tendón supraespinoso. Maniobra de Neer positiva.',
      diagnostico: 'Tendinopatía de manguito rotador hombro derecho (M75.1)',
      planTratamiento: '10 sesiones de fisioterapia: CHC 15min, US 1MHz a 1.2 W/cm2, TENS convencional y ejercicios de Codman',
      camposDinamicos: [
        {
          id: 'field-1',
          nombre: 'Escala Visual Analógica (EVA)',
          tipo: 'numero' as const,
          valor: '7'
        },
        {
          id: 'field-2',
          nombre: 'Evaluación Postural Dinámica',
          tipo: 'texto_largo' as const,
          valor: 'Hombro derecho descendido con rotación interna compensatoria'
        }
      ]
    };

    const resultado = ClinicalHistorySchema.safeParse(historiaValida);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.pacienteId).toBe('pac-101');
      expect(resultado.data.diagnostico).toContain('Tendinopatía');
      expect(resultado.data.camposDinamicos).toHaveLength(2);
      expect(resultado.data.camposDinamicos[0].nombre).toBe('Escala Visual Analógica (EVA)');
    }
  });

  it('debe rechazar una historia clínica si pacienteId está vacío', () => {
    const historiaInvalida = {
      pacienteId: '',
      fechaEvaluacion: '2026-09-08',
      motivoConsulta: 'Dolor lumbar mecánico',
      diagnostico: 'Lumbalgia aguda',
      planTratamiento: '10 sesiones de fisioterapia'
    };

    const resultado = ClinicalHistorySchema.safeParse(historiaInvalida);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const issue = resultado.error.issues.find(i => i.path.includes('pacienteId'));
      expect(issue).toBeDefined();
    }
  });

  it('debe rechazar si motivoConsulta, diagnostico o planTratamiento están ausentes o vacíos', () => {
    const historiaSinDx = {
      pacienteId: 'pac-200',
      fechaEvaluacion: '2026-09-08',
      motivoConsulta: 'Dolor en rodilla izquierda',
      diagnostico: '',
      planTratamiento: 'Reposo y termoterapia'
    };

    const resultadoDx = ClinicalHistorySchema.safeParse(historiaSinDx);
    expect(resultadoDx.success).toBe(false);

    const historiaSinMotivo = {
      pacienteId: 'pac-200',
      fechaEvaluacion: '2026-09-08',
      motivoConsulta: '  ',
      diagnostico: 'Gonartrosis bilateral',
      planTratamiento: 'Terapia física'
    };

    const resultadoMotivo = ClinicalHistorySchema.safeParse(historiaSinMotivo);
    expect(resultadoMotivo.success).toBe(false);
  });

  it('debe inicializar camposDinamicos como array vacío por defecto si no se proporciona', () => {
    const historiaMinima = {
      pacienteId: 'pac-300',
      fechaEvaluacion: '2026-09-08',
      motivoConsulta: 'Contractura muscular cervical',
      diagnostico: 'Cervicalgia tensional',
      planTratamiento: 'Masoterapia descontracturante y CHC'
    };

    const resultado = ClinicalHistorySchema.safeParse(historiaMinima);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.camposDinamicos).toEqual([]);
      expect(resultado.data.antecedentes).toBe('');
      expect(resultado.data.evaluacionFisica).toBe('');
    }
  });

  it('debe validar un campo dinámico individual con CustomClinicalFieldSchema', () => {
    const campoValido = {
      id: 'f-1',
      nombre: 'Test de Phalen',
      tipo: 'texto' as const,
      valor: 'Positivo en mano derecha tras 60s'
    };

    const res = CustomClinicalFieldSchema.safeParse(campoValido);
    expect(res.success).toBe(true);

    const campoInvalidoNombre = {
      id: 'f-2',
      nombre: ' ',
      tipo: 'texto' as const,
      valor: 'Sin datos'
    };

    const resInvalido = CustomClinicalFieldSchema.safeParse(campoInvalidoNombre);
    expect(resInvalido.success).toBe(false);
  });
});
