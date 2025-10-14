import React, { useState } from "react";
import {
  getPatientById,
  assignPatientToTherapist,
} from "../../services/patientService";
import "./AddPatient.css";

const AddPatient = ({ open, onClose, terapeutaEmail }) => {
  const [searchId, setSearchId] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Buscar paciente
  const handleSearch = async () => {
    setError("");
    setSuccess("");
    setPaciente(null);

    if (!searchId.trim()) return setError("Por favor ingresa un ID válido.");
    setLoading(true);

    try {
      const result = await getPatientById(searchId.trim());
      if (!result) {
        setError("No se encontró ningún paciente con ese ID.");
      } else {
        setPaciente(result);
      }
    } catch {
      setError("Error al buscar el paciente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Asignar paciente al terapeuta
  const handleAssign = async () => {
    if (!paciente) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await assignPatientToTherapist(paciente.id, terapeutaEmail);
      setSuccess(`✅ Paciente ${paciente.nombre} asignado con éxito.`);
      setTimeout(() => {
        onClose(true);
      }, 1200);
    } catch {
      setError("Error al asignar el paciente.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="addpatient-overlay">
      <div className="addpatient-modal">
        <header className="addpatient-header">
          <h4>Agregar Paciente</h4>
          <button className="close-btn" onClick={() => onClose(false)}>
            ✕
          </button>
        </header>

        <main className="addpatient-body">
          <p className="text-muted small">
            Busca un paciente existente por su <strong>ID</strong> y asígnalo a tu lista.
          </p>

          <div className="search-row">
            <input
              type="text"
              className="form-control"
              placeholder="ID del paciente (ej. paciente_123)"
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

          {paciente && (
            <div className="patient-card mt-4">
              <h6 className="fw-bold text-primary mb-2">
                {paciente.nombre || "Sin nombre"}
              </h6>
              <p className="mb-1">
                <strong>Email:</strong> {paciente.email || "—"}
              </p>
              <p className="mb-1">
                <strong>Nombre:</strong> {paciente.nombre || "—"}
              </p>
              <p className="mb-3">
                <strong>Terapeuta actual:</strong>{" "}
                {paciente.terapeuta ? (
                  <span className="text-danger">{paciente.terapeuta}</span>
                ) : (
                  <span className="text-success">Sin asignar</span>
                )}
              </p>

              <button
                className="btn btn-success w-100 fw-semibold"
                onClick={handleAssign}
                disabled={loading}
              >
                {loading ? "Asignando..." : "Asignar a mi lista"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddPatient;
