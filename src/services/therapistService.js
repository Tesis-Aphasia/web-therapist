import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ERROR_MESSAGES, COLLECTIONS } from "../constants";


/**
 * Authenticate therapist with email and password
 * @param {string} email - Therapist email
 * @param {string} password - Therapist password
 * @returns {Promise<boolean>} Authentication result
 * @throws {Error} If authentication fails
 */
export async function loginTherapist(email, password) {
  try {
    if (!email || !password) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const ref = doc(db, COLLECTIONS.THERAPISTS, email);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const data = snap.data();
    const isValid = data.password === password;
    
    if (!isValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    return true;
  } catch (err) {
    console.error("Error al verificar terapeuta:", err);
    throw err;
  }
}

/**
 * Get therapist data by email
 * @param {string} email - Therapist email
 * @returns {Promise<Object|null>} Therapist data or null if not found
 * @throws {Error} If database operation fails
 */
export async function getTherapistData(email) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const ref = doc(db, COLLECTIONS.THERAPISTS, email);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      return null;
    }

    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Error obteniendo terapeuta:", err);
    throw err;
  }
}


/**
 * Subscribe to patients by therapist email
 * @param {string} therapistEmail - Therapist email
 * @param {Function} callback - Callback function to receive patients data
 * @returns {Function} Unsubscribe function
 */
export function getPatientsByTherapist(therapistEmail, callback) {
  if (!therapistEmail) {
    console.error("Therapist email is required");
    return () => {};
  }

  const ref = collection(db, COLLECTIONS.PATIENTS);
  const q = query(ref, where("terapeuta", "==", therapistEmail));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    try {
      const patients = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const ejerciciosRef = collection(db, COLLECTIONS.PATIENTS, docSnap.id, COLLECTIONS.ASSIGNED_EXERCISES);
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
    } catch (error) {
      console.error("Error processing patients data:", error);
      callback([]);
    }
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