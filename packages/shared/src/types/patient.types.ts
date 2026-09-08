export type PatientColor =
  | 'color-fucsia'   // Magnetoterapia
  | 'color-melon'    // Niños / Pediatría
  | 'color-verde'    // Adultos / Electroterapia
  | 'color-amarillo' // Adultos Mayores / Geriatría
  | 'color-azul'     // Masajes / Descontracturantes
  | 'color-anaranjado'; // Doctor / Consulta

export type ConsultationType = 'pre-consulta' | 'post-consulta' | 'no';

export interface CustomClinicalField {
  id: string;
  nombre: string;
  valor: string;
}

export interface Patient {
  id: string;
  nombre: string;
  edad: number;
  dni: string;
  celular: string;
  fechaIngreso: string;
  dniApoderado?: string | null;
  nombreApoderado?: string | null;
  tieneConsulta: ConsultationType;
  costoConsulta: number;
  color: PatientColor;
  costoTerapia: number;
  paqueteActivo: number;
  camposClinicos?: CustomClinicalField[];
  createdAt: string;
  updatedAt: string;
}
