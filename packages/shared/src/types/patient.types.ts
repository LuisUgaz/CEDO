export type PatientColor =
  | 'color-fucsia'   // Magnetoterapia
  | 'color-melon'    // Niños / Pediatría
  | 'color-verde'    // Adultos / Electroterapia
  | 'color-amarillo' // Adultos Mayores / Geriatría
  | 'color-azul'     // Masajes / Descontracturantes
  | 'color-anaranjado'; // Doctor / Consulta

export type ConsultationType =
  | 'PRE_CONSULTA'
  | 'CONSULTA_MEDICA'
  | 'EVALUACION_FISIOTERAPEUTICA'
  | 'TERAPIA_DIRECTA'
  | 'pre-consulta'
  | 'post-consulta'
  | 'no';

export type TriageStatus = 'en_espera' | 'en_evaluacion' | 'atendido';

import type { CustomClinicalField } from './clinical-history.types';

export interface Patient {
  id: string;
  nombre: string;
  edad: number;
  dni: string;
  celular: string;
  fechaIngreso: string;
  dniApoderado?: string | null;
  nombreApoderado?: string | null;
  tieneConsulta?: ConsultationType;
  tipoConsulta?: ConsultationType;
  costoConsulta: number;
  estadoTriage: TriageStatus;
  color: PatientColor;
  costoTerapia: number;
  paqueteActivo: number;
  ocupacion?: string | null;
  direccion?: string | null;
  camposClinicos?: CustomClinicalField[];
  createdAt: string;
  updatedAt: string;
}
