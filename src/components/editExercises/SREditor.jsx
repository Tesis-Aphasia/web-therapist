import React, { useEffect, useState } from "react";
import {
  updateExercise,
  getExerciseDetails,
  updateExerciseSR,
} from "../../services/exercisesService";
import { FaSave, FaTimes, FaCheckCircle } from "react-icons/fa";
import "./SREditor.css";

const SREditor = ({ open, onClose, exercise }) => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [success, setSuccess] = useState(false);

  // 🔹 Cargar detalles SR
  useEffect(() => {
    if (!exercise) return;

    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await getExerciseDetails(exercise.id, "SR");
        const extra =
          Array.isArray(data) && data.length > 0 ? data[0] : data || {};

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

  // 🔹 Guardar cambios
  const handleSave = async () => {
    if (!exercise || !form) return;
    setError("");
    setSaving(true);
    setSuccess(false);

    try {
      await updateExerciseSR(exercise.id, {
        pregunta: form.pregunta.trim(),
        rta_correcta: form.rta_correcta.trim(),
      });

      await updateExercise(exercise.id, {
        revisado: Boolean(form.revisado),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose(true);
      }, 1500);
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
          <h4>🧠 Editar Ejercicio SR</h4>
          <button
            className="sr-close-btn"
            onClick={() => !saving && onClose(false)}
            aria-label="Cerrar"
          >
            <FaTimes />
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
              {/* Información contextual */}
              <div className="sr-info-box mb-4">
                <p>
                  <strong>ID:</strong> {exercise.id}
                </p>
                <p>
                  <strong>Paciente:</strong> {exercise.id_paciente || "—"}
                </p>
                <p>
                  <strong>Tipo:</strong> {exercise.tipo || "—"}
                </p>
              </div>

              {/* Formulario principal */}
              <div className="sr-form">
                <div className="form-group">
                  <label>Pregunta</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe la pregunta del ejercicio"
                    value={form.pregunta}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, pregunta: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Respuesta correcta</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe la respuesta esperada"
                    value={form.rta_correcta}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        rta_correcta: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-check mb-3 mt-3">
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

                {error && <div className="alert-danger mt-2">{error}</div>}
                {success && (
                  <div className="alert-success mt-2">
                    <FaCheckCircle className="me-2" /> Guardado correctamente
                  </div>
                )}
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
              className="btn-primary d-flex align-items-center gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave /> Guardar cambios
                </>
              )}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default SREditor;
