import React from "react";
import { FaUser, FaBookOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./VNESTExerciseModal.css";

const VNESTExerciseModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="vnest-modal-backdrop" onClick={onClose}>
      <div className="vnest-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="vnest-modal-header">
          <h4>Ejercicio VNEST: <span>{exercise.id}</span></h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        {/* Info básica */}
        <section className="vnest-info">
          <p><strong>Contexto:</strong> {exercise.contexto || "—"}</p>
          <p><strong>Verbo:</strong> {exercise.verbo || "—"}</p>
        </section>

        {/* Metadatos */}
        <section className="vnest-meta">
          <p><strong>Nivel:</strong> {exercise.nivel || "—"}</p>
          <p><strong>Personalizado:</strong> {exercise.personalizado ? "Sí" : "No"}</p>
          <p><strong>Revisado:</strong> {exercise.revisado ? "Sí" : "No"}</p>
          <p><strong>Tipo:</strong> {exercise.tipo}</p>
          <p><strong>Creado por:</strong> {exercise.creado_por || "—"}</p>
          <p><strong>Paciente:</strong> {exercise.id_paciente || "—"}</p>
        </section>

        {/* Descripción adaptada */}
        {exercise.descripcion_adaptado && (
          <section className="vnest-description">
            <h5>Descripción adaptada</h5>
            <p>{exercise.descripcion_adaptado}</p>
          </section>
        )}

        

        {/* Pares */}
        {exercise.pares?.length > 0 && (
          <section className="vnest-section">
            <h5>Pares de expansión</h5>
            {exercise.pares.map((p, idx) => (
              <div className="pair-card" key={idx}>
                <p><FaUser className="icon" /> <strong>Sujeto:</strong> {p.sujeto}</p>
                <p><FaBookOpen className="icon" /> <strong>Objeto:</strong> {p.objeto}</p>

                {p.expansiones && (
                  <div className="expansions">
                    <p><strong>Cuándo:</strong> {p.expansiones.cuando?.opcion_correcta || "—"}</p>
                    <p><strong>Dónde:</strong> {p.expansiones.donde?.opcion_correcta || "—"}</p>
                    <p><strong>Por qué:</strong> {p.expansiones.por_que?.opcion_correcta || "—"}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Oraciones */}
        {exercise.oraciones?.length > 0 && (
          <section className="vnest-section">
            <h5>Oraciones</h5>
            <ul>
              {exercise.oraciones.map((o, idx) => (
                <li key={idx} className={`sentence ${o.correcta ? "correcta" : "incorrecta"}`}>
                  <span className="text">{o.oracion}</span>
                  {o.correcta ? (
                    <span className="status correct"><FaCheckCircle /> Correcta</span>
                  ) : (
                    <span className="status incorrect"><FaTimesCircle /> Incorrecta</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default VNESTExerciseModal;
