import React, { useEffect, useState } from "react";
import {
  updateExercise,
  getExerciseDetails,
} from "../../services/exercisesService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./SREditor.css";

const SREditor = ({ open, onClose, exercise }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    pregunta: "",
    rta_correcta: "",
    revisado: false,
  });

  // 🔹 Cargar detalles desde la subcolección ejercicios_SR
  useEffect(() => {
    if (!exercise) return;
    const loadDetails = async () => {
      try {
        const data = await getExerciseDetails(exercise.id, "SR");
        if (data) {
          setForm({
            pregunta: data.pregunta || "",
            rta_correcta: data.rta_correcta || "",
            revisado: Boolean(exercise.revisado),
          });
        }
      } catch (err) {
        console.error("Error cargando ejercicio SR:", err);
        setError("No se pudo cargar el ejercicio.");
      }
    };
    loadDetails();
  }, [exercise]);

  // 🔹 Guardar cambios tanto en `ejercicios` como en `ejercicios_SR`
  const handleSave = async () => {
    if (!exercise) return;
    setError("");
    setSaving(true);
    try {
      // 1️⃣ Actualizar datos específicos en ejercicios_SR
      const refSR = doc(db, "ejercicios_SR", exercise.id);
      await updateDoc(refSR, {
        pregunta: form.pregunta.trim(),
        rta_correcta: form.rta_correcta.trim(),
      });

      // 2️⃣ Actualizar info general (estado de revisión)
      await updateExercise(exercise.id, {
        revisado: Boolean(form.revisado),
      });

      onClose(true);
    } catch (e) {
      console.error("Error guardando ejercicio SR:", e);
      setError(e?.message || "Error al guardar el ejercicio.");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !exercise) return null;

  return (
    <div className="modal-backdrop d-flex align-items-center justify-content-center">
      <div
        className="modal-content p-4 rounded-4 shadow-lg bg-white"
        style={{ maxWidth: "600px", width: "95%" }}
      >
        {/* === HEADER === */}
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h4 className="fw-bold text-primary m-0">Editar Ejercicio SR</h4>
          <button
            className="btn btn-light btn-sm"
            onClick={() => onClose(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* === FORMULARIO === */}
        <div className="mb-4">
          <div className="mb-3">
            <label className="form-label small fw-semibold">Pregunta</label>
            <input
              type="text"
              className="form-control"
              value={form.pregunta}
              onChange={(e) =>
                setForm((p) => ({ ...p, pregunta: e.target.value }))
              }
              placeholder="¿Dónde guardas la leche?"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Respuesta correcta</label>
            <input
              type="text"
              className="form-control"
              value={form.rta_correcta}
              onChange={(e) =>
                setForm((p) => ({ ...p, rta_correcta: e.target.value }))
              }
              placeholder="En la nevera"
            />
          </div>

          <div className="form-check mb-3">
            <input
              id="revisado"
              type="checkbox"
              className="form-check-input"
              checked={form.revisado}
              onChange={(e) =>
                setForm((p) => ({ ...p, revisado: e.target.checked }))
              }
            />
            <label
              htmlFor="revisado"
              className="form-check-label small fw-semibold"
            >
              Marcar como revisado
            </label>
          </div>

          {error && <div className="alert alert-danger small">{error}</div>}
        </div>

        {/* === FOOTER === */}
        <div className="d-flex justify-content-end gap-3 border-top pt-3">
          <button
            className="btn btn-light"
            onClick={() => onClose(false)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SREditor;
