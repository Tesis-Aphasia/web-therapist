import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getTherapistData,
  subscribePatientsByTherapist,
  subscribePendingExercises,
} from "../../services/therapistService";
import "./DashboardTerapeuta.css";

const DashboardTerapeuta = () => {
  const navigate = useNavigate();
  const [terapeuta, setTerapeuta] = useState(null);
  const [numPacientes, setNumPacientes] = useState(0);
  const [numPendientes, setNumPendientes] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("terapeutaEmail");
    if (!email) {
      navigate("/");
      return;
    }

    // 🔹 Cargar datos básicos del terapeuta
    getTherapistData(email).then((data) => setTerapeuta(data));

    // 🔹 Suscribirse a pacientes y ejercicios
    const unsubPacientes = subscribePatientsByTherapist(email, setNumPacientes);
    const unsubEjercicios = subscribePendingExercises(setNumPendientes);

    return () => {
      unsubPacientes && unsubPacientes();
      unsubEjercicios && unsubEjercicios();
    };
  }, [navigate]);

  return (
    <div className="page-container">
      {/* --- NAVBAR COMÚN --- */}
      <Navbar active="dashboard" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="container py-5 mt-5">
        <h2 className="fw-bold mb-5 text-dark">Dashboard</h2>

        <div className="row g-4 justify-content-center">
          {/* --- CARD PACIENTES --- */}
          <div className="col-md-5">
            <div className="card dashboard-card p-4 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="fw-semibold text-secondary mb-1">
                    Pacientes asociados
                  </p>
                  <h1 className="fw-bold text-primary">{numPacientes}</h1>
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                  alt="Pacientes"
                  className="dashboard-icon"
                />
              </div>
            </div>
          </div>

          {/* --- CARD EJERCICIOS --- */}
          <div className="col-md-5">
            <div className="card dashboard-card p-4 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="fw-semibold text-secondary mb-1">
                    Ejercicios por revisar
                  </p>
                  <h1 className="fw-bold text-primary">{numPendientes}</h1>
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2972/2972338.png"
                  alt="Ejercicios"
                  className="dashboard-icon"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardTerapeuta;
