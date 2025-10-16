import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getAssignedExercises,
  assignExerciseToPatient,
  getPatientById
} from "../../services/patientService";
import { personalizeExercise } from "../../services/exercisesService"; // 👈 importar tu servicio

const PacienteDetail = () => {
  const { pacienteId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false); // 👈 nuevo modal
  const [exerciseId, setExerciseId] = useState("");
  const [baseExerciseId, setBaseExerciseId] = useState(""); // 👈 id base para personalizar
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pacienteId) return;
    const unsubscribe = getAssignedExercises(pacienteId, setExercises);
    return () => unsubscribe && unsubscribe();
  }, [pacienteId]);

  // -------- Asignar ejercicio --------
  const handleAssignExercise = async () => {
    if (!exerciseId.trim()) {
      setMessage("⚠️ Ingresa un ID de ejercicio válido.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await assignExerciseToPatient(pacienteId, exerciseId);
      if (result.ok) {
        setMessage("✅ Ejercicio asignado correctamente.");
        setExerciseId("");
        setShowModal(false);
      } else {
        setMessage(`❌ Error: ${result.error || "No se pudo asignar"}`);
      }
    } catch (error) {
      setMessage(`❌ Error al asignar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // -------- Personalizar ejercicio --------
  const handlePersonalizeExercise = async () => {
  if (!baseExerciseId.trim()) {
    setMessage("⚠️ Ingresa el ID base del ejercicio para personalizar.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    // 1️⃣ Obtener el perfil del paciente desde Firestore
    const patientData = await getPatientById(pacienteId);

    if (!patientData) {
      throw new Error("No se encontró el perfil del paciente.");
    }

    // 2️⃣ Llamar al endpoint de personalización con profile incluido
    const terapeutaEmail = localStorage.getItem("terapeutaEmail");
    const result = await personalizeExercise(
      pacienteId,
      baseExerciseId,
      patientData, // profile del paciente
      terapeutaEmail
    );

    // 3️⃣ Manejo del resultado
    if (result.ok || result.id) {
      setMessage("✅ Ejercicio personalizado correctamente.");
      setBaseExerciseId("");
      setShowPersonalizeModal(false);
    } else {
      setMessage(`❌ Error: ${result.error || "No se pudo personalizar"}`);
    }
  } catch (error) {
    console.error("Error en handlePersonalizeExercise:", error);
    setMessage(`❌ Error al personalizar: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="page-container">
      <Navbar active="pacientes" />
      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Ejercicios de paciente</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success fw-semibold"
              onClick={() => setShowModal(true)}
            >
              Asignar nuevo ejercicio
            </button>
            <button
              className="btn btn-primary fw-semibold"
              onClick={() => setShowPersonalizeModal(true)}
            >
              Crear Ejercicio Personalizado
            </button>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Terapia</th>
                  <th>Fecha asignación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.terapia}</td>
                    <td>{e.fechaAsignacion || "—"}</td>
                    <td>{e.estado || "Pendiente"}</td>
                  </tr>
                ))}
                {exercises.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay ejercicios asignados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- MODAL ASIGNAR EJERCICIO ---------- */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 shadow">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-semibold">
                    Asignar nuevo ejercicio
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label fw-semibold">
                    ID del ejercicio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: ejercicio_001"
                    value={exerciseId}
                    onChange={(e) => setExerciseId(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={handleAssignExercise}
                    disabled={loading}
                  >
                    {loading ? "Asignando..." : "Asignar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- MODAL PERSONALIZAR EJERCICIO ---------- */}
        {showPersonalizeModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 shadow">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-semibold">
                    Crear Ejercicio Personalizado
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPersonalizeModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label fw-semibold">
                    ID del ejercicio base
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: ejercicio_base_123"
                    value={baseExerciseId}
                    onChange={(e) => setBaseExerciseId(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPersonalizeModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary fw-semibold"
                    onClick={handlePersonalizeExercise}
                    disabled={loading}
                  >
                    {loading ? "Creando..." : "Personalizar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje temporal */}
        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </main>
    </div>
  );
};

export default PacienteDetail;
