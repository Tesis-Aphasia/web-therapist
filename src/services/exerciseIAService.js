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
