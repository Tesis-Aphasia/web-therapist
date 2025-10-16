import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene todos los contextos almacenados en la colección "contextos"
 * de Firestore. Cada documento debe tener al menos el campo `context`.
 */
export async function getAllContexts() {
  try {
    const snapshot = await getDocs(collection(db, "contextos"));
    const contexts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Contextos cargados: ${contexts.length}`);
    return contexts;
  } catch (err) {
    console.error("Error al obtener contextos:", err);
    throw err;
  }
}
