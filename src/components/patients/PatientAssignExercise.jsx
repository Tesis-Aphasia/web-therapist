import React, { useState } from "react";
import { getExerciseById } from "../../services/exercisesService";
import { assignExerciseToPatient } from "../../services/patientService";
import "./PatientAssignExercise.css";

const PatientAssignExercise = ({ open, onClose, patientId }) => {
  const [searchId, setSearchId] = useState("");
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  // 🔍 Buscar ejercicio por ID
  const handleSearch = async () => {
    setExercise(null);
    setMessage("");

    if (!searchId.trim()) {
      setMessage("⚠️ Ingresa un ID de ejercicio válido.");
      return;
    }

    setLoading(true);
    try {
      const result = await getExerciseById(searchId.trim());
      if (!result) {
        setMessage("❌ No se encontró ningún ejercicio con ese ID.");
      } else {
        setExercise(result);
      }
    } catch (err) {
      setMessage("❌ Error al buscar el ejercicio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Asignar ejercicio
  const handleAssign = async () => {
    if (!exercise) return;
    setLoading(true);
    setMessage("");

    try {
      await assignExerciseToPatient(patientId, exercise.id);
      setMessage(`✅ Ejercicio ${exercise.id} asignado correctamente.`);
      setTimeout(() => onClose(true), 1500);
    } catch (err) {
      setMessage("❌ Error al asignar el ejercicio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-overlay">
      <div className="assign-modal">
        <header className="assign-header">
          <h4>🧩 Asignar Ejercicio al Paciente</h4>
          <button className="close-btn" onClick={() => onClose(false)}>
            ✕
          </button>
        </header>

        <main className="assign-body">
          <p className="text-muted small mb-3">
            Busca un ejercicio existente por su <strong>ID</strong> y asígnalo al paciente.
          </p>

          {/* Buscador */}
          <div className="search-row">
            <input
              type="text"
              className="form-control"
              placeholder="Ej: ejercicio_001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {message && (
            <div
              className={`alert mt-3 ${
                message.startsWith("✅")
                  ? "alert-success"
                  : message.startsWith("⚠️")
                  ? "alert-warning"
                  : "alert-error"
              }`}
            >
              {message}
            </div>
          )}

          {exercise && (
            <div className="exercise-card mt-4">
              <h6 className="fw-bold text-primary mb-2">Ejercicio {exercise.id}</h6>
              <p className="mb-1">
                <strong>Terapia:</strong> {exercise.terapia || "—"}
              </p>
              <p className="mb-1">
                <strong>Tipo:</strong> {exercise.tipo || "—"}
              </p>
              <p className="mb-1">
                <strong>Autor:</strong> {exercise.creado_por || "—"}
              </p>


              <button
                className="btn btn-success w-100 mt-3 fw-semibold"
                onClick={handleAssign}
                disabled={loading}
              >
                {loading ? "Asignando..." : "Asignar a paciente"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientAssignExercise;
