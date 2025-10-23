import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { getAssignedExercises } from "../../services/patientService";
import { getExerciseDetails, getExerciseById } from "../../services/exercisesService";
import VNESTExerciseModal from "../exercises/VNESTExerciseModal";
import PacientePersonalizar from "./PacientePersonalizar";
import PatientAssignExercise from "./PatientAssignExercise";
import PacienteVNEST from "./PacienteVNEST";
import PacienteSR from "./PacienteSR";
import "./PacienteDetail.css";

const PacienteDetail = () => {
  const { pacienteId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [detailedExercises, setDetailedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVnestViewer, setShowVnestViewer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [activeTerapia, setActiveTerapia] = useState("VNEST");
  const [message] = useState("");

  // 📄 Cargar ejercicios asignados al paciente
  useEffect(() => {
    if (!pacienteId) return;
    const unsubscribe = getAssignedExercises(pacienteId, setExercises);
    return () => unsubscribe && unsubscribe();
  }, [pacienteId]);

  // 🔍 Cargar detalles de cada ejercicio
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

        // 🔹 Ordenar por fecha
        detailed.sort((a, b) => {
          const fechaA = a.fecha_asignacion?.seconds || 0;
          const fechaB = b.fecha_asignacion?.seconds || 0;
          return fechaB - fechaA;
        });

        setDetailedExercises(detailed);
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

  return (
    <div className="page-container paciente-page">
      <Navbar active="pacientes" />

      <main className="container py-5 mt-5">
        {/* === HEADER === */}
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

        {/* === TABLA SEGÚN TERAPIA === */}
        {activeTerapia === "VNEST" ? (
          <PacienteVNEST
            exercises={detailedExercises.filter((e) => e.terapia === "VNEST")}
            onView={handleViewExercise}
            onEdit={() => {}}
          />
        ) : (
          <PacienteSR
            exercises={detailedExercises.filter((e) => e.terapia === "SR")}
            onEdit={() => {}}
            onView={handleViewExercise}
          />
        )}

        {message && <div className="alert-msg fade-in">{message}</div>}

        {/* === MODALES === */}
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

export default PacienteDetail;
