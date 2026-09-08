import {
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  ClinicalHistorySchema,
  type ClinicalHistory,
  type ClinicalHistoryInput
} from '@cedo/shared';
import { actualizarEstadoTriage } from './pacientes.service';

const COLECCION_HISTORIAS = 'historias_clinicas';

/**
 * Guarda o actualiza una historia clínica en Cloud Firestore previa validación de esquemas Zod.
 * Si cuenta con un ID existente, realiza merge/actualización; de lo contrario genera un nuevo registro.
 */
export async function guardarHistoriaClinica(
  datos: ClinicalHistoryInput
): Promise<ClinicalHistory> {
  const datosValidados = ClinicalHistorySchema.parse(datos);
  const timestampActual = new Date().toISOString();

  const historiaAGuardar: Omit<ClinicalHistory, 'id'> = {
    pacienteId: datosValidados.pacienteId,
    fechaEvaluacion: datosValidados.fechaEvaluacion,
    medicoEvaluador: datosValidados.medicoEvaluador || null,
    motivoConsulta: datosValidados.motivoConsulta,
    antecedentes: datosValidados.antecedentes || '',
    evaluacionFisica: datosValidados.evaluacionFisica || '',
    diagnostico: datosValidados.diagnostico,
    planTratamiento: datosValidados.planTratamiento,
    camposDinamicos: datosValidados.camposDinamicos || [],
    createdAt: datosValidados.createdAt || timestampActual,
    updatedAt: timestampActual
  };

  if (datosValidados.id) {
    const docRef = doc(db, COLECCION_HISTORIAS, datosValidados.id);
    await setDoc(docRef, historiaAGuardar, { merge: true });
    return {
      id: datosValidados.id,
      ...historiaAGuardar
    };
  } else {
    const coleccionRef = collection(db, COLECCION_HISTORIAS);
    const docRef = await addDoc(coleccionRef, historiaAGuardar);
    return {
      id: docRef.id,
      ...historiaAGuardar
    };
  }
}

/**
 * Obtiene la historia clínica activa de un paciente según su identificador único.
 */
export async function obtenerHistoriaClinicaPorPaciente(
  pacienteId: string
): Promise<ClinicalHistory | null> {
  const coleccionRef = collection(db, COLECCION_HISTORIAS);
  const consulta = query(coleccionRef, where('pacienteId', '==', pacienteId));
  const snapshot = await getDocs(consulta);

  if (snapshot.empty || snapshot.docs.length === 0) {
    return null;
  }

  const primerDoc = snapshot.docs[0];
  return {
    id: primerDoc.id,
    ...(primerDoc.data() as Omit<ClinicalHistory, 'id'>)
  };
}

/**
 * Se suscribe en tiempo real a las modificaciones de la historia clínica de un paciente.
 */
export function suscribirHistoriaClinica(
  pacienteId: string,
  onUpdate: (historia: ClinicalHistory | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const coleccionRef = collection(db, COLECCION_HISTORIAS);
  const consulta = query(coleccionRef, where('pacienteId', '==', pacienteId));

  return onSnapshot(
    consulta,
    (snapshot) => {
      if (snapshot.empty || snapshot.docs.length === 0) {
        onUpdate(null);
        return;
      }
      const primerDoc = snapshot.docs[0];
      onUpdate({
        id: primerDoc.id,
        ...(primerDoc.data() as Omit<ClinicalHistory, 'id'>)
      });
    },
    onError
  );
}

/**
 * Concluye la evaluación médica de un paciente y actualiza su estado en la cola de triage a 'atendido'.
 */
export async function finalizarEvaluacionMedica(pacienteId: string): Promise<void> {
  await actualizarEstadoTriage(pacienteId, 'atendido');
}
