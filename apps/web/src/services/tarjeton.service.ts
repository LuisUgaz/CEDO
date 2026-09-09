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
  TherapySheetSchema,
  type TherapySheet,
  type TherapySheetInput
} from '@cedo/shared';

export const COLECCION_TARJETONES = 'tarjetones_tratamiento';

/**
 * Guarda o actualiza una prescripción fisioterapéutica (tarjetón) en Cloud Firestore.
 * Valida previamente los campos mediante TherapySheetSchema de Zod.
 */
export async function guardarTarjetonTratamiento(
  datos: TherapySheetInput
): Promise<TherapySheet> {
  const datosValidados = TherapySheetSchema.parse(datos);
  const timestampActual = new Date().toISOString();

  const tarjetonAGuardar: Omit<TherapySheet, 'id'> = {
    pacienteId: datosValidados.pacienteId,
    numeroPaquete: datosValidados.numeroPaquete,
    fecha: datosValidados.fecha,
    tipoAtencion: datosValidados.tipoAtencion,
    diagnostico: datosValidados.diagnostico || '',
    sesionNumero: datosValidados.sesionNumero || '',
    tecnicasSeleccionadas: (datosValidados.tecnicasSeleccionadas || []) as any,
    indicacionesAdicionales: datosValidados.indicacionesAdicionales || [],
    formatoImpresion: datosValidados.formatoImpresion,
    updatedAt: timestampActual
  };

  if (datosValidados.id) {
    const docRef = doc(db, COLECCION_TARJETONES, datosValidados.id);
    await setDoc(docRef, tarjetonAGuardar, { merge: true });
    return {
      id: datosValidados.id,
      ...tarjetonAGuardar
    };
  } else {
    const coleccionRef = collection(db, COLECCION_TARJETONES);
    const docRef = await addDoc(coleccionRef, tarjetonAGuardar);
    return {
      id: docRef.id,
      ...tarjetonAGuardar
    };
  }
}

/**
 * Obtiene el tarjetón de tratamiento fisioterapéutico activo de un paciente.
 */
export async function obtenerTarjetonPorPaciente(
  pacienteId: string,
  numeroPaquete?: number
): Promise<TherapySheet | null> {
  const coleccionRef = collection(db, COLECCION_TARJETONES);
  const consulta = numeroPaquete !== undefined
    ? query(
        coleccionRef,
        where('pacienteId', '==', pacienteId),
        where('numeroPaquete', '==', numeroPaquete)
      )
    : query(coleccionRef, where('pacienteId', '==', pacienteId));

  const snapshot = await getDocs(consulta);

  if (snapshot.empty || snapshot.docs.length === 0) {
    return null;
  }

  const primerDoc = snapshot.docs[0];
  return {
    id: primerDoc.id,
    ...(primerDoc.data() as Omit<TherapySheet, 'id'>)
  };
}

/**
 * Suscripción reactiva en tiempo real al tarjetón de tratamiento de un paciente.
 */
export function suscribirTarjetonPorPaciente(
  pacienteId: string,
  onUpdate: (tarjeton: TherapySheet | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const coleccionRef = collection(db, COLECCION_TARJETONES);
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
        ...(primerDoc.data() as Omit<TherapySheet, 'id'>)
      });
    },
    onError
  );
}
