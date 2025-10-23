import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import AddPatient from "../addPatient/AddPatient";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import SearchInput from "../common/SearchInput";
import Badge from "../common/Badge";
import { usePatients } from "../../hooks/usePatients";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import "./PacientesTerapeuta.css";

const PacientesTerapeuta = () => {
  const navigate = useNavigate();
  const { getCurrentUserEmail } = useAuth();
  const { patients, loading: patientsLoading } = usePatients();
  const { isOpen: showAddModal, openModal, closeModal } = useModal();
  
  // Search functionality
  const searchFn = (data, searchTerm) => {
    return data.filter((p) =>
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const { searchTerm, searchResults, handleSearch, clearSearch } = useSearch(
    patients,
    searchFn
  );
  
  // Pagination
  const pagination = usePagination(searchResults);

  const handlePageChange = (page) => {
    pagination.goToPage(page);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Nombre",
      key: "nombre",
      render: (patient) => patient.nombre || "—",
    },
    {
      title: "Email",
      key: "email",
      render: (patient) => patient.email || "—",
    },
    {
      title: "Ejercicios Asignados",
      key: "cantidadEjercicios",
      render: (patient) => (
        <Badge variant="success">
          {patient.cantidadEjercicios ?? 0}
        </Badge>
      ),
    },
    {
      title: "Acción",
      key: "action",
      className: "text-end",
      render: (patient) => (
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => navigate(`${ROUTES.PATIENTS}/${patient.id}`)}
        >
          Ver detalles
        </button>
      ),
    },
  ];

  if (patientsLoading) {
    return (
      <div className="page-container">
        <Navbar active="pacientes" />
        <main className="vn-table-container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando pacientes...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar active="pacientes" />

      <main className="vn-table-container">
        {/* Header */}
        <div className="patients-header d-flex justify-content-between align-items-center flex-wrap mb-3">
          <h2 className="fw-bold text-dark">Pacientes</h2>
          <div className="actions d-flex gap-3 flex-wrap align-items-center">
            <SearchInput
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onClear={clearSearch}
              placeholder="Buscar por email..."
              loading={patientsLoading}
            />
            <button className="btn btn-primary" onClick={openModal}>
              + Agregar Paciente
            </button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={pagination.paginatedData}
          striped
          hover
        />

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />

        {/* Modal agregar paciente */}
        {showAddModal && (
          <AddPatient
            open={showAddModal}
            onClose={closeModal}
            terapeutaEmail={getCurrentUserEmail()}
          />
        )}
      </main>
    </div>
  );
};

export default PacientesTerapeuta;