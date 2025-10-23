import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import "./DashboardTerapeuta.css";

const DashboardTerapeuta = () => {
  const navigate = useNavigate();
  const { user, getCurrentUser } = useAuth();
  const [numPacientes, setNumPacientes] = useState(0);
  const [numPendientes, setNumPendientes] = useState(0);

  useEffect(() => {
    const terapeuta = getCurrentUser();
    if (terapeuta) {
      setTerapeuta(terapeuta);
    }
  }, [getCurrentUser]);

  return (
    <div className="page-container">
      <Navbar active="dashboard" />

      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <h2>Bienvenido{terapeuta?.nombre ? `, ${terapeuta.nombre}` : ""}</h2>
            <p className="subtitle">Aquí puedes ver el estado general de tus pacientes y ejercicios.</p>
          </div>
        </header>

        <section className="dashboard-cards">
          {/* --- PACIENTES --- */}
          <div className="dashboard-card hoverable">
            <div className="card-content">
              <div>
                <p className="label">Pacientes asociados</p>
                <h1 className="clickable-number" onClick={() => navigate(ROUTES.PATIENTS)}>
                  {numPacientes}
                </h1>
              </div>
              <div className="icon-wrapper orange">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                  alt="Pacientes"
                  className="dashboard-icon"
                />
              </div>
            </div>
          </div>

          {/* --- EJERCICIOS --- */}
          <div className="dashboard-card hoverable">
            <div className="card-content">
              <div>
                <p className="label">Ejercicios por revisar</p>
                <h1 className="clickable-number" onClick={() => navigate(ROUTES.EXERCISES)}>
                  {numPendientes}
                </h1>
              </div>
              <div className="icon-wrapper blue">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2972/2972338.png"
                  alt="Ejercicios"
                  className="dashboard-icon"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardTerapeuta;
