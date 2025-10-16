import React, { useState, useMemo } from "react";
import "./SRTable.css";

const SRTable = ({ exercises, onEdit }) => {
  // --- ESTADO PARA FILTROS ---
  const [filterVisibilidad, setFilterVisibilidad] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterPersonalizado, setFilterPersonalizado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- FILTRADO ---
  const filteredExercises = useMemo(() => {
    return exercises
      .filter((e) => e.terapia === "SR")
      .filter((e) => {
        if (filterVisibilidad !== "Todos" && e.tipo !== filterVisibilidad) return false;
        if (filterEstado !== "Todos") {
          if (filterEstado === "Aprobado" && !e.revisado) return false;
          if (filterEstado === "Pendiente" && e.revisado) return false;
        }
        if (filterPersonalizado !== "Todos") {
          const isPersonalizado = !!e.personalizado;
          if (filterPersonalizado === "Sí" && !isPersonalizado) return false;
          if (filterPersonalizado === "No" && isPersonalizado) return false;
        }
        return true;
      });
  }, [exercises, filterVisibilidad, filterEstado, filterPersonalizado]);

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(filteredExercises.length / pageSize);
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="sr-table-container">
      {/* --- FILTROS --- */}
      <div className="mb-3 d-flex gap-3 flex-wrap align-items-center">
        <div className="filter-group">
          <label>Visibilidad:</label>
          <select
            value={filterVisibilidad}
            onChange={(e) => setFilterVisibilidad(e.target.value)}
          >
            <option>Todos</option>
            <option>publico</option>
            <option>privado</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option>Todos</option>
            <option>Aprobado</option>
            <option>Pendiente</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Personalizado:</label>
          <select
            value={filterPersonalizado}
            onChange={(e) => setFilterPersonalizado(e.target.value)}
          >
            <option>Todos</option>
            <option>Sí</option>
            <option>No</option>
          </select>
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="table-responsive">
        <table className="table align-middle mb-0 table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Personalizado</th>
              <th>ID Paciente</th>
              <th>Visibilidad</th>
              <th>Estado</th>
              <th>Autor</th>
              <th className="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExercises.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No hay ejercicios con esos filtros.
                </td>
              </tr>
            ) : (
              paginatedExercises.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.personalizado ? "Sí" : "No"}</td>
                  <td>{e.personalizado ? e.id_paciente || "—" : "—"}</td>
                  <td>{e.tipo}</td>
                  <td>
                    {e.revisado ? (
                      <span className="badge bg-success">Aprobado</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td>{e.creado_por || "—"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onEdit(e)}
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SRTable;
