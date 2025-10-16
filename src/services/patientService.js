import {
  collection,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";



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

export async function updatePatient(patientId, data) {
  try {
    const ref = doc(db, "pacientes", patientId);
    await updateDoc(ref, data);
  } catch (err) {
    console.error("Error al actualizar paciente:", err);
    throw err;
  }
}

export async function assignPatientToTherapist(patientId, therapistEmail) {
  try {
    const ref = doc(db, "pacientes", patientId);
    await updateDoc(ref, { terapeuta: therapistEmail });
    
    const ref2 = doc(db, "terapeutas", therapistEmail);
    await updateDoc(ref2, { pacientes: arrayUnion(patientId) });

    console.log(`✅ Paciente ${patientId} asignado a ${therapistEmail}`);
  } catch (err) {
    console.error("Error al asignar paciente:", err);
    throw err;
  }
}

export async function assignExerciseToPatient(patientId, exerciseId) {
  try {
    const payload = {
      user_id: patientId,      
      exercise_id: exerciseId, 
    };

    console.log("📤 Enviando payload:", payload);

    const response = await fetch("http://localhost:8000/assign-exercise/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("⚠️ Respuesta del backend:", data);
      throw new Error(data.detail || data.error || "Error asignando el ejercicio");
    }

    console.log(`✅ Ejercicio asignado correctamente:`, data.message);
    return data;
  } catch (err) {
    console.error("❌ Error en assignExerciseToPatient:", err);
    throw err;
  }
}



export function getAssignedExercises(patientId, callback) {
  const ref = collection(db, "pacientes", patientId, "ejercicios_asignados");

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });

  return unsubscribe;
}
