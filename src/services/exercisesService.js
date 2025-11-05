import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
    getDoc,
  query,
  orderBy,
  updateDoc,
  where,
  getDocs,
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

export async function getVisibleExercisesOnce(therapistId) {
  try {
    // 1️⃣ Obtener IDs (emails o algo identificador) de los pacientes del terapeuta
    const pacientesRef = collection(db, "pacientes");
    const pacientesQuery = query(pacientesRef, where("terapeuta", "==", therapistId));
    const pacientesSnap = await getDocs(pacientesQuery);
    const patientIds = pacientesSnap.docs.map((doc) => doc.id);

    // 2️⃣ Obtener todos los ejercicios
    const ejerciciosRef = collection(db, "ejercicios");
    const ejerciciosSnap = await getDocs(ejerciciosRef);
    const allExercises = ejerciciosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3️⃣ Filtrar según visibilidad
    const visibleExercises = allExercises.filter((e) => {
      if (e.tipo === "publico") return true;
      if (e.tipo === "privado" && e.creado_por === therapistId && !patientIds.includes(e.id_paciente)) return true;
      return false;
    });

    return visibleExercises;
  } catch (err) {
    console.error("❌ Error en getVisibleExercisesOnce:", err);
    return [];
  }
}

export async function getVisibleExercises(therapistId, callback) {
  try {
    // 1️⃣ Obtener IDs (emails o algo identificador) de los pacientes del terapeuta
    const pacientesRef = collection(db, "pacientes");
    const pacientesQuery = query(pacientesRef, where("terapeuta", "==", therapistId));
    const pacientesSnap = await getDocs(pacientesQuery);
    const patientIds = pacientesSnap.docs.map((doc) => doc.id); // puedes usar .email si ese es el campo correcto

    console.log("📋 Pacientes del terapeuta:", patientIds);

    // 2️⃣ Suscribirse a todos los ejercicios
    const ejerciciosRef = collection(db, "ejercicios");
    const unsubscribe = onSnapshot(ejerciciosRef, (snapshot) => {
      const allExercises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 3️⃣ Filtrar según visibilidad
      const visibleExercises = allExercises.filter((e) => {
        if (e.tipo === "publico") return true;
        if (e.tipo === "privado" && e.creado_por === therapistId) return true;
        if (e.tipo === "privado" && patientIds.includes(e.creado_por)) return true;
        if (e.tipo === "privado" && patientIds.includes(e.id_paciente)) return true;
        return false;
      });

      callback(visibleExercises);
    });

    return unsubscribe;
  } catch (err) {
    console.error("❌ Error en getVisibleExercises:", err);
    return () => {}; // fallback vacío
  }
}


export async function getExerciseDetails(id, terapia) {
  try {
    // Determinar la colección según la terapia
    const colName = terapia === "VNEST" ? "ejercicios_VNEST" : "ejercicios_SR";
    const ref = doc(db, colName, id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      console.log(`📄 Detalles obtenidos de ${colName}/${id}:`, data);
      return data;
    } else {
      console.warn(`⚠️ No se encontró documento ${id} en ${colName}`);
      return null;
    }
  } catch (err) {
    console.error("❌ Error obteniendo detalles del ejercicio:", err);
    throw err;
  }
}


export async function getExerciseById(id) {
  try {
    const ref = doc(db, "ejercicios", id);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return null;
  } catch (err) {
    console.error("Error obteniendo ejercicio:", err);
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

/** 🔹 Actualizar los campos específicos del ejercicio SR */
export async function updateExerciseSR(id, data) {
  try {
    const ref = doc(db, "ejercicios_SR", id);
    await updateDoc(ref, data);
    console.log(`✅ Ejercicio SR ${id} actualizado`);
  } catch (err) {
    console.error("Error al actualizar ejercicio SR:", err);
    throw err;
  } 
}

/**
 * 🔹 Generar un ejercicio usando IA
 */
export async function generateExercise(payload) {
  try {
    const res = await fetch("http://localhost:8000/context/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error generando ejercicio IA:", err);
    throw err;
  }
}

// exercisesService.js

export async function personalizeExercise(userId, exerciseId, profile, creado_por) {
  try {
    const response = await fetch("http://localhost:8000/personalize-exercise/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        exercise_id: exerciseId,
        profile: profile,
        creado_por: creado_por
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Error al personalizar el ejercicio");
    }

    console.log("✅ Ejercicio personalizado correctamente:", data);
    return data;
  } catch (err) {
    console.error("❌ Error en personalizeExercise:", err);
    throw err;
  }
}
