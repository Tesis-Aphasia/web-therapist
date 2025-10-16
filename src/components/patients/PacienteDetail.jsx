import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getAssignedExercises,
} from "../../services/patientService";
import {
  getExerciseDetails,
  getExerciseById,
} from "../../services/exercisesService";
import VNESTExerciseModal from "../exercises/VNESTExerciseModal";
import PacientePersonalizar from "./PacientePersonalizar";
import PatientAssignExercise from "./PatientAssignExercise";
import "./PacienteDetail.css";

const PacienteDetail = () => {
  const { pacienteId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [detailedExercises, setDetailedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVnestViewer, setShowVnestViewer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [message, setMessage] = useState("");

  // 📄 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === 1️⃣ Cargar ejercicios asignados al paciente ===
  useEffect(() => {
    if (!pacienteId) return;
    const unsubscribe = getAssignedExercises(pacienteId, setExercises);
    return () => unsubscribe && unsubscribe();
  }, [pacienteId]);

  useEffect(() => {
    const loadDetails = async () => {
      if (exercises.length === 0) {
        setDetailedExercises([]);
        return;
      }

      try {
        const detailed = await Promise.all(
          exercises.map(async (e) => {
            const id = e.id_ejercicio || e.id;
            if (!id) return e;

            try {
              const meta = await getExerciseById(id);
              if (!meta) return e;

              const terapia = meta.terapia || e.terapia;
              let extra = {};
              if (terapia) {
                extra = await getExerciseDetails(id, terapia);
              }

              return { ...meta, ...extra, ...e };
            } catch (err) {
              console.error("Error cargando detalles del ejercicio:", id, err);
              return e;
            }
          })
        );

        // 🔹 Ordenar por fecha (más recientes primero)
        detailed.sort((a, b) => {
          const fechaA = a.fecha_asignacion?.seconds || 0;
          const fechaB = b.fecha_asignacion?.seconds || 0;
          return fechaB - fechaA;
        });

        setDetailedExercises(detailed);
        setCurrentPage(1); // resetear paginación al recargar
      } catch (error) {
        console.error("Error cargando ejercicios detallados:", error);
      }
    };
    loadDetails();
  }, [exercises]);


  // === Ver ejercicio (abre VNESTExerciseModal) ===
  const handleViewExercise = async (exercise) => {
    try {
      const id = exercise.id_ejercicio || exercise.id;
      const meta = await getExerciseById(id);
      const terapia = meta?.terapia || exercise.terapia;

      let extra = {};
      if (terapia) {
        extra = await getExerciseDetails(id, terapia);
      }

      setSelectedExercise({ ...meta, ...extra, ...exercise });
      setShowVnestViewer(true);
    } catch (err) {
      console.error("Error cargando ejercicio para visualizar:", err);
    }
  };

  // === Calcular ejercicios visibles según la página ===
  const totalPages = Math.ceil(detailedExercises.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = detailedExercises.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="page-container">
      <Navbar active="pacientes" />

      <main className="paciente-page">
        <div className="paciente-header">
          <h2>Ejercicios del paciente</h2>
          <div className="actions">
            <button
              className="btn-secondary"
              onClick={() => setShowPersonalizeModal(true)}
            >
              ✨ Crear Ejercicio Personalizado
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Asignar Ejercicio
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-wrapper">
          <table className="paciente-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Contexto</th>
                <th>Verbo</th>
                <th>Personalizado</th>
                <th>Nivel</th>
                <th>Terapia</th>
                <th>Estado</th>
                <th>Fecha Asignado</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((e) => (
                <tr key={e.id}>
                  <td>{e.id || "—"}</td>
                  <td>{e.contexto || "—"}</td>
                  <td>{e.verbo || "—"}</td>
                  <td>{e.personalizado ? "Sí" : "No"}</td>
                  <td>{e.nivel || "—"}</td>
                  <td>{e.terapia || "—"}</td>
                  <td>
                    <span
                      className={`badge-estado ${
                        e.estado?.toLowerCase() === "completado"
                          ? "badge-completado"
                          : e.estado?.toLowerCase() === "en progreso"
                          ? "badge-en-progreso"
                          : "badge-pendiente"
                      }`}
                    >
                      {e.estado || "Pendiente"}
                    </span>
                  </td>
                  <td>
                    {e.fecha_asignacion
                      ? new Date(e.fecha_asignacion.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleViewExercise(e)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="9" className="no-data">
                    No hay ejercicios asignados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}

        {message && <div className="alert-msg fade-in">{message}</div>}

        {/* Modales internos */}
        {showModal && (
  <PatientAssignExercise
    open={showModal}
    onClose={() => setShowModal(false)}
    patientId={pacienteId}
  />
)}

        {showPersonalizeModal && (
  <PacientePersonalizar
    open={showPersonalizeModal}
    onClose={() => setShowPersonalizeModal(false)}
    pacienteId={pacienteId}
  />
)}

        {showVnestViewer && selectedExercise && (
          <VNESTExerciseModal
            exercise={selectedExercise}
            onClose={() => {
              setShowVnestViewer(false);
              setSelectedExercise(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

// ---------- COMPONENTE MODAL ----------
const Modal = ({
  title,
  value,
  placeholder,
  setValue,
  onClose,
  onConfirm,
  confirmText,
  loading,
  color,
}) => (
  <div className="modal-backdrop">
    <div className="modal-box">
      <header className="modal-header">
        <h5>{title}</h5>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </header>
      <div className="modal-body">
        <label>ID del ejercicio</label>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <footer className="modal-footer">
        <button className="btn-cancel" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button
          className={`btn-${color}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Procesando..." : confirmText}
        </button>
      </footer>
    </div>
  </div>
);

export default PacienteDetail;
