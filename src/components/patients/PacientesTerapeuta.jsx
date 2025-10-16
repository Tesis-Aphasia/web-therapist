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

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

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

  // 📄 Paginación calculada
  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + perPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="page-container">
      <Navbar active="pacientes" />

      <main className="patients-page">
        {/* Header */}
        <div className="patients-header">
          <h2>Pacientes</h2>
          <div className="actions">
            <input
              type="text"
              placeholder="Buscar por email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button onClick={() => setShowAddModal(true)}>
              + Agregar Paciente
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ejercicios Asignados</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre || "—"}</td>
                  <td>{p.email || "—"}</td>
                  <td>
                    <span className="badge-count">
                      {p.cantidadEjercicios ?? 0}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn-outline"
                      onClick={() => navigate(`/pacientes/${p.id}`)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}

              {currentPatients.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-data">
                    No hay pacientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredPatients.length > 10 && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ← Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Siguiente →
            </button>
          </div>
        )}

        {/* Modal agregar paciente */}
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
