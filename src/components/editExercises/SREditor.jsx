import React, { useEffect, useState } from "react";
import { updateExercise, getExerciseDetails } from "../../services/exercisesService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./SREditor.css";

const SREditor = ({ open, onClose, exercise }) => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);

  // 🔹 Cargar detalles desde la subcolección ejercicios_SR
  useEffect(() => {
    if (!exercise) return;

    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await getExerciseDetails(exercise.id, "SR");
        const extra = Array.isArray(data) && data.length > 0 ? data[0] : data || {};

        setForm({
          pregunta: extra.pregunta || "",
          rta_correcta: extra.rta_correcta || "",
          revisado: Boolean(exercise.revisado),
        });
      } catch (err) {
        console.error("❌ Error cargando ejercicio SR:", err);
        setError("No se pudo cargar el ejercicio.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [exercise]);

  // 🔹 Guardar cambios tanto en `ejercicios` como en `ejercicios_SR`
  const handleSave = async () => {
    if (!exercise || !form) return;
    setError("");
    setSaving(true);
    try {
      const refSR = doc(db, "ejercicios_SR", exercise.id);
      await updateDoc(refSR, {
        stimulus: form.pregunta.trim(),
        answer: form.rta_correcta.trim(),
      });

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

  if (!open) return null;

  return (
    <div className="sr-overlay" onClick={() => !saving && onClose(false)}>
      <div
        className="sr-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* === HEADER === */}
        <header className="sr-header">
          <h4>Editar Ejercicio SR</h4>
          <button
            className="sr-close-btn"
            onClick={() => !saving && onClose(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        {/* === BODY === */}
        <div className="sr-body">
          {loading || !form ? (
            <div className="sr-loading">
              <div className="spinner-border" role="status"></div>
              <p className="mt-3 fw-semibold text-muted">
                Cargando datos del ejercicio...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="mb-3">
                  <label>Pregunta</label>
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
                  <label>Respuesta correcta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.rta_correcta}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        rta_correcta: e.target.value,
                      }))
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
                  <label htmlFor="revisado" className="form-check-label">
                    Marcar como revisado
                  </label>
                </div>

                {error && <div className="alert-danger">{error}</div>}
              </div>
            </>
          )}
        </div>

        {/* === FOOTER === */}
        {!loading && (
          <footer className="sr-footer">
            <button
              className="btn-light"
              onClick={() => onClose(false)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
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
          </footer>
        )}
      </div>
    </div>
  );
};

export default SREditor;
