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

  useEffect(() => {
    if (!terapeutaEmail) {
      navigate("/");
      return;
    }
    const unsubscribe = getPatientsByTherapist(terapeutaEmail, setPacientes);
    return () => unsubscribe && unsubscribe();
  }, [terapeutaEmail, navigate]);

  const filteredPatients = pacientes.filter((p) =>
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + perPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="page-container patients-page">
      <Navbar active="pacientes" />

    <main className="container py-5 mt-5">
        {/* Encabezado Moderno */}
        <div className="patients-topbar">
          <h2 className="page-title">Pacientes</h2>
          <div className="patients-actions">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button
              className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              + Agregar Paciente
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ejercicios Asignados</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                currentPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre || "—"}</td>
                    <td>{p.email || "—"}</td>
                    <td>
                      
                        {p.cantidadEjercicios ?? 0}
                      
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/pacientes/${p.id}`)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
        <div className="pagination-bar">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              ◀
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
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
