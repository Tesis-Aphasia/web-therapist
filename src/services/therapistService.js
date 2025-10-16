import { doc, getDoc, getDocs } from "firebase/firestore";
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


export function getPatientsByTherapist(therapistEmail, callback) {
  const ref = collection(db, "pacientes");
  const q = query(ref, where("terapeuta", "==", therapistEmail));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const patients = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const ejerciciosRef = collection(db, "pacientes", docSnap.id, "ejercicios_asignados");
        const ejerciciosSnap = await getDocs(ejerciciosRef);
        const cantidadEjercicios = ejerciciosSnap.size;

        return {
          id: docSnap.id,
          ...data,
          cantidadEjercicios,
        };
      })
    );

    callback(patients);
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

export async function subscribePendingVisibleExercises(therapistEmail, callback) {
  // 1️⃣ Obtener IDs de los pacientes del terapeuta
  const pacientesRef = collection(db, "pacientes");
  const pacientesQuery = query(pacientesRef, where("terapeuta", "==", therapistEmail));
  const pacientesSnap = await getDocs(pacientesQuery);
  const patientIds = pacientesSnap.docs.map((doc) => doc.id); // o doc.data().email si es necesario

  // 2️⃣ Suscribirse a todos los ejercicios pendientes
  const ejerciciosRef = collection(db, "ejercicios");
  const q = query(ejerciciosRef, where("revisado", "==", false));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    // 3️⃣ Filtrar por visibilidad
    const visibleCount = snapshot.docs.filter((doc) => {
      const e = doc.data();
      const isPublic = e.tipo === "publico";
      const isPrivateOwn = e.tipo === "privado" && e.creado_por === therapistEmail;
      const isPrivatePatient = e.tipo === "privado" && patientIds.includes(e.creado_por);
      return isPublic || isPrivateOwn || isPrivatePatient;
    }).length;

    // 4️⃣ Llamar callback con la cantidad
    callback(visibleCount);
  });

  return unsubscribe;
}


//suscribe al conteo de pacientes asignados, viene del atributo de array de pacientes en la coleccion terapeutas
export function subscribeAssignedPatients(therapistEmail, callback) {
  const ref = doc(db, "terapeutas", therapistEmail);
  const unsubscribe = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      const numPacientes = data.pacientes ? data.pacientes.length : 0;
      callback(numPacientes);
    } else {
      callback(0);
    }
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