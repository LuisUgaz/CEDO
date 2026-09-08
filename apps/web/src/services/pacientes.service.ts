import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  PatientSchema,
  type Patient,
  type PatientInput,
  type TriageStatus
} from '@cedo/shared';

const COLECCION_PACIENTES = 'pacientes';

/**
 * Registra un nuevo paciente en Cloud Firestore tras validar las reglas de negocio y minoridad.
 * Asigna automáticamente el estado de triage inicial 'en_espera' si no fue especificado.
 */
export async function crearPaciente(datos: PatientInput): Promise<Patient> {
  const datosValidados = PatientSchema.parse(datos);

  const timestampActual = new Date().toISOString();
  const pacienteAGuardar: Omit<Patient, 'id'> = {
    nombre: datosValidados.nombre,
    edad: datosValidados.edad,
    dni: datosValidados.dni,
    celular: datosValidados.celular,
    fechaIngreso: datosValidados.fechaIngreso,
    dniApoderado: datosValidados.dniApoderado || null,
    nombreApoderado: datosValidados.nombreApoderado || null,
    tipoConsulta: datosValidados.tipoConsulta || 'PRE_CONSULTA',
    tieneConsulta: datosValidados.tieneConsulta || 'pre-consulta',
    costoConsulta: datosValidados.costoConsulta ?? 50,
    estadoTriage: datosValidados.estadoTriage || 'en_espera',
    color: datosValidados.color || 'color-verde',
    costoTerapia: datosValidados.costoTerapia ?? 35,
    paqueteActivo: datosValidados.paqueteActivo ?? 1,
    ocupacion: datosValidados.ocupacion || null,
    direccion: datosValidados.direccion || null,
    createdAt: datosValidados.createdAt || timestampActual,
    updatedAt: timestampActual
  };

  const coleccionRef = collection(db, COLECCION_PACIENTES);
  const docRef = await addDoc(coleccionRef, pacienteAGuardar);

  return {
    id: docRef.id,
    ...pacienteAGuardar
  };
}

/**
 * Obtiene la lista instantánea de pacientes actualmente en sala de espera de triage.
 */
export async function listarPacientesEnEspera(): Promise<Patient[]> {
  const coleccionRef = collection(db, COLECCION_PACIENTES);
  const consulta = query(coleccionRef, where('estadoTriage', '==', 'en_espera'));
  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...(documento.data() as Omit<Patient, 'id'>)
  }));
}

/**
 * Se suscribe en tiempo real a los cambios de la cola de triage en recepción.
 * Permite que los médicos y fisioterapeutas vean de inmediato a los pacientes que van ingresando.
 */
export function suscribirPacientesEnEspera(
  onUpdate: (pacientes: Patient[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const coleccionRef = collection(db, COLECCION_PACIENTES);
  const consulta = query(coleccionRef, where('estadoTriage', '==', 'en_espera'));

  return onSnapshot(
    consulta,
    (snapshot) => {
      const pacientes = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...(documento.data() as Omit<Patient, 'id'>)
      }));
      onUpdate(pacientes);
    },
    onError
  );
}

/**
 * Actualiza el estado de triage de un paciente (por ejemplo, al pasar a evaluación médica o finalizar atención).
 */
export async function actualizarEstadoTriage(
  pacienteId: string,
  nuevoEstado: TriageStatus
): Promise<void> {
  const docRef = doc(db, COLECCION_PACIENTES, pacienteId);
  await updateDoc(docRef, {
    estadoTriage: nuevoEstado,
    updatedAt: new Date().toISOString()
  });
}
