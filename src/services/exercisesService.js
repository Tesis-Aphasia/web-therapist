import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
    getDoc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * 🔹 Trae solo la información general de los ejercicios
 *    (sin detalles VNEST o SR)
 */
export function getAllExercises(callback) {
  const q = query(collection(db, "ejercicios"), orderBy("id"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

/**
 * 🔹 Trae los detalles extendidos (cuando el usuario edita)
 *    según el tipo de terapia.
 */
export async function getExerciseDetails(id, terapia) {
  try {
    const col =
      terapia === "VNEST" ? "ejercicios_VNEST" : "ejercicios_SR";
    const ref = doc(db, col, id);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return null;
  } catch (err) {
    console.error("Error obteniendo detalles del ejercicio:", err);
    throw err;
  }
}

/**
 * 🔹 Eliminar un ejercicio y su versión extendida (opcional)
 */
export async function deleteExercise(id, terapia) {
  try {
    await deleteDoc(doc(db, "ejercicios", id));
    if (terapia === "VNEST")
      await deleteDoc(doc(db, "ejercicios_VNEST", id));
    else if (terapia === "SR")
      await deleteDoc(doc(db, "ejercicios_SR", id));

    console.log(`🗑️ Ejercicio ${id} eliminado (${terapia})`);
  } catch (err) {
    console.error("Error eliminando ejercicio:", err);
  }
}

/**
 * 🔹 Actualizar los campos generales del ejercicio
 */
export async function updateExercise(id, data) {
  try {
    const ref = doc(db, "ejercicios", id);
    await updateDoc(ref, data);
    console.log(`✅ Ejercicio ${id} actualizado`);
  } catch (err) {
    console.error("Error al actualizar ejercicio:", err);
    throw err;
  }
}
