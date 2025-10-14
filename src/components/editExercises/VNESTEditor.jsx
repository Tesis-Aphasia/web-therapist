import React, { useEffect, useState } from "react";
import { getExerciseDetails, updateExercise } from "../../services/exercisesService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./VNESTEditor.css";

const NIVELES = ["fácil", "medio", "difícil"];

const VNESTEditor = ({ open, onClose, exercise }) => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!exercise) return;
    const load = async () => {
      try {
        const data = await getExerciseDetails(exercise.id, "VNEST");
        if (data) {
          setForm({
            verbo: data.verbo || "",
            nivel: data.nivel || "fácil",
            contexto: data.contexto || "",
            revisado: Boolean(exercise.revisado),
            pares: data.pares || [],
            oraciones: data.oraciones || [],
          });
        }
      } catch (err) {
        console.error("Error cargando VNEST:", err);
        setError("No se pudo cargar el ejercicio.");
      }
    };
    load();
  }, [exercise]);

  const handleParChange = (idx, key, value) => {
    setForm((prev) => {
      const pares = [...prev.pares];
      pares[idx][key] = value;
      return { ...prev, pares };
    });
  };

  const handleExpChange = (idx, grupo, i, val) => {
    setForm((prev) => {
      const pares = [...prev.pares];
      pares[idx].expansiones[grupo].opciones[i] = val;
      return { ...prev, pares };
    });
  };

  const handleOracionChange = (idx, key, val) => {
    setForm((prev) => {
      const oraciones = [...prev.oraciones];
      oraciones[idx][key] = val;
      return { ...prev, oraciones };
    });
  };

  const handleSave = async () => {
    if (!exercise || !form) return;
    setSaving(true);
    setError("");
    try {
      // Actualiza en ejercicios_VNEST
      const ref = doc(db, "ejercicios_VNEST", exercise.id);
      await updateDoc(ref, {
        verbo: form.verbo,
        nivel: form.nivel,
        contexto: form.contexto,
        pares: form.pares,
        oraciones: form.oraciones,
      });

      // Marca como revisado en la colección general
      await updateExercise(exercise.id, { revisado: form.revisado });

      onClose(true);
    } catch (err) {
      console.error("Error guardando VNEST:", err);
      setError("No se pudo guardar el ejercicio.");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !form) return null;

  return (
    <div className="vnest-overlay">
      <div className="vnest-modal-container">
        <header className="vnest-header sticky-top">
          <h4>Editar Ejercicio VNeST</h4>
          <button onClick={() => onClose(false)} className="vnest-close-btn">
            ✕
          </button>
        </header>

        <div className="vnest-body scrollable">
          {/* Campos principales */}
          <div className="vnest-section">
            <div className="row g-3">
              <div className="col-md-4">
                <label>Verbo</label>
                <input
                  className="form-control"
                  value={form.verbo}
                  onChange={(e) => setForm({ ...form, verbo: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label>Nivel</label>
                <select
                  className="form-select"
                  value={form.nivel}
                  onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                >
                  {NIVELES.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Contexto</label>
                <input
                  className="form-control"
                  value={form.contexto}
                  onChange={(e) =>
                    setForm({ ...form, contexto: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-check mt-3">
              <input
                id="revisado"
                type="checkbox"
                className="form-check-input"
                checked={form.revisado}
                onChange={(e) =>
                  setForm({ ...form, revisado: e.target.checked })
                }
              />
              <label htmlFor="revisado" className="form-check-label">
                Marcar como revisado
              </label>
            </div>
          </div>

          {/* Pares */}
          <h5 className="section-title mt-4">Pares Sujeto - Objeto</h5>
          {form.pares.map((p, idx) => (
            <div key={idx} className="pair-card">
              <div className="row g-3 mb-2">
                <div className="col-md-6">
                  <label>Sujeto</label>
                  <input
                    className="form-control"
                    value={p.sujeto}
                    onChange={(e) =>
                      handleParChange(idx, "sujeto", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label>Objeto</label>
                  <input
                    className="form-control"
                    value={p.objeto}
                    onChange={(e) =>
                      handleParChange(idx, "objeto", e.target.value)
                    }
                  />
                </div>
              </div>

              {["donde", "por_que", "cuando"].map((k) => (
                <div key={k} className="expansion-block">
                  <label>{k.replace("_", " ").toUpperCase()}</label>
                  {p.expansiones?.[k]?.opciones?.map((opt, i) => (
                    <input
                      key={i}
                      className="form-control mb-1"
                      value={opt}
                      onChange={(e) =>
                        handleExpChange(idx, k, i, e.target.value)
                      }
                    />
                  ))}
                  <div className="text-muted small">
                    Correcta: <strong>{p.expansiones?.[k]?.opcion_correcta}</strong>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Oraciones */}
          <h5 className="section-title mt-4">Oraciones (10)</h5>
          {form.oraciones.map((o, i) => (
            <div key={i} className="sentence-row">
              <input
                type="checkbox"
                checked={o.correcta}
                onChange={(e) =>
                  handleOracionChange(i, "correcta", e.target.checked)
                }
              />
              <input
                className="form-control"
                value={o.oracion}
                onChange={(e) =>
                  handleOracionChange(i, "oracion", e.target.value)
                }
              />
            </div>
          ))}

          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>

        <footer className="vnest-footer">
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
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default VNESTEditor;
