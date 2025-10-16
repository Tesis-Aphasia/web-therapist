import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { getPatientsByTherapist } from "../../services/therapistService";
import AddPatient from "../addPatient/AddPatient";
import "./PacientesTerapeuta.css";

const PacientesTerapeuta = () => {
  const navigate = useNavigate();
  const [terapeutaEmail] = useState(localStorage.getItem("terapeutaEmail"));
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Obtener pacientes del terapeuta
  useEffect(() => {
    if (!terapeutaEmail) {
      navigate("/");
      return;
    }
    const unsubscribe = getPatientsByTherapist(terapeutaEmail, setPacientes);
    return () => unsubscribe && unsubscribe();
  }, [terapeutaEmail, navigate]);

  // 🔍 Filtro por email
  const filteredPatients = pacientes.filter((p) =>
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar active="pacientes" />

      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Pacientes</h2>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por email..."
              style={{ width: "250px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-primary fw-semibold"
              onClick={() => setShowAddModal(true)}
            >
              + Agregar Paciente
            </button>
          </div>
        </div>

        {/* TABLA DE PACIENTES */}
        <div className="card shadow-sm border-0 rounded-4 mb-5">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th className="text-center">Ejercicios Asignados</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="fw-semibold">{p.nombre || "—"}</td>
                    <td>{p.email || "—"}</td>
                    <td className="text-center">
                      <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill">
                        {p.cantidadEjercicios ?? 0}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-primary btn-sm fw-semibold"
                        onClick={() => navigate(`/pacientes/${p.id}`)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No hay pacientes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL PARA AGREGAR PACIENTE */}
        {showAddModal && (
          <AddPatient
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            terapeutaEmail={terapeutaEmail}
          />
        )}
      </main>
    </div>
  );
};

export default PacientesTerapeuta;
