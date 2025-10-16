// EjerciciosTerapeuta.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getVisibleExercises,
  getExerciseDetails,
} from "../../services/exercisesService";
import VNESTTable from "./VNESTTable";
import SRETable from "./SRTable";
import ExerciseEditor from "../editExercises/VNESTEditor";
import SREditor from "../editExercises/SREditor";
import VNESTExerciseModal from "./VNESTExerciseModal";
import "./EjerciciosTerapeuta.css";

const EjerciciosTerapeuta = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVnestEditor, setShowVnestEditor] = useState(false);
  const [showSREditor, setShowSREditor] = useState(false);
  const [showVnestViewer, setShowVnestViewer] = useState(false);
  const [activeTerapia, setActiveTerapia] = useState("VNEST");

  const therapistEmail = localStorage.getItem("terapeutaEmail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!therapistEmail) return;

    let unsubscribeFn = null;

    (async () => {
      unsubscribeFn = await getVisibleExercises(
        therapistEmail,
        async (visibleExercises) => {
          const detailed = await Promise.all(
            visibleExercises.map(async (e) => {
              try {
                const extra = await getExerciseDetails(e.id, e.terapia);
                if (e.terapia === "VNEST") {
                  return {
                    ...e,
                    contexto: extra.contexto,
                    verbo: extra.verbo,
                    nivel: extra.nivel,
                  };
                } else if (e.terapia === "SR") {
                  return {
                    ...e,
                    pregunta: extra.pregunta,
                    rta_correcta: extra.rta_correcta,
                  };
                }
                return { ...e, ...extra };
              } catch (err) {
                console.error("❌ Error cargando detalles:", e.id, err);
                return e;
              }
            })
          );

          setExercises(detailed);
          console.log("📋 Ejercicios visibles actualizados:", detailed);
        }
      );
    })();

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [therapistEmail]);

  const handleEdit = async (exercise) => {
    try {
      const extra = await getExerciseDetails(exercise.id, exercise.terapia);
      setSelectedExercise({ ...exercise, ...extra });
      if (exercise.terapia === "SR") setShowSREditor(true);
      else setShowVnestEditor(true);
    } catch (err) {
      console.error("❌ Error cargando detalles:", err);
    }
  };

  const handleViewExercise = async (exercise) => {
    try {
      const extra = await getExerciseDetails(exercise.id, exercise.terapia);
      setSelectedExercise({ ...exercise, ...extra });
      setShowVnestViewer(true);
    } catch (err) {
      console.error("❌ Error cargando detalles del ejercicio:", err);
    }
  };

  const handleCloseEditor = (updated) => {
    setShowVnestEditor(false);
    setShowSREditor(false);
    setSelectedExercise(null);
    if (updated) console.log("✅ Ejercicio actualizado.");
  };

  const handleGenerateNew = () => navigate("/ejercicios/nuevo");

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
          onClose={() => {
            setShowVnestViewer(false);
            setSelectedExercise(null);
          }}
        />
      )}
    </div>
  );
};

export default EjerciciosTerapeuta;
