import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";


export async function loginTherapist(email, password) {
  try {
    const ref = doc(db, "terapeutas", email);
    const snap = await getDoc(ref);

    if (!snap.exists()) return false;
    const data = snap.data();
    return data.password === password;
  } catch (err) {
    console.error("Error al verificar terapeuta:", err);
    throw err;
  }
}

export async function getTherapistData(email) {
  try {
    const ref = doc(db, "terapeutas", email);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("Error obteniendo terapeuta:", err);
    return null;
  }
}


/**
 * 🔹 Suscribe en tiempo real al conteo de pacientes asignados
 */
export function subscribePatientsByTherapist(email, callback) {
  const pacientesRef = collection(db, "pacientes");
  const q = query(pacientesRef, where("terapeuta", "==", email));
  const unsubscribe = onSnapshot(q, (snap) => {
    callback(snap.size);
  });
  return unsubscribe;
}

/**
 * 🔹 Suscribe al conteo de ejercicios no revisados
 */
export function subscribePendingExercises(callback) {
  const ejerciciosRef = collection(db, "ejercicios");
  const q = query(ejerciciosRef, where("revisado", "==", false));
  const unsubscribe = onSnapshot(q, (snap) => {
    callback(snap.size);
  });
  return unsubscribe;
}


/**
 * 🔹 Obtiene la información del terapeuta
 */
export async function getTherapistProfile(email) {
  try {
    const ref = doc(db, "terapeutas", email);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (err) {
    console.error("Error obteniendo perfil del terapeuta:", err);
    throw err;
  }
}