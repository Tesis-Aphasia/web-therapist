import React, { useState } from "react";
import { getExerciseById, assignExerciseToPatient } from "../../services/assignExerciseService";
import "./AssignExercise.css";

const AssignExercise = ({ open, onClose, patient }) => {
  const [searchId, setSearchId] = useState("");
  const [exercise, setExercise] = useState(null);
  const [priority, setPriority] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Buscar ejercicio por ID
  const handleSearch = async () => {
    setError("");
    setSuccess("");
    setExercise(null);

    if (!searchId.trim()) return setError("Por favor ingresa un ID de ejercicio válido.");
    setLoading(true);

    try {
      const result = await getExerciseById(searchId.trim());
      if (!result) {
        setError("No se encontró ningún ejercicio con ese ID.");
      } else {
        setExercise(result);
      }
    } catch {
      setError("Error al buscar el ejercicio.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Asignar al paciente
  const handleAssign = async () => {
    if (!exercise) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await assignExerciseToPatient(patient.id, exercise.id, {
        prioridad: Number(priority),
      });
      setSuccess(`✅ Ejercicio ${exercise.id} asignado a ${patient.nombre}`);
      setTimeout(() => onClose(true), 1500);
    } catch {
      setError("Error al asignar el ejercicio.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !patient) return null;

  return (
    <div className="assign-overlay">
      <div className="assign-modal">
        <header className="assign-header">
          <h4>Asignar Ejercicio</h4>
          <button className="close-btn" onClick={() => onClose(false)}>
            ✕
          </button>
        </header>

        <main className="assign-body">
          <p className="text-muted small">
            Busca un ejercicio por su <strong>ID</strong> y asígnalo al paciente{" "}
            <strong>{patient.nombre}</strong>.
          </p>

          {/* Buscador */}
          <div className="search-row">
            <input
              type="text"
              className="form-control"
              placeholder="ID del ejercicio (ej. E001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}

          {exercise && (
            <div className="exercise-card mt-4">
              <h6 className="fw-bold text-primary mb-2">
                Ejercicio {exercise.id}
              </h6>
              <p className="mb-1">
                <strong>Terapia:</strong> {exercise.terapia || "—"}
              </p>
              <p className="mb-1">
                <strong>Tipo:</strong> {exercise.tipo || "—"}
              </p>
              <p className="mb-1">
                <strong>Autor:</strong> {exercise.creado_por || "—"}
              </p>

              <div className="mt-3">
                <label className="form-label fw-semibold small">Prioridad</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>

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

export default AssignExercise;
