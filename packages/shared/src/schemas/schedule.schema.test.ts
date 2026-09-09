import { describe, it, expect } from 'vitest';
import {
  scheduleSlotSchema,
  weekScheduleSchema,
  generarPlantillaSemana,
  calcularRangoSemana,
  ESPECIALIDADES_COLORES,
  DIAS_SEMANA,
  HORAS_JORNADA_DEFAULT
} from './schedule.schema';

describe('Esquemas Zod y Utilidades de Agenda Semanal (@cedo/shared)', () => {
  describe('scheduleSlotSchema', () => {
    it('debe validar un slot horario completo y válido', () => {
      const slotValido = {
        id: 'lunes_09:00',
        hora: '09:00',
        dia: 'lunes' as const,
        pacienteId: 'pac-123',
        nombrePaciente: 'Carlos Mendoza',
        color: 'color-fucsia' as const,
        asistio: true,
        nota: 'Primera sesión de magnetoterapia lumbar',
        terapeutaId: 'ter-456'
      };

      const resultado = scheduleSlotSchema.safeParse(slotValido);
      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.hora).toBe('09:00');
        expect(resultado.data.dia).toBe('lunes');
        expect(resultado.data.asistio).toBe(true);
        expect(resultado.data.color).toBe('color-fucsia');
      }
    });

    it('debe validar un slot vacío asignando asistio en false por defecto', () => {
      const slotVacio = {
        id: 'martes_10:00',
        hora: '10:00',
        dia: 'martes' as const
      };

      const resultado = scheduleSlotSchema.safeParse(slotVacio);
      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.asistio).toBe(false);
        expect(resultado.data.pacienteId).toBeNull();
        expect(resultado.data.nombrePaciente).toBeUndefined();
      }
    });

    it('debe rechazar un día no laboral o inválido como domingo', () => {
      const slotInvalido = {
        id: 'domingo_10:00',
        hora: '10:00',
        dia: 'domingo'
      };

      const resultado = scheduleSlotSchema.safeParse(slotInvalido);
      expect(resultado.success).toBe(false);
    });

    it('debe rechazar un formato de hora incorrecto', () => {
      const slotHoraInvalida = {
        id: 'miercoles_25:00',
        hora: '25:00',
        dia: 'miercoles' as const
      };

      const resultado = scheduleSlotSchema.safeParse(slotHoraInvalida);
      expect(resultado.success).toBe(false);
    });

    it('debe rechazar un color no registrado en el sistema clínico', () => {
      const slotColorInvalido = {
        id: 'jueves_11:00',
        hora: '11:00',
        dia: 'jueves' as const,
        color: 'color-desconocido'
      };

      const resultado = scheduleSlotSchema.safeParse(slotColorInvalido);
      expect(resultado.success).toBe(false);
    });
  });

  describe('weekScheduleSchema', () => {
    it('debe validar una agenda semanal completa con sus 6 días y slots', () => {
      const agendaValida = {
        id: '2026_09_sem2',
        anio: 2026,
        mes: '09',
        numeroSemana: 2,
        rangoFechas: '07/09/2026 - 12/09/2026',
        estadoDias: {
          lunes: 'laboral' as const,
          martes: 'laboral' as const,
          miercoles: 'laboral' as const,
          jueves: 'laboral' as const,
          viernes: 'laboral' as const,
          sabado: 'laboral' as const
        },
        slots: [
          {
            id: 'lunes_08:00',
            hora: '08:00',
            dia: 'lunes' as const,
            asistio: false
          }
        ],
        updatedAt: new Date().toISOString()
      };

      const resultado = weekScheduleSchema.safeParse(agendaValida);
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar años fuera del rango admitido (2026 - 2035)', () => {
      const agendaAnioInvalido = {
        id: '2020_01_sem1',
        anio: 2020,
        mes: '01',
        numeroSemana: 1,
        rangoFechas: '01/01/2020 - 06/01/2020',
        estadoDias: {
          lunes: 'laboral',
          martes: 'laboral',
          miercoles: 'laboral',
          jueves: 'laboral',
          viernes: 'laboral',
          sabado: 'laboral'
        },
        slots: [],
        updatedAt: new Date().toISOString()
      };

      const resultado = weekScheduleSchema.safeParse(agendaAnioInvalido);
      expect(resultado.success).toBe(false);
    });

    it('debe rechazar semanas mayores a 5 o menores a 1', () => {
      const agendaSemanaInvalida = {
        id: '2026_09_sem6',
        anio: 2026,
        mes: '09',
        numeroSemana: 6,
        rangoFechas: '28/09/2026 - 03/10/2026',
        estadoDias: {
          lunes: 'laboral',
          martes: 'laboral',
          miercoles: 'laboral',
          jueves: 'laboral',
          viernes: 'laboral',
          sabado: 'laboral'
        },
        slots: [],
        updatedAt: new Date().toISOString()
      };

      const resultado = weekScheduleSchema.safeParse(agendaSemanaInvalida);
      expect(resultado.success).toBe(false);
    });
  });

  describe('Funciones de Utilidad de Calendario y Horarios', () => {
    it('debe generar una plantilla semanal vacía con id estructurado y días laborales', () => {
      const plantilla = generarPlantillaSemana(2026, 9, 2);

      expect(plantilla.id).toBe('2026_09_sem2');
      expect(plantilla.anio).toBe(2026);
      expect(plantilla.mes).toBe('09');
      expect(plantilla.numeroSemana).toBe(2);
      expect(plantilla.estadoDias.lunes).toBe('laboral');
      expect(plantilla.estadoDias.sabado).toBe('laboral');
      expect(plantilla.slots.length).toBe(DIAS_SEMANA.length * HORAS_JORNADA_DEFAULT.length);
      expect(plantilla.rangoFechas).toBeTruthy();
    });

    it('debe calcular el rango de fechas para una semana dada', () => {
      const rango = calcularRangoSemana(2026, 9, 2);
      expect(rango).toContain('2026');
      expect(rango).toContain('-');
    });

    it('debe proveer la lista oficial de especialidades y sus códigos de color', () => {
      expect(ESPECIALIDADES_COLORES['color-fucsia'].label).toBe('Magnetoterapia');
      expect(ESPECIALIDADES_COLORES['color-melon'].label).toBe('Niños / Pediatría');
      expect(ESPECIALIDADES_COLORES['color-verde'].label).toBe('Adultos / Electroterapia');
      expect(ESPECIALIDADES_COLORES['color-amarillo'].label).toBe('Adultos Mayores / Geriatría');
      expect(ESPECIALIDADES_COLORES['color-azul'].label).toBe('Masajes / Descontracturantes');
      expect(ESPECIALIDADES_COLORES['color-anaranjado'].label).toBe('Doctor / Consulta Médica');
    });
  });
});
