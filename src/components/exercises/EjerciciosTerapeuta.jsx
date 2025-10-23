// EjerciciosTerapeuta.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import VNESTTable from "./VNESTTable";
import SRETable from "./SRTable";
import ExerciseEditor from "../editExercises/VNESTEditor";
import SREditor from "../editExercises/SREditor";
import VNESTExerciseModal from "./VNESTExerciseModal";
import { useExercises } from "../../hooks/useExercises";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import "./EjerciciosTerapeuta.css";

const EjerciciosTerapeuta = () => {
  const navigate = useNavigate();
  const { exercises, loading } = useExercises();
  const { isOpen: showVnestEditor, openModal: openVnestEditor, closeModal: closeVnestEditor } = useModal();
  const { isOpen: showSREditor, openModal: openSREditor, closeModal: closeSREditor } = useModal();
  const { isOpen: showVnestViewer, openModal: openVnestViewer, closeModal: closeVnestViewer } = useModal();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTerapia, setActiveTerapia] = useState("VNEST");

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    if (exercise.terapia === "SR") {
      openSREditor();
    } else {
      openVnestEditor();
    }
  };

  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    openVnestViewer();
  };

  const handleCloseEditor = (updated) => {
    closeVnestEditor();
    closeSREditor();
    setSelectedExercise(null);
    if (updated) console.log("✅ Ejercicio actualizado.");
  };

  const handleCloseViewer = () => {
    closeVnestViewer();
    setSelectedExercise(null);
  };

  const handleGenerateNew = () => navigate(ROUTES.NEW_EXERCISE);

  if (loading) {
    return (
      <div className="page-container">
        <Navbar active="ejercicios" />
        <main className="container py-5 mt-5">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando ejercicios...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar active="ejercicios" />
      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="fw-bold text-dark mb-0">Gestión de Ejercicios</h2>
          <button
            onClick={handleGenerateNew}
            className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> Nuevo ejercicio
          </button>
        </div>

        {/* --- FILTRO DE TERAPIAS --- */}
        <div className="terapia-tabs mb-4">
          {["VNEST", "SR"].map((terapia) => (
            <button
              key={terapia}
              className={`tab-btn ${
                activeTerapia === terapia ? "active-tab" : ""
              }`}
              onClick={() => setActiveTerapia(terapia)}
            >
              {terapia}
            </button>
          ))}
        </div>

        {/* --- TABLA SEGÚN TERAPIA --- */}
        {activeTerapia === "VNEST" ? (
          <VNESTTable exercises={exercises} onEdit={handleEdit} onView={handleViewExercise} />
        ) : (
          <SRETable exercises={exercises} onEdit={handleEdit} onView={handleViewExercise} />
        )}
      </main>

      {showVnestEditor && selectedExercise && (
        <ExerciseEditor
          open={showVnestEditor}
          onClose={handleCloseEditor}
          exercise={selectedExercise}
        />
      )}
      {showSREditor && selectedExercise && (
        <SREditor
          open={showSREditor}
          onClose={handleCloseEditor}
          exercise={selectedExercise}
        />
      )}

      {showVnestViewer && selectedExercise && (
        <VNESTExerciseModal
          exercise={selectedExercise}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default EjerciciosTerapeuta;
