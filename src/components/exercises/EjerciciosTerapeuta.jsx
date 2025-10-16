import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getVisibleExercises,
  getExerciseDetails,
} from "../../services/exercisesService";
import ExerciseEditor from "../editExercises/VNESTEditor";
import SREditor from "../editExercises/SREditor";
import "./EjerciciosTerapeuta.css";

const EjerciciosTerapeuta = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVnestEditor, setShowVnestEditor] = useState(false);
  const [showSREditor, setShowSREditor] = useState(false);

  const therapistEmail = localStorage.getItem("terapeutaEmail");

  console.log("Therapist Email:", therapistEmail);

  useEffect(() => {
    if (!therapistEmail) return;

    let unsubscribeFn = null;

    getVisibleExercises(therapistEmail, setExercises).then((fn) => {
      // fn será la función de unsubscribe que devuelve onSnapshot
      unsubscribeFn = fn;
    });

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

  const handleCloseEditor = (updated) => {
    setShowVnestEditor(false);
    setShowSREditor(false);
    setSelectedExercise(null);
    if (updated) console.log("✅ Ejercicio actualizado.");
  };
  const navigate = useNavigate();

  const handleGenerateNew = () => {
    navigate("/ejercicios/nuevo");
  };

  return (
    <div className="page-container">
      <Navbar active="ejercicios" />

      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Gestión de Ejercicios</h2>
          <button
            onClick={handleGenerateNew}
            className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> Nuevo ejercicio
          </button>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Terapia</th>
                  <th>Visibilidad</th>
                  <th>Estado</th>
                  <th>Autor</th>

                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((e) => (
                  <tr key={e.id} className="table-row">
                    <td>{e.id}</td>
                    <td>{e.terapia}</td>
                    <td>{e.tipo}</td>

                    <td>
                      {e.revisado ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2">
                          Aprobado
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning px-3 py-2">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td>{e.creado_por || "—"}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-3">
                        <button
                          className="text-primary fw-semibold border-0 bg-transparent"
                          onClick={() => handleEdit(e)}
                        >
                          Revisar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {exercises.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No hay ejercicios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* === EDITORES === */}
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
    </div>
  );
};

export default EjerciciosTerapeuta;
