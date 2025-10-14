import {collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function assignExerciseToPatient(patientId, exerciseId, data = {}) {
  try {
    const ejerciciosRef = collection(db, "pacientes", patientId, "ejercicios_asignados");
    const payload = {
      id_ejercicio: exerciseId,
      estado: data.estado || "pendiente",
      prioridad: data.prioridad || 1,
      ultima_fecha_realizado: data.ultima_fecha_realizado || null,
      veces_realizado: data.veces_realizado || 0,
      asignado_en: Timestamp.now(),
    };

    await addDoc(ejerciciosRef, payload);
    console.log(`✅ Ejercicio ${exerciseId} asignado a ${patientId}`);
  } catch (err) {
    console.error("❌ Error asignando ejercicio:", err);
    throw err;
  }
}

//getExeercisbyID
export async function getExerciseById(exerciseId) {
  try {
    const ref = doc(db, "ejercicios", exerciseId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Error al obtener ejercicio:", err);
    throw err;
  } 
}