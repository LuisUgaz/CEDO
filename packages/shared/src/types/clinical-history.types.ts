export type ClinicalFieldType = 'texto' | 'texto_largo' | 'numero';

export interface CustomClinicalField {
  id: string;
  nombre: string;
  tipo: ClinicalFieldType;
  valor: string;
}

export interface ClinicalHistory {
  id?: string;
  pacienteId: string;
  fechaEvaluacion: string;
  medicoEvaluador?: string | null;
  motivoConsulta: string;
  antecedentes?: string | null;
  evaluacionFisica?: string | null;
  diagnostico: string;
  planTratamiento: string;
  camposDinamicos?: CustomClinicalField[];
  createdAt?: string;
  updatedAt?: string;
}
