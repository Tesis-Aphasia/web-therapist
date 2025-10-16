import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import "./SelectExerciseType.css";

const SelectExerciseType = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Navbar active="ejercicios" />

      <main className="container py-5 mt-5 select-exercise-container">
        <h2 className="fw-bold text-dark mb-4 text-center">
          ¿Cómo deseas crear el nuevo ejercicio?
        </h2>

        <div className="row justify-content-center g-4">
          {/* Opción IA */}
          <div className="col-md-5">
            <div
              className="option-card shadow-sm border-0 rounded-4 p-4 h-100 text-center"
              onClick={() => navigate("/ejercicios/nuevo/ia")}
            >
              <div className="icon-wrapper bg-primary-subtle text-primary mx-auto mb-3">
                <i className="bi bi-stars fs-2"></i>
              </div>
              <h5 className="fw-bold mb-2">Generar con IA</h5>
              <p className="text-muted small">
                Crea automáticamente un ejercicio basado en un verbo, contexto o nivel.
              </p>
            </div>
          </div>

          {/* Opción Manual */}
          {/* <div className="col-md-5">
            <div
              className="option-card shadow-sm border-0 rounded-4 p-4 h-100 text-center"
              onClick={() => navigate("/ejercicios/nuevo/manual")}
            >
              <div className="icon-wrapper bg-success-subtle text-success mx-auto mb-3">
                <i className="bi bi-pencil-square fs-2"></i>
              </div>
              <h5 className="fw-bold mb-2">Crear manualmente</h5>
              <p className="text-muted small">
                Diseña paso a paso un ejercicio personalizado para tus pacientes.
              </p>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default SelectExerciseType;
