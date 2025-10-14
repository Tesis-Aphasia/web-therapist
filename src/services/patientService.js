import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * 🔹 Escucha en tiempo real los pacientes asignados a un terapeuta
 */
export function getPatientsByTherapist(therapistEmail, callback) {
  const q = query(collection(db, "pacientes"), where("terapeuta", "==", therapistEmail));
  const unsubscribe = onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
  return unsubscribe;
}

/**
 * 🔹 Buscar paciente por ID
 */
export async function getPatientById(patientId) {
  try {
    const ref = doc(db, "pacientes", patientId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Error al obtener paciente:", err);
    throw err;
  }
}

/**
 * 🔹 Actualizar información del paciente
 */
export async function updatePatient(patientId, data) {
  try {
    const ref = doc(db, "pacientes", patientId);
    await updateDoc(ref, data);
  } catch (err) {
    console.error("Error al actualizar paciente:", err);
    throw err;
  }
}

/**
 * 🔹 Asignar paciente a un terapeuta
 */
export async function assignPatientToTherapist(patientId, therapistEmail) {
  try {
    const ref = doc(db, "pacientes", patientId);
    await updateDoc(ref, { terapeuta: therapistEmail });
    console.log(`✅ Paciente ${patientId} asignado a ${therapistEmail}`);
  } catch (err) {
    console.error("Error al asignar paciente:", err);
    throw err;
  }
}
